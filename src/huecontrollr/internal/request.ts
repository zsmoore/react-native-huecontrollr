export const ROOT = 'api';

export interface ControllrRequest {
  readonly url: string;
}

export class BaseRequest implements ControllrRequest {
  private bridgeIp: string;
  private username: string;
  url: string;

  constructor(bridgeIp: string, username: string) {
    this.bridgeIp = bridgeIp;
    this.username = username;
    this.url = `http://${this.bridgeIp}/${ROOT}/${this.username}`;
  }

  appendToApiUrl(routeToAdd: string): BaseRequest {
    this.url += `/${routeToAdd}`;
    return this;
  }

  getSubApiRequest(subApiRoute: string): BaseRequest {
    return new BaseRequest(this.bridgeIp, this.username).appendToApiUrl(
      subApiRoute
    );
  }
}

export class SubApiRequest implements ControllrRequest {
  private subRequest: ControllrRequest;
  url: string;
  constructor(baseRequest: BaseRequest, subApiRoute: string) {
    this.subRequest = baseRequest.getSubApiRequest(subApiRoute);
    this.url = this.subRequest.url;
  }

  getRequest(subRoute: String): ControllrRequest {
    return {
      url: this.subRequest.url + `${subRoute}`,
    };
  }
}
