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

    if (pharmacyData.isSubsidiaryOf) {
      const headOffice = await this.pharmacyRepository.findById(
        pharmacyData.isSubsidiaryOf
      );

      if (!headOffice)
        return new Error(
          "Invalid head office (isSubsidiaryOf must be a valid pharmacyId)"
        );

      const subsidiaryCount = await this.pharmacyRepository.countSubsidiariesOf(
        headOffice.id
      );

      if (subsidiaryCount >= 3)
        return new Error("Each head office can only have up to 3 subsidiaries");
    } else {
      delete pharmacyData.isSubsidiaryOf;
    }

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

    if (pharmacyData.isSubsidiaryOf) {
      const subsidiarieCount =
        await this.pharmacyRepository.countSubsidiariesOf(
          pharmacyData.isSubsidiaryOf
        );

      if (subsidiarieCount >= 3)
        return new Error("Each head office can only have up to 3 subsidiaries");
    } else {
      delete pharmacyData.isSubsidiaryOf;
    }

    return await this.pharmacyRepository.update(pharmacyId, pharmacyData);
  };
  show = async (pharmacyId: string) => {
    const pharmacy = await this.pharmacyRepository.findById(pharmacyId);

    if (!pharmacy) return new Error("Pharmacy not found");

    const productIds = pharmacy.pharmacyProducts.map(
      ({ productId }) => productId
    );

    const productList =
      productIds.length > 0
        ? await this.productsClient.getProductsByIds(productIds)
        : { count: 0, products: [] };

    const productsWithUnitCount = productList.products.map(
      (product, index) => ({
        ...product,
        units: pharmacy.pharmacyProducts[index].unitsInStock,
      })
    );

    const parsedPharmacy = {
      ...pharmacy,
      products: [...productsWithUnitCount],
      isSubsidiaryOf: pharmacy?.isSubsidiaryOf,
    };

    return parsedPharmacy;
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
  unlinkProductFromAllPharmacies = async (productId: string) => {
    await this.pharmacyProductsRepository.unlinkProductFromAllPharmacies(
      productId
    );
  };
}
