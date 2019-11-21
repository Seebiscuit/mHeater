import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPI } from './../web-api';

import { State } from 'interfaces/State';
import { Point } from 'interfaces/Point';

const ea = new EventAggregator
const api = new WebAPI(ea)

export const updatePointMap = async (state: State, pointMap: Point[]) => {
  const newState = Object.assign({}, state);

  const newPointMap = await api.saveHeatMap(pointMap)
  
  newState.pointMap = [...newPointMap];

  return newState;
}

