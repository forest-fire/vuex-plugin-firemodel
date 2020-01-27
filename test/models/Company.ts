import { model, Model, property, encrypt, hasMany, fks } from 'firemodel'

@model()
export class Company extends Model {
  @property name: string;
  @hasMany('Person') employees: fks;
}