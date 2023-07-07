import * as cheerio from "cheerio";

export class HtmlParser {
  public readonly dom: cheerio.CheerioAPI;

  constructor(html: string) {
    this.dom = cheerio.load(html);
  }

  getElements(selector: string): cheerio.AnyNode[] {
    return this.dom(selector).toArray();
  }

  getElementText(selector: string): string | null {
    return this.dom(selector).first().text();
  }

  getElementAttribute(selector: string, attr: string): string | null {
    return this.dom(selector).attr(attr) ?? null;
  }
}
