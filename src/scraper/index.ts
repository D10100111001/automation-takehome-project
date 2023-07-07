import { appConfig } from "../app-config";
import { AmazonProductScraper } from "./amazon/product";
import { BaseProductScraper } from "./base-product-scraper";
import { EbayProductScraper } from "./ebay/product";

export const scrapers = [
  new AmazonProductScraper(appConfig.browser),
  new EbayProductScraper(appConfig.browser),
];

export function getScraper(name: string): BaseProductScraper | undefined {
  return scrapers.find((scraper) => scraper.name === name);
}
