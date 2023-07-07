import * as cheerio from "cheerio";

export const ResultsPageSelectors = {
  RESULTS: '[data-component-type="s-search-result"]',
};

export function parseResults(
  rootEl: cheerio.CheerioAPI,
): cheerio.AnyNode[] {
  return rootEl(
    ResultsPageSelectors.RESULTS,
  ).toArray();
}
