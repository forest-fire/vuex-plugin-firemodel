import { IFiremodelConfig, AsyncMockData } from "../../src/private";
import * as lifecycle from "./lifecycle";
import { IRootState } from "./index";
import { IDictionary } from "common-types";

const defaultData = async () => ({});

export const config = (data?: IDictionary | AsyncMockData) => {
  const cfg: IFiremodelConfig<IRootState> = {
    db: {
      mocking: true,
      mockAuth: {
        providers: ['emailPassword'],
        users: [{ email: "test@test.com", password: "foobar" }]
      },
      mockData: data || defaultData || {}
    },

    connect: true,
    auth: true,

    ...lifecycle
  };

  return cfg;

}
 
