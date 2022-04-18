import type { HueData } from '../data/hue-data';
import { TypeHint } from './generate';
import { get, post } from './network';
import { ROOT } from './request';

const DISCOVER_URL = 'https://discovery.meethue.com/';

export function getAllDevices(
  onResponse: (response: IpDiscoveryResponse) => void
) {
  get(
    {
      url: DISCOVER_URL,
    },
    TypeHint.IpDiscoveryResponseHint,
    onResponse
  );
}

export function createUser(
  applicationName: string,
  deviceName: string,
  ipAddress: string,
  onUserCreateResponse: (response: UserCreateResponse) => void
) {
  post(
    { url: `http://${ipAddress}/${ROOT}` },
    {
      applicationName: applicationName,
      deviceName: deviceName,
    },
    TypeHint.UserCreateBodyHint,
    TypeHint.UserCreateResponseHint,
    onUserCreateResponse
  );
}

export interface IpDiscoveryResponse extends HueData<IpDiscoveryResponse> {
  devices: Array<Device>;
}

export interface Device extends HueData<Device> {
  id: string;
  internalIpAddress: string;
}

export interface UserCreateBody extends HueData<UserCreateBody> {
  applicationName: string;
  deviceName: string;
}

export interface UserCreateResponse extends HueData<UserCreateResponse> {
  username: string;
}
