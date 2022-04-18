import Lights from './api/lights';
import {
  createUser,
  getAllDevices,
  IpDiscoveryResponse,
  UserCreateResponse,
} from './internal/login';
import { BaseRequest } from './internal/request';

export default class Controllr {
  bridgeIpAddress: string;
  userName: string;
  lights: Lights;

  private constructor(bridgeIpAddress: string, userName: string) {
    this.bridgeIpAddress = bridgeIpAddress;
    this.userName = userName;
    this.lights = new Lights(new BaseRequest(bridgeIpAddress, userName));
  }

  public static createFromIpAndUser(bridgeIpAddress: string, userName: string) {
    return new Controllr(bridgeIpAddress, userName);
  }

  public static createWithIpAndAutoCreateUserName(
    bridgeIpAddress: string,
    applicationName: string,
    deviceName: string,
    onControllrCreated: (controllr: Controllr) => void
  ) {
    createUser(
      applicationName,
      deviceName,
      bridgeIpAddress,
      (userCreateResponse: UserCreateResponse) => {
        onControllrCreated(
          new Controllr(bridgeIpAddress, userCreateResponse.username)
        );
      }
    );
  }

  public static createWithAutoIpAndUsername(
    applicationName: string,
    deviceName: string,
    onControllrCreated: (controllr: Controllr) => void
  ) {
    getAllDevices((response: IpDiscoveryResponse) => {
      const bridgeToUse = response.devices[0];
      createUser(
        applicationName,
        deviceName,
        bridgeToUse.internalIpAddress,
        (userCreateResponse: UserCreateResponse) => {
          onControllrCreated(
            new Controllr(
              bridgeToUse.internalIpAddress,
              userCreateResponse.username
            )
          );
        }
      );
    });
  }
}
