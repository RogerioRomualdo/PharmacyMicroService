import {
  paginationOptions,
  Pharmacy,
  PharmacyDTO,
  PharmacyList,
  Product,
} from "../../types";
import { Pharmacy as PharmacyEntity } from "../../../infra/database/models/Pharmacy";
import { PharmacyService } from "./PharmacyService";
import { returnAValidEntity, returnAValidPharmacy } from "../../../utils/test";
import { PharmacyProducts } from "../../../infra/database/models/PharmacyProducts";
import { ProductList } from "../../gateways/products/IProducts";

describe("Pharmacy service", () => {
  const MockPhramacyRepository = {
    index: jest.fn<Promise<PharmacyList>, [options: paginationOptions]>(),
    findById: jest.fn<
      Promise<PharmacyEntity | undefined>,
      [pharmacyId: string]
    >(),
    countSubsidiariesOf: jest.fn<Promise<Number>, [headOfficeId: string]>(),
    create: jest.fn<Promise<Pharmacy>, [pharmacyData: PharmacyDTO]>(),
    update: jest.fn<
      Promise<Pharmacy>,
      [pharmacyId: string, pharmacyData: Partial<PharmacyDTO>]
    >(),
    delete: jest.fn<Promise<void>, [phramacyId: string]>(),
    linkProductsToPharmacy: jest.fn<
      Promise<PharmacyEntity | Error>,
      [pharmacyId: string, productIds: Array<string>]
    >(),
  };

  const MockProductClient = {
    getProductsByIds: jest.fn<
      Promise<ProductList>,
      [productIds: Array<string>]
    >(),
  };

  const MockPharmacyProductsRepository = {
    linkProductsToPharmacy: jest.fn<
      Promise<void>,
      [pharmacy: PharmacyEntity, productIds: Array<string>]
    >(),
    getAllProductsLinkedToPharmacy: jest.fn<
      Promise<Array<PharmacyProducts>>,
      [pharmacy: Pharmacy]
    >(),
    unlinkProductFromAllPharmacies: jest.fn<
      Promise<void>,
      [productId: string]
    >(),
  };

  const pharmacyService = new PharmacyService(
    MockPhramacyRepository,
    MockProductClient,
    MockPharmacyProductsRepository
  );

  it("should be defined", () => {
    expect(pharmacyService).toBeDefined();
  });

  describe("Creating a pharmacy", () => {
    const validPharmacy = returnAValidPharmacy();

    it("should create a pharmacy", async () => {
      MockPhramacyRepository.create.mockReturnValue(
        new Promise((resolve) => resolve(validPharmacy))
      );

      const pharmacy = await pharmacyService.create({} as PharmacyDTO);

      expect(pharmacy).toEqual(validPharmacy);
      expect(MockPhramacyRepository.create).toBeCalledTimes(1);
    });

    it("shouldn't create a pharmacy (insufficient data)", async () => {
      const { id, ...pharmacyDTO } = returnAValidPharmacy({ name: "" });

      const pharmacy = await pharmacyService.create(pharmacyDTO);

      expect(MockPhramacyRepository.create).toBeCalledTimes(0);
      expect(pharmacy).toBeInstanceOf(Error);
    });
  });

  describe("Listing all phramacies", () => {
    const paginationOptions = { currentPage: 0, pageSize: 10 };
    const validPharmacy = returnAValidPharmacy();

    it("should return a list of pharmacies", async () => {
      const mockPharmacyList = {
        count: paginationOptions.pageSize,
        pharmacies: new Array(paginationOptions.pageSize).fill(validPharmacy),
      };

      MockPhramacyRepository.index.mockReturnValue(
        new Promise((resolve) => resolve(mockPharmacyList))
      );

      const pharmacyList = await pharmacyService.index(paginationOptions);

      expect(pharmacyList.pharmacies.length).toEqual(
        paginationOptions.pageSize
      );
      expect(pharmacyList.pharmacies.length).toEqual(pharmacyList.count);
      expect(pharmacyList).toBe(mockPharmacyList);
      expect(MockPhramacyRepository.index).toBeCalledTimes(1);
    });
  });

  describe("Updating a pharmacy", () => {
    const validPharmacy = returnAValidPharmacy();
    const { id, ...mockUpdatedPharmacy } = returnAValidPharmacy({
      name: "anotherPharmacyName",
    });

    it("should update a pharmacy", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(validPharmacy))
      );

      MockPhramacyRepository.update.mockReturnValue(
        new Promise((resolve) => resolve({ id, ...mockUpdatedPharmacy }))
      );

      const updatedPharmacy = await pharmacyService.update(
        validPharmacy.id,
        mockUpdatedPharmacy
      );

      expect(updatedPharmacy).toEqual({
        id: validPharmacy.id,
        ...mockUpdatedPharmacy,
      });
      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(MockPhramacyRepository.update).toBeCalledTimes(1);
    });

    it("shouldn't update a pharmacy (pharmacy not found)", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(undefined))
      );

      const updatedPharmacy = await pharmacyService.update(
        "notAValidId",
        mockUpdatedPharmacy
      );

      expect(updatedPharmacy).toBeInstanceOf(Error);
      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(MockPhramacyRepository.update).toBeCalledTimes(0);
    });

    it("shouldn't update a pharmcy (pharmacyData contains falsy fields)", async () => {
      const pharmacyWithFalsyFields = returnAValidPharmacy({ name: "" });

      const updatedPharmacy = await pharmacyService.update(
        id,
        pharmacyWithFalsyFields
      );

      expect(updatedPharmacy).toBeInstanceOf(Error);
      expect(MockPhramacyRepository.findById).toBeCalledTimes(0);
      expect(MockPhramacyRepository.update).toBeCalledTimes(0);
    });
  });

  describe("Showing a pharmacy", () => {
    const validPharmacy = returnAValidPharmacy();

    it("should return a pharmacy", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) =>
          resolve({ ...validPharmacy, pharmacyProducts: [] })
        )
      );

      MockProductClient.getProductsByIds.mockReturnValue(
        new Promise((resolve) => resolve({ count: 0, products: [] }))
      );

      const pharmacy = await pharmacyService.show(validPharmacy.id);

      expect(pharmacy).toEqual({
        ...validPharmacy,
        pharmacyProducts: [],
        products: [],
      });
      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
    });

    it("shouldn't return a pharmacy (pharmacy not found)", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(undefined))
      );

      const pharmacy = await pharmacyService.show(validPharmacy.id);

      expect(pharmacy).toBeInstanceOf(Error);
      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
    });
  });

  describe("Delete a pharmacy", () => {
    const pharmacy = returnAValidPharmacy();

    it("should delete a pharmacy", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(pharmacy))
      );

      MockPhramacyRepository.delete.mockReturnValue(
        new Promise((resolve) => resolve(undefined))
      );

      const returnedValue = await pharmacyService.delete(pharmacy.id);

      expect(returnedValue).toBeUndefined();
      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(MockPhramacyRepository.delete).toBeCalledTimes(1);
    });

    it("shouldn't delete a pharmacy (pharmacy not found)", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(undefined))
      );

      const returnedValue = await pharmacyService.delete(pharmacy.id);

      expect(returnedValue).toBeInstanceOf(Error);
      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(MockPhramacyRepository.delete).toBeCalledTimes(0);
    });
  });

  describe("Linking products to a pharmacy", () => {
    const validPharmacy = returnAValidPharmacy();
    const productIds = Array(5).fill(Math.random().toString());
    const productList = {
      count: 5,
      products: Array<Product>(5).fill(returnAValidEntity("product")),
    };

    it("should link all products to a pharmacy", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(validPharmacy))
      );

      MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy.mockReturnValue(
        new Promise((resolve) => resolve([]))
      );

      MockProductClient.getProductsByIds.mockReturnValue(
        new Promise((resolve) => resolve(productList))
      );

      MockPharmacyProductsRepository.linkProductsToPharmacy.mockReturnValue(
        new Promise((resolve) => resolve())
      );

      const pharmacyWithProducts = await pharmacyService.linkProductsToPhramacy(
        validPharmacy.id,
        productIds
      );

      expect(pharmacyWithProducts).not.toBeInstanceOf(Error);
      if (pharmacyWithProducts instanceof Error) return;

      expect(pharmacyWithProducts.products).toHaveLength(productIds.length);
      expect(pharmacyWithProducts.id).toEqual(validPharmacy.id);

      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy
      ).toBeCalledTimes(1);
      expect(MockProductClient.getProductsByIds).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.linkProductsToPharmacy
      ).toBeCalledTimes(1);
    });

    it("should link some products to a pharmacy", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(validPharmacy))
      );

      MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy.mockReturnValue(
        new Promise((resolve) =>
          resolve([
            {
              id: "anyPharmacyProductId",
              productId: "specificProductId",
              pharmacy: returnAValidPharmacy(),
              unitsInStock: 0,
            },
          ])
        )
      );

      MockProductClient.getProductsByIds.mockReturnValue(
        new Promise((resolve) => resolve(productList))
      );

      MockPharmacyProductsRepository.linkProductsToPharmacy.mockReturnValue(
        new Promise((resolve) => resolve())
      );

      const pharmacyWithProducts = await pharmacyService.linkProductsToPhramacy(
        validPharmacy.id,
        [...productIds, "specificProductId"]
      );

      expect(pharmacyWithProducts).not.toBeInstanceOf(Error);
      if (pharmacyWithProducts instanceof Error) return;

      expect(pharmacyWithProducts.products).toHaveLength(productIds.length);
      expect(pharmacyWithProducts.id).toEqual(validPharmacy.id);

      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy
      ).toBeCalledTimes(1);
      expect(MockProductClient.getProductsByIds).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.linkProductsToPharmacy
      ).toBeCalledTimes(1);
    });

    it("shouldn't link products to a pharmacy (pharmacy not found)", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(undefined))
      );

      const pharmacyWithProducts = await pharmacyService.linkProductsToPhramacy(
        validPharmacy.id,
        productIds
      );

      expect(pharmacyWithProducts).toBeInstanceOf(Error);

      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy
      ).toBeCalledTimes(0);
      expect(MockProductClient.getProductsByIds).toBeCalledTimes(0);
      expect(
        MockPharmacyProductsRepository.linkProductsToPharmacy
      ).toBeCalledTimes(0);
    });

    it("shouldn't link products to a pharmacy (all products are already linked)", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(validPharmacy))
      );

      MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy.mockReturnValue(
        new Promise((resolve) =>
          resolve([
            {
              id: "anyPharmacyProductId",
              productId: "sameIdAsAllOthersProducts",
              pharmacy: returnAValidPharmacy(),
              unitsInStock: 0,
            },
          ])
        )
      );

      const pharmacyWithProducts = await pharmacyService.linkProductsToPhramacy(
        validPharmacy.id,
        Array(5).fill("sameIdAsAllOthersProducts")
      );

      expect(pharmacyWithProducts).toBeInstanceOf(Error);

      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy
      ).toBeCalledTimes(1);
      expect(MockProductClient.getProductsByIds).toBeCalledTimes(0);
      expect(
        MockPharmacyProductsRepository.linkProductsToPharmacy
      ).toBeCalledTimes(0);
    });

    it("shouldn't link products to a pharmacy (all products are invalid)", async () => {
      MockPhramacyRepository.findById.mockReturnValue(
        new Promise((resolve) => resolve(validPharmacy))
      );

      MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy.mockReturnValue(
        new Promise((resolve) => resolve([]))
      );

      MockProductClient.getProductsByIds.mockReturnValue(
        new Promise((resolve) => resolve({ count: 0, products: [] }))
      );

      const pharmacyWithProducts = await pharmacyService.linkProductsToPhramacy(
        validPharmacy.id,
        productIds
      );

      expect(pharmacyWithProducts).toBeInstanceOf(Error);

      expect(MockPhramacyRepository.findById).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.getAllProductsLinkedToPharmacy
      ).toBeCalledTimes(1);
      expect(MockProductClient.getProductsByIds).toBeCalledTimes(1);
      expect(
        MockPharmacyProductsRepository.linkProductsToPharmacy
      ).toBeCalledTimes(0);
    });
  });
});
