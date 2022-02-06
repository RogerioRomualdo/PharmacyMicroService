import GetCLient from "../../../infra/pb/loader";
import { IProductsClient } from "./IProducts";

import dotenv from "dotenv";
dotenv.config();

export class ProductsClient implements IProductsClient {
  private productClient;

  constructor() {
    this.productClient = GetCLient({
      serviceName: "ProductService",
      address: `${process.env.APP_HOST}:${process.env.MSPRODUCT_PORT}`,
      fileName: "product",
    });
  }

  getProductsByIds = async (productIds: Array<string>) => {
    return this.productClient.getProductsByIds({ productIds });
  };
}
