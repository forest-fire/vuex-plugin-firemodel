import { IFiremodelConfig, AsyncMockData } from "../../src/private";
import * as lifecycle from "./lifecycle";
import { IRootState } from "./index";
import { IDictionary } from "common-types";
import { IMockConfig } from "universal-fire";

const defaultData = async () => ({});

export const config = (data?: IDictionary | AsyncMockData) => {
  const mockConfig: IMockConfig = {
    mocking: true,
    mockAuth: {
      providers: ['emailPassword'],
      users: [{ email: "test@test.com", password: "foobar" }]
    },
    mockData: data || defaultData || {}
  };

  return mockConfig;
}
