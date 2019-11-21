import { inject, bindable, observable, TaskQueue } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { customElement } from "aurelia-templating";

import { Grid } from "./../../interfaces/Grid";

import { State } from "./../../interfaces/State";
import { pluck } from "rxjs/operators";

import {
  calculateGridColor,
  calculateGridHits,
  BASE_HEATMAP_COLOR
} from "utility";

@customElement("draw-heatmap")
@connectTo<State>({
  selector: {
    pointMap: store => store.state.pipe(pluck("pointMap"))
  }
})
@inject(TaskQueue, Element)
export class DrawHeatMap {
  @bindable resolution: number = 12;
  @bindable opacity: number = 0.3;

  @observable container: any;

  @observable grid: Array<Grid>;

  rowSize: number;
  gridSide: number;

  public state: State;

  get columnSize(): number {
    return this.resolution;
  }

  constructor(private taskQueue: TaskQueue, private element: HTMLElement) {
    this.grid = [];
  }

  attached() {
    this.element.style["pointer-events"] = "none";

    this.onWindowResize = this.onWindowResize.bind(this);

    window.onresize = this.onWindowResize;

    this.onWindowResize();
  }

  onWindowResize() {
    this.container = {
      height: document.body.clientHeight,
      width: document.body.clientWidth
    };
  }

  containerChanged() {
    const side = (this.gridSide = Math.ceil(
      this.container.width / this.columnSize
    ));
    const numberOfRows = (this.rowSize = Math.ceil(
      this.container.height / side
    ));

    this.grid = [];

    for (let row = 0; row < numberOfRows; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        this.grid[row * this.columnSize + column] = {
          top: row * side,
          left: column * side,
          hits: 0,
          color: BASE_HEATMAP_COLOR
        };
      }
    }
  }

  pointMapChanged(pointMap) {
    if (Array.isArray(pointMap) && pointMap.length) {
      console.time("Updating Grid");
      this.grid = calculateGridColor(
        calculateGridHits(
          this.grid,
          pointMap,
          this.rowSize,
          this.columnSize,
          this.gridSide
        )
      );
      console.timeEnd("Updating Grid");
      console.time("Rendering Grid");
    }
  }

  gridChanged() {
    this.taskQueue.queueMicroTask(_ => console.timeEnd("Rendering Grid"));
  }
}
