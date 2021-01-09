import type { IAbcParam } from '@/types';
import { IPrimaryKey } from 'firemodel';

export function isDiscreteRequest<T>(request: IAbcParam<T>): request is IPrimaryKey<T>[] {
  return typeof request !== 'function';
}
