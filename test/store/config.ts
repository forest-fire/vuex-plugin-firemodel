import { IFiremodelConfig } from "../../src";
import * as lifecycle from './lifecycle'
import { IRootState } from ".";

export const config: IFiremodelConfig<IRootState> = {
  db: {
    mocking: true, mockAuth: {
      allowEmailLogins: true,
      validEmailUsers: [{ email: "test@test.com", password: 'foobar' }]
    }
  },

  connect: true,
  auth: true,

  lifecycle
}