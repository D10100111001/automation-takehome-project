import { Product } from "../models/product";

export interface ProductScraper {
  getProducts(
    query: string,
    sort: { key: "price"; order: "asc" | "desc" },
  ): Promise<Product[]>;
  baseUrl: string;
  name: string;
}
