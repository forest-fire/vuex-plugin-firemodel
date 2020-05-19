import { model, Model, property, encrypt, index, fk } from "firemodel";

@model()
export class Product extends Model {
  @property name: string;
  @property @index price: number;
  @property store: fk;
}
