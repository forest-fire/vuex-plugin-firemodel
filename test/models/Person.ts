import { model, Model, property, encrypt } from 'firemodel'

@model()
export class Person extends Model {
  @property name: string;
  @property age: number;
  @property gender: 'male' | 'female' | 'other' | 'unknown';
  @property @encrypt ssn: string;
}