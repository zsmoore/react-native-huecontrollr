import type { Light, State } from '../data/light/light';
import { TypeHint } from '../internal/generate';
import { batchGet, put } from '../internal/network';
import { SubApiRequest, BaseRequest } from '../internal/request';

const subAPIRoute = 'lights';
export default class Lights {
  private subApiRequest: SubApiRequest;
  constructor(baseRequest: BaseRequest) {
    this.subApiRequest = new SubApiRequest(baseRequest, subAPIRoute);
  }

  getAll(onResponse: (allLights: Map<Number, Light>) => void) {
    batchGet(this.subApiRequest, TypeHint.LightHint, onResponse);
  }

  putState(lightId: Number, state: State) {
    put(
      this.subApiRequest.getRequest(`${lightId}/state`),
      state,
      TypeHint.StateHint
    );
  }
}
