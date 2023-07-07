import { parsePrice } from "../../../parsers/price";
import * as cheerio from "cheerio";

const ProductCardSelectors = {
  ROOT: "li",
  PRICE: ".s-item__price",
  LINK: ".s-item__link",
  TITLE: ".s-item__title",
};

export function parseProductCard(
  root: cheerio.CheerioAPI,
  cardEl: cheerio.AnyNode,
) {
  const getEl = (selector: string) => root(selector, cardEl);
  const id = root(cardEl).attr("id")!;
  const name = getEl(ProductCardSelectors.TITLE).text()?.trim()!;
  const url = getEl(ProductCardSelectors.LINK).attr("href")!;
  const priceText = getEl(ProductCardSelectors.PRICE).text()!;

  const { price } = (priceText ? parsePrice(priceText) : null) ?? {};

  return {
    id,
    name,
    price: price!,
    url,
  };
}
