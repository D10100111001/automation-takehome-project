import * as cheerio from "cheerio";

export const ResultsPageSelectors = {
  RESULTS: ".srp-results .s-item",
};

export function parseResults(rootEl: cheerio.CheerioAPI): cheerio.AnyNode[] {
  return rootEl(
    ResultsPageSelectors.RESULTS,
  ).toArray();
}
