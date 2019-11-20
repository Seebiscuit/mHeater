import { HeatmapUpdated } from './../../messages';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPI } from './../../web-api';
import { bindable, noView, inject } from "aurelia-framework";
import { Point } from "../../interfaces/Point"; 

@noView
@inject(WebAPI,EventAggregator)
export class CaptureCoords {
  MAX_BUFFER = 100

  @bindable containerSelector: string
  
  container: Document | Element = window.document

  _pointBuffer: Array<Point> = []

  constructor(private api: WebAPI, private ea: EventAggregator) {
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  async attached() {
    const coordMap = await this.api.getHeatMap()

    if (coordMap && coordMap.length) {
      this.ea.publish(new HeatmapUpdated(coordMap))
    }

    if (this.containerSelector) 
      this.container = this.container.querySelector(this.containerSelector) || window.document

    this.container.addEventListener("mousemove", this.onMouseMove, true)
  }

  onMouseMove(event: MouseEvent) {
    this.pointBuffer = { x: event.pageX, y: event.pageY}
    
  }

  set pointBuffer(point: Point) {
    if (this._pointBuffer.length >= this.MAX_BUFFER) {
      this.api.saveHeatMap([...this._pointBuffer])
      console.log("pointBuffer Saved")

      this._pointBuffer = []
    }

    this._pointBuffer.push(point)
  }

  detached() {
    this.container.removeEventListener("mousemove", this.onMouseMove, true)    
  }
}