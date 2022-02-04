import { Server } from "@grpc/grpc-js";
import { PharmacyController } from "../../core/controllers/pharmacy/PharmacyController";
import { PharmacyService } from "../../core/services/pharmacy/PharmacyService";
import { PharmacyRepository } from "../../core/repositories/pharmacy/PharmacyRepository";
import { ProductsClient } from "../../core/gateways/products/Products";
import { PharmacyProductsRepository } from "../../core/repositories/pharmacyProducts/PharmacyProducts";

const pharmacyRepository = new PharmacyRepository();
const productsClient = new ProductsClient();
const pharmacyProductsRepository = new PharmacyProductsRepository();
const pharmacyService = new PharmacyService(
  pharmacyRepository,
  productsClient,
  pharmacyProductsRepository
);
const pharmacyController = new PharmacyController(pharmacyService);

export default (server: Server, proto: any) => {
  server.addService(proto, pharmacyController as any);
};
