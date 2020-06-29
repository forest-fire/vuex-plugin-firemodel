import { model, Model, property, encrypt, index } from "firemodel";

@model({ dbOffset: '/store/:store' })
export class Order extends Model {
  @property name: string;
  @property @index price: number;
  @property store: string;
}
