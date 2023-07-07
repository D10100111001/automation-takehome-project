import { parseResults, ResultsPageSelectors } from "./parsers/results-page";
import { parseProductCard } from "./parsers/product-card";
import { Product } from "../../models/product";
import { BaseProductScraper } from "../base-product-scraper";
import { logger } from "../../utils/logger";
import * as cheerio from "cheerio";

export class AmazonProductScraper extends BaseProductScraper {
  readonly name = "amazon";
  readonly baseUrl = "https://amazon.com";

  async getProducts(
    query: string,
    sort?: { key: "price"; order: "asc" | "desc" },
  ): Promise<Product[]> {
    const resultsPageHtml = await this.crawlSearchResultsPageInteractively(
      query,
    );
    const parser = cheerio.load(resultsPageHtml);

    const productCards = parseResults(parser);
    const products = productCards
      .map((c) => parseProductCard(parser, c));

    return products.map((p) => ({
      ...p,
      url: `${this.baseUrl}${p.url}`,
    }));
  }

  private async crawlSearchResultsPageStatically(
    searchTerm: string,
  ): Promise<string> {
    const searchTermUri = encodeURIComponent(searchTerm);
    const searchPageUrl =
      `https://www.amazon.com/s?k=${searchTermUri}&s=price-asc-rank`;
    return this.getPageHtml(searchPageUrl);
  }

  private async crawlSearchResultsPageInteractively(
    searchTerm: string,
  ): Promise<string> {
    return this.spawnPage(this.baseUrl, async (page) => {
      logger.info(`searching for ${searchTerm}...`);
      const searchInput = page.getByLabel("Search Amazon");
      await searchInput.fill(searchTerm);
      await searchInput.press("Enter");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      logger.info(`selecting low-to-high price sorting...`);
      await page.locator("#s-result-sort-select").selectOption(
        "Price: Low to High",
      );
      await page.waitForSelector(ResultsPageSelectors.RESULTS);

      logger.info("downloading results page content...");
      const html = await page.content();
      logger.info("page content downloaded successfully");
      return html;
    });
  }
}
