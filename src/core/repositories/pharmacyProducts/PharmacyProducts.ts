import { getRepository, Repository } from "typeorm";
import { Pharmacy } from "../../../infra/database/models/Pharmacy";
import { PharmacyProducts } from "../../../infra/database/models/PharmacyProducts";
import { IPharmacyProductsRepository } from "./IPharmacyProducts";

export class PharmacyProductsRepository implements IPharmacyProductsRepository {
  private typeOrm: Repository<PharmacyProducts>;

  constructor() {
    this.typeOrm = getRepository(PharmacyProducts);
  }

  linkProductsToPharmacy = async (
    pharmacy: Pharmacy,
    productIds: Array<string>
  ) => {
    await Promise.all(
      productIds.map((productId) => {
        this.typeOrm.save({ pharmacy, productId, unitsInStock: 0 });
      })
    );
  };

  getAllProductsLinkedToPharmacy = async (pharmacy: Pharmacy) => {
    return await this.typeOrm.find({ where: { pharmacy } });
  };

  unlinkProductFromAllPharmacies = async (productId: string) => {
    console.log(productId);
    await this.typeOrm.delete({ productId });
  };
}
