import GetCLient from "../../../infra/pb/loader";
import { IProductsClient } from "./IProducts";

export class ProductsClient implements IProductsClient {
  private productClient;

  constructor() {
    this.productClient = GetCLient({
      serviceName: "ProductService",
      address: "localhost:8088",
      fileName: "product",
    });
  }

  getProductsByIds = async (productIds: Array<string>) => {
    return this.productClient.getProductsByIds({ productIds });
  };
}
