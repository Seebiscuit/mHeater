import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, bindable, observable } from 'aurelia-framework';
import { customElement } from 'aurelia-templating';
import { HeatmapUpdated } from "../../messages";
import { calculateGridColor, calculateGridHits } from 'utility';

@inject(EventAggregator)
@customElement('draw-heatmap')
export class DrawHeatMap {
  @bindable resolution: number = 12
  @bindable opacity: number = 0.3

  @observable container: any

  grid: Array<any>
  rowSize: number
  gridSide: number
  
  get columnSize(): number {
    return this.resolution
  }

  constructor(private ea: EventAggregator) {
    ea.subscribe(HeatmapUpdated, data => this.onHeatmapUpdated(data.coordMap))
    
    this.grid = []
  }

  attached() {
    this.onWindowResize = this.onWindowResize.bind(this)
    
    window.onresize = this.onWindowResize

    this.onWindowResize()
  }

  onWindowResize() {
    this.container = { height: document.body.clientHeight, width: document.body.clientWidth }
  }

  containerChanged() {
    const side = this.gridSide = Math.ceil(this.container.width / this.columnSize)
    const numberOfRows = this.rowSize = Math.ceil(this.container.height / side)

    this.grid = []

    for (let row = 0; row < numberOfRows; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        this.grid[row * this.columnSize + column] = {
          top: row * side,
          left: column * side,
          hits: 0
        }
      }
    }
  }

  onHeatmapUpdated(coordMap) {
    this.grid = calculateGridColor(calculateGridHits(this.grid, coordMap, this.rowSize, this.columnSize, this.gridSide))
  }
}