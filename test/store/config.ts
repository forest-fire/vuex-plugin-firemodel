import * as lifecycle from "./lifecycle";

import { AsyncMockData, IFiremodelConfig } from "@/index";

import { IDictionary } from "common-types";
import { IMockConfig } from "universal-fire";
import { IRootState } from "./index";

const defaultData = async () => ({});

export const config = (data?: IDictionary | AsyncMockData) => {
  const mockConfig: IMockConfig = {
    mocking: true,
    mockAuth: {
      providers: ["emailPassword"],
      users: [{ email: "test@test.com", password: "foobar" }]
    },
    mockData: data || defaultData || {}
  };

  return mockConfig;
};
