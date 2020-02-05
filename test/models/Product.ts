import { model, Model, property, encrypt, index } from "firemodel";

@model()
export class Product extends Model {
  @property name: string;
  @property @index price: number;
}
