import { IPharmacyRepository } from "../../repositories/pharmacy/IPharmacyRepository";
import { PharmacyDTO, paginationOptions, PharmacyList } from "../../types";
import { IPharmacyService } from "./IPharmacyService";
import { Validator } from "../../../utils/validator";
import { IProductsClient } from "../../gateways/products/IProducts";
import { IPharmacyProductsRepository } from "../../repositories/pharmacyProducts/IPharmacyProducts";

export class PharmacyService implements IPharmacyService {
  private validator;

  constructor(
    private pharmacyRepository: IPharmacyRepository,
    private productsClient: IProductsClient,
    private pharmacyProductsRepository: IPharmacyProductsRepository
  ) {
    this.validator = new Validator();
  }

  create = async (pharmacyData: PharmacyDTO) => {
    const validationError = this.validator.ValidateFalsyFields(pharmacyData, [
      "isSubsidiaryOf",
    ]);

    if (validationError) return validationError;

    return await this.pharmacyRepository.create(pharmacyData);
  };
  index = async (options: paginationOptions) => {
    return await this.pharmacyRepository.index(options);
  };
  update = async (pharmacyId: string, pharmacyData: Partial<PharmacyDTO>) => {
    const validationError = this.validator.ValidateFalsyFields(pharmacyData, [
      "isSubsidiaryOf",
    ]);

    if (validationError) return validationError;

    const pharmacy = await this.pharmacyRepository.findById(pharmacyId);

    if (!pharmacy) return new Error("Pharmacy not found");

    return await this.pharmacyRepository.update(pharmacyId, pharmacyData);
  };
  show = async (pharmacyId: string) => {
    const pharmacy = await this.pharmacyRepository.findById(pharmacyId);

    if (!pharmacy) return new Error("Pharmacy not found");

    const productIds = pharmacy.pharmacyProducts.map(
      ({ productId }) => productId
    );

    const products = await this.productsClient.getProductsByIds(productIds);

    return {
      ...pharmacy,
      products: products.products.map((product, index) => ({
        ...product,
        units: pharmacy.pharmacyProducts[index].unitsInStock,
      })),
    };
  };
  delete = async (pharmacyId: string) => {
    const pharmacy = await this.pharmacyRepository.findById(pharmacyId);

    if (!pharmacy) return new Error("Pharmacy not found");

    await this.pharmacyRepository.delete(pharmacy.id);
  };
  linkProductsToPhramacy = async (
    pharmacyId: string,
    productIds: Array<string>
  ) => {
    const pharmacy = await this.pharmacyRepository.findById(pharmacyId);

    if (!pharmacy) return new Error("Pharmacy not found");

    const allProductsFromPharmacy =
      await this.pharmacyProductsRepository.getAllProductsLinkedToPharmacy(
        pharmacy
      );

    const allProductsFromPharmacyIds = allProductsFromPharmacy.map(
      ({ productId }) => productId
    );

    const newProductsToLink = productIds.filter(
      (productId) => !allProductsFromPharmacyIds.includes(productId)
    );

    if (newProductsToLink.length === 0)
      return new Error("No new products to link");

    const productList = await this.productsClient.getProductsByIds(
      newProductsToLink
    );

    if (productList.count == 0)
      return new Error("All ids were already linked or invalid");

    await this.pharmacyProductsRepository.linkProductsToPharmacy(
      pharmacy,
      productList.products.map(({ id }) => id)
    );

    return {
      ...pharmacy,
      products: productList.products.map((product) => ({
        ...product,
        units: 0,
      })),
    };
  };
}
