import { loadEnvVar } from "./utils/env";

export const appConfig = {
  maxRetryAttempt: loadEnvVar("APP_MAX_RETRY_ATTEMPT", 3),
  productCsvPath: loadEnvVar("APP_PRODUCT_CSV_PATH", "./out/products.csv"),
  browser: {
    headless: loadEnvVar("APP_BROWSER_HEADLESS", false),
    browserLaunchTimeout: loadEnvVar("APP_BROWSER_LAUNCH_TIMEOUT_MS", 30000),
    defaultTimeout: loadEnvVar("APP_PAGE_DEFAULT_TIMEOUT_MS", 30000),
    navigationTimeout: loadEnvVar("APP_PAGE_NAVIGATION_TIMEOUT_MS", 30000),
  },
};
