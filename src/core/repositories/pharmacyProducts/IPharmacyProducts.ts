import { Pharmacy } from "../../../infra/database/models/Pharmacy";
import { PharmacyProducts } from "../../../infra/database/models/PharmacyProducts";

export interface IPharmacyProductsRepository {
  linkProductsToPharmacy: (
    pharmacy: Pharmacy,
    productIds: Array<string>
  ) => Promise<void>;
  getAllProductsLinkedToPharmacy: (
    pharmacy: Pharmacy
  ) => Promise<Array<PharmacyProducts>>;
  unlinkProductFromAllPharmacies: (productId: string) => Promise<void>;
}
