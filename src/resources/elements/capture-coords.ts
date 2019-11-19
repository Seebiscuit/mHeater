import { WebAPI } from './../../web-api';
import { bindable, noView, inject } from "aurelia-framework";
import { Point } from "../../interfaces/Point"; 

@noView
@inject(WebAPI)
export class CaptureCoords {
  MAX_BUFFER = 100

  _pointBuffer: Array<Point> = []
  document: Document = window.document

  constructor(private api: WebAPI) {
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  attached() {
    this.document.addEventListener("mousemove", this.onMouseMove, true)
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
    this.document.removeEventListener("mousemove", this.onMouseMove, true)    
  }
}