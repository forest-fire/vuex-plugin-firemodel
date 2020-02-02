import { IFiremodelConfig } from "../../src";
import * as lifecycle from "./lifecycle";
import { IRootState } from ".";
import { IDictionary } from "firemock";
import { AsyncMockData } from "firemock/dist/esnext/@types/config-types";

const defaultData = async () => ({});

export const config = (data?: IDictionary | AsyncMockData) =>
  ({
    db: {
      mocking: true,
      mockAuth: {
        allowEmailLogins: true,
        validEmailUsers: [{ email: "test@test.com", password: "foobar" }]
      },
      mockData: data || defaultData || {}
    },

    connect: true,
    auth: true,

    ...lifecycle
  } as IFiremodelConfig<IRootState>);
