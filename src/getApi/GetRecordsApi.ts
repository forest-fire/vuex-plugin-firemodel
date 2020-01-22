import { IModelConstructor, Model } from "firemodel";

export interface IGetRecordsConfig {}

export class GetRecordsApi {
  constructor(protected moduleConfiguration: IGetRecordsConfig) {}

  public getRecords<T extends Model>(model: IModelConstructor<T>) {
    //
  }

  get config() {
    return "";
  }
}
