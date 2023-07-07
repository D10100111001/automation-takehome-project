import prompts from "prompts";
import { getScraper } from "./scraper";
import { logger } from "./utils/logger";
import { appConfig } from "./app-config";
import { Product, StoredProduct } from "./models/product";
import { CsvService } from "./services/csv-storage";

async function run() {
  if (process.argv.length < 3) {
    return console.error(
      "\x1b[41m Run script with which marketplace to use!\x1b[0m",
    );
  }

  const [_, __, marketplace, queryArg] = process.argv;
  const scraper = getScraper(marketplace);

  if (!scraper) {
    return console.error(
      `\x1b[41m Marketplace ${marketplace} not found!\x1b[0m`,
    );
  }

  const query = queryArg ?? await getResponseFromPrompt(
    "What product do you want to search?",
  );

  logger.info(`retrieving products from ${marketplace}...`);
  let attemptsLeft = appConfig.maxRetryAttempt;
  let products: Product[] | null = null;
  while (attemptsLeft > 0 && !products) {
    try {
      products = await scraper.getProducts(query);
      logger.info(
        `retrieved ${products.length} products from ${marketplace}`,
      );
    } catch {
      logger.warn(
        `failed to scrape products,  ${--attemptsLeft} attempts left`,
      );
    }
  }
  if (!products) {
    logger.error(`unable to scrape ${marketplace}`);
    return;
  }

  logger.info("saving data to csv file...");
  const csvService = new CsvService<StoredProduct>(appConfig.productCsvPath);
  // searchTerm, marketplace, to csv
  await csvService.insert(
    products.slice(0, 3).map((p) => ({
      query,
      marketplace,
      ...p,
    })),
  );
  logger.info("successfully saved data");

  await scraper.cleanup();
  logger.info("done!");
}

async function getResponseFromPrompt(question: string) {
  const { response } = await prompts({
    type: "text",
    name: "response",
    message: question,
    validate: (response) => !!response?.trim(),
  });
  return response;
}

try {
  run();
} catch (e) {
  console.error(e);
}
