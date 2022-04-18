import type { HueData } from '../hue-data';

export interface Light extends HueData<Light> {
  state: State;
}

export interface State extends HueData<State> {
  on: boolean;
  brightness: number;
  hue: number;
  saturation: number;
  effect: string;
  xy: XY;
  colorTemperature: number;
  alert: string;
  colorMode: string;
  mode: string;
  reachable: boolean;
}

export interface XY extends HueData<XY> {
  x: number;
  y: number;
}
