import { bindable, noView, inject } from "aurelia-framework";

import { HeatmapUpdated } from './../../messages';
import { EventAggregator } from 'aurelia-event-aggregator';

import { State } from 'interfaces/State';
import { Store } from 'aurelia-store';
import { Point } from "../../interfaces/Point"; 

import { WebAPI } from './../../web-api';

@noView
@inject(WebAPI,EventAggregator, Store)
export class CaptureCoords {
  MAX_BUFFER = 100

  @bindable containerSelector: string
  
  container: Document | Element = window.document

  _pointBuffer: Array<Point> = []

  public state: State;

  constructor(private api: WebAPI, private ea: EventAggregator, private store: Store<State>) {
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
      this.store.dispatch('UpdatePointMap', this._pointBuffer)

      this._pointBuffer = []
    }

    this._pointBuffer.push(point)
  }

  detached() {
    this.container.removeEventListener("mousemove", this.onMouseMove, true)    
  }
}