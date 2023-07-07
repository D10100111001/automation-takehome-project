import { parsePrice } from "../../../parsers/price";
import * as cheerio from "cheerio";

const ProductCardSelectors = {
  ROOT: "div",
  LINK: "h2 a",
  PRICE: ".a-price .a-offscreen",
};

export function parseProductCard(
  root: cheerio.CheerioAPI,
  cardEl: cheerio.AnyNode,
) {
  const getEl = (selector: string) => root(selector, cardEl);
  const id = root(cardEl).attr("data-asin")!;
  const name = getEl(ProductCardSelectors.LINK).text();
  const url = getEl(ProductCardSelectors.LINK).attr("href")!;
  const priceText = getEl(ProductCardSelectors.PRICE).text();

  const { price } = (priceText ? parsePrice(priceText) : null) ?? {};

  return {
    id,
    name,
    price: price!,
    url,
  };
}
