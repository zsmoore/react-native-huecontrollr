import { DataGenerator } from '../data/hue-data';
import type { Light, State, XY } from '../data/light/light';
import type {
  Device,
  IpDiscoveryResponse,
  UserCreateBody,
  UserCreateResponse,
} from './login';

export enum TypeHint {
  UserCreateBodyHint,
  UserCreateResponseHint,
  DeviceHint,
  IpDiscoveryResponseHint,
  XYHint,
  StateHint,
  LightHint,
}

export function generate<T>(input: any, typeHint: TypeHint): T | null {
  switch (typeHint) {
    case TypeHint.UserCreateBodyHint: {
      return new UserCreateBodyDeserializer().process(input) as unknown as T;
    }
    case TypeHint.UserCreateResponseHint: {
      return new UserCreateResponseDeserializer().process(
        input
      ) as unknown as T;
    }
    case TypeHint.DeviceHint: {
      return new DeviceDeserializer().process(input) as unknown as T;
    }
    case TypeHint.IpDiscoveryResponseHint: {
      return new IpDiscoveryResponseDeserializer().process(
        input
      ) as unknown as T;
    }
    case TypeHint.XYHint: {
      return new XYDeserializer().process(input) as unknown as T;
    }
    case TypeHint.StateHint: {
      return new StateDeserializer().process(input) as unknown as T;
    }
    case TypeHint.LightHint: {
      return new LightDeserializer().process(input) as unknown as T;
    }
  }
}

export function formatForPost<T>(input: T, typeHint: TypeHint): any {
  switch (typeHint) {
    case TypeHint.UserCreateBodyHint: {
      return new UserCreateBodyDeserializer().formatForPost(
        input as unknown as UserCreateBody
      ) as unknown as T;
    }
    case TypeHint.UserCreateResponseHint: {
      return new UserCreateResponseDeserializer().formatForPost(
        input as unknown as UserCreateResponse
      ) as unknown as T;
    }
    case TypeHint.DeviceHint: {
      return new DeviceDeserializer().formatForPost(input as unknown as Device);
    }
    case TypeHint.IpDiscoveryResponseHint: {
      return new IpDiscoveryResponseDeserializer().formatForPost(
        input as unknown as IpDiscoveryResponse
      ) as unknown as T;
    }
    case TypeHint.XYHint: {
      return new XYDeserializer().formatForPost(
        input as unknown as XY
      ) as unknown as T;
    }
    case TypeHint.StateHint: {
      return new StateDeserializer().formatForPost(
        input as unknown as State
      ) as unknown as T;
    }
    case TypeHint.LightHint: {
      return new LightDeserializer().formatForPost(
        input as unknown as Light
      ) as unknown as T;
    }
  }
}

class LightDeserializer extends DataGenerator<Light> {
  fromJsonArray?: ((jsonArray: any[]) => Light) | undefined;
  fromJsonObject?: ((jsonObject: any) => Light) | undefined = (jsonObject) => {
    return {
      state: new StateDeserializer().process(jsonObject.state)!,
    };
  };

  formatForPost: (toFormat: Light) => any = (toFormat) => {
    return JSON.stringify({
      state: new StateDeserializer().formatForPost(toFormat.state),
    });
  };
}

class StateDeserializer extends DataGenerator<State> {
  fromJsonArray?: ((jsonArray: any[]) => State) | undefined;
  fromJsonObject?: ((jsonObject: any) => State) | undefined = (jsonObject) => {
    return {
      on: jsonObject.on === 'true',
      brightness: parseInt(jsonObject.bri, 10),
      hue: parseInt(jsonObject.hue, 10),
      saturation: parseInt(jsonObject.sat, 10),
      effect: jsonObject.effect,
      xy: new XYDeserializer().process(jsonObject.xy)!,
      colorTemperature: parseInt(jsonObject.ct, 10),
      alert: jsonObject.alert,
      colorMode: jsonObject.colormode,
      mode: jsonObject.mode,
      reachable: jsonObject.reachable === 'true',
    };
  };

  formatForPost: (toFormat: State) => any = (toFormat) => {
    return JSON.stringify({
      on: toFormat.on,
      bri: toFormat.brightness,
      hue: toFormat.hue,
      sat: toFormat.saturation,
      effect: toFormat.effect,
      xy: new XYDeserializer().formatForPost(toFormat.xy),
      ct: toFormat.colorTemperature,
      alert: toFormat.alert,
      colorMode: toFormat.colorMode,
      mode: toFormat.mode,
      reachable: toFormat.reachable,
    });
  };
}

class XYDeserializer extends DataGenerator<XY> {
  fromJsonObject?: ((jsonObject: any) => XY) | undefined;
  fromJsonArray?: ((jsonArray: any[]) => XY) | undefined = (jsonArray) => {
    return {
      x: parseFloat(jsonArray[0]),
      y: parseFloat(jsonArray[1]),
    };
  };

  formatForPost: (toFormat: XY) => any = (toFormat) => {
    return JSON.stringify([toFormat.x, toFormat.y]);
  };
}

class IpDiscoveryResponseDeserializer extends DataGenerator<IpDiscoveryResponse> {
  fromJsonObject?: ((jsonObject: any) => IpDiscoveryResponse) | undefined;
  fromJsonArray?: ((jsonArray: any[]) => IpDiscoveryResponse) | undefined = (
    jsonArray
  ) => {
    const devices: Array<Device> = [];
    jsonArray.forEach((el) => {
      const device = new DeviceDeserializer().process(el);
      if (device) {
        devices.push(device);
      }
    });
    return {
      devices: devices,
    };
  };

  formatForPost: (toFormat: IpDiscoveryResponse) => any = (toFormat) => {
    return JSON.stringify(
      toFormat.devices.map((el) => new DeviceDeserializer().formatForPost(el))
    );
  };
}

class DeviceDeserializer extends DataGenerator<Device> {
  fromJsonArray?: ((jsonArray: any[]) => Device) | undefined;
  fromJsonObject?: ((jsonObject: any) => Device) | undefined = (jsonObject) => {
    return {
      id: jsonObject.id,
      internalIpAddress: jsonObject.internalipaddress,
    };
  };

  formatForPost: (toFormat: Device) => any = (toFormat) => {
    return JSON.stringify({
      id: toFormat.id,
      internalipaddress: toFormat.internalIpAddress,
    });
  };
}

class UserCreateBodyDeserializer extends DataGenerator<UserCreateBody> {
  fromJsonArray?: ((jsonArray: any[]) => UserCreateBody) | undefined;
  fromJsonObject?: ((jsonObject: any) => UserCreateBody) | undefined = (
    jsonObject
  ) => {
    return {
      applicationName: jsonObject.devicetype.split('#')[0],
      deviceName: jsonObject.devicetype.split('#')[1],
    };
  };

  formatForPost: (toFormat: UserCreateBody) => any = (toFormat) => {
    return JSON.stringify({
      devicetype: `${toFormat.applicationName}#${toFormat.deviceName}`,
    });
  };
}

class UserCreateResponseDeserializer extends DataGenerator<UserCreateResponse> {
  fromJsonObject?: ((jsonObject: any) => UserCreateResponse) | undefined;
  fromJsonArray: (jsonArray: any[]) => UserCreateResponse = (jsonArray) => {
    const obj = jsonArray[0];
    return {
      username: obj.success.username,
    };
  };

  formatForPost: (toFormat: UserCreateResponse) => any = (toFormat) => {
    return JSON.stringify(toFormat);
  };
}
