import { model, Model, property, encrypt } from 'firemodel'

@model()
export class Product extends Model {
  @property name: string;
  @property price: number;
}