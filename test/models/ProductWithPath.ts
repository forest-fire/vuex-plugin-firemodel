import { model, Model, property, encrypt, index } from "firemodel";

@model({ dbOffset: ':store' })
export class ProductWithPath extends Model {
  @property name: string;
  @property @index price: number;
  @property store: string;
}
