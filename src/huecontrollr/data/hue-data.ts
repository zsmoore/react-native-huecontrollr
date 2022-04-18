export interface HueData<T extends HueData<T>> {}

interface ToPostData<T extends HueData<T>> {
  formatForPost: (toFormat: T) => any;
}

interface FromJSON<T extends HueData<T>> {
  fromJsonObject?: (jsonObject: any) => T;
  fromJsonArray?: (jsonArray: Array<any>) => T;
}

export abstract class DataGenerator<T extends HueData<T>>
  implements FromJSON<T>, ToPostData<T>
{
  process(input: Array<any> | any): T | null {
    if (input instanceof Array && this.fromJsonArray) {
      return this.fromJsonArray(input);
    } else if (this.fromJsonObject) {
      return this.fromJsonObject(input);
    }
    return null;
  }

  abstract fromJsonObject?: (jsonObject: any) => T;
  abstract fromJsonArray?: (jsonArray: Array<any>) => T;
  abstract formatForPost: (toFormat: T) => any;
}
