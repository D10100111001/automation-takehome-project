import { parseResults, ResultsPageSelectors } from "./parsers/results-page";
import { parseProductCard } from "./parsers/product-card";
import { BaseProductScraper } from "../base-product-scraper";
import { Product } from "../../models/product";
import * as cheerio from "cheerio";
import { logger } from "../../utils/logger";

export class EbayProductScraper extends BaseProductScraper {
  readonly name = "ebay";
  readonly baseUrl = "https://ebay.com";

  async getProducts(
    query: string,
    // sort: { key: "price"; order: "asc" | "desc" },
  ): Promise<Product[]> {
    const resultsPageHtml = await this.crawlSearchResultsPage(query);
    const parser = cheerio.load(resultsPageHtml);
    const productCards = parseResults(parser);
    const products = productCards
      .map((c) => parseProductCard(parser, c));

    return products;
  }

  private async crawlSearchResultsPage(query: string): Promise<string> {
    return this.spawnPage(this.baseUrl, async (page) => {
      logger.info(`searching for ${query}...`);
      const searchInput = page.getByPlaceholder("Search for anything");
      await searchInput.fill(query);
      await searchInput.press("Enter");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      logger.info(`selecting low-to-high price sorting...`);
      await page.getByLabel("Best Match selected").click();
      await page.getByText("Price + Shipping: lowest first").click();

      await page.waitForSelector(ResultsPageSelectors.RESULTS);

      logger.info("downloading results page content...");
      const html = await page.content();
      logger.info("page content downloaded successfully");
      return html;
    });
  }
}
