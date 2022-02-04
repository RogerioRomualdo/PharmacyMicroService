import { Product } from "../../types";

export type ProductList = {
  count: number;
  products: Array<Product>;
};

export interface IProductsClient {
  getProductsByIds: (productIds: Array<string>) => Promise<ProductList>;
}
