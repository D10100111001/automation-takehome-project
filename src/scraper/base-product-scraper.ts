import { Browser, Page } from "playwright";
import { ProductScraper } from "./product-scraper";
import { Product } from "../models/product";
import { logger } from "../utils/logger";
import { chromium } from "playwright-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { appConfig } from "../app-config";

export abstract class BaseProductScraper implements ProductScraper {
  abstract name: string;
  abstract baseUrl: string;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(
    private readonly options: typeof appConfig.browser,
  ) {}

  async getBrowserInstance(): Promise<Browser> {
    if (this.browser) return this.browser;
    chromium.use(stealthPlugin());
    logger.info("launching browser...");
    this.browser = await chromium.launch({
      headless: this.options.headless,
      timeout: this.options.browserLaunchTimeout,
    });
    logger.info("successfully launched browser");
    return this.browser;
  }

  async getPageInstance(createNewInstance: boolean = false): Promise<Page> {
    if (!createNewInstance && this.page) return this.page;
    chromium.use(stealthPlugin());
    logger.info("creating new page...");
    if (createNewInstance) this.page?.close();
    this.page = await (await this.getBrowserInstance()).newPage();
    await this.page.setDefaultTimeout(this.options.defaultTimeout);
    await this.page.setDefaultNavigationTimeout(this.options.navigationTimeout);
    logger.info("successfully created new page");
    return this.page;
  }

  async spawnPage<T>(
    url: string,
    callback: (page: Page) => T,
    timeoutMs: number = 2000,
  ): Promise<T> {
    let page: Page | null = null;
    try {
      page = await this.getPageInstance(true);
      logger.info(`loading page ${url}...`);
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(timeoutMs);
      logger.info("loaded successfully");
      return await callback(page);
    } finally {
      await page?.close();
    }
  }

  async getPageHtml(url: string): Promise<string> {
    return this.spawnPage(url, async (page) => {
      logger.info("downloading page content...");
      const html = await page.content();
      logger.info("page content downloaded successfully");
      return html;
    });
  }

  async cleanup(): Promise<void> {
    if (!this.browser) return;
    logger.info("closing browser...");
    await this.browser.close();
    logger.info("successfully closed browser");
  }

  abstract getProducts(
    query: string,
    sort?: { key: "price"; order: "asc" | "desc" },
  ): Promise<Product[]>;
}
