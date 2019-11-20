import {FrameworkConfiguration, PLATFORM} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./elements/loading-indicator'),
    PLATFORM.moduleName('./elements/capture-coords'),
    PLATFORM.moduleName('./elements/draw-heatmap')
  ]);
}
