import {
  paginationOptions,
  Pharmacy,
  PharmacyDTO,
  PharmacyList,
} from "../../types";
import { PharmacyController } from "./PharmacyController";
import { returnAValidPharmacy } from "../../../utils/test";
import { Pharmacy as PharmacyEntity } from "../../../infra/database/models/Pharmacy";

describe("Pharmacy Controller", () => {
  const MockPharmacyService = {
    index: jest.fn<Promise<PharmacyList>, [options: paginationOptions]>(),
    show: jest.fn<Promise<Pharmacy | Error>, [pharmacyId: string]>(),
    create: jest.fn<Promise<Pharmacy | Error>, [pharmacyData: PharmacyDTO]>(),
    update: jest.fn<
      Promise<Pharmacy | Error>,
      [pharmacyId: string, pharmacyData: Partial<PharmacyDTO>]
    >(),
    delete: jest.fn<Promise<void | Error>, [pharmacyId: string]>(),
    linkProductsToPhramacy: jest.fn<
      Promise<PharmacyEntity | Error>,
      [pharmacyId: string, products: Array<string>]
    >(),
  };

  const pharmacyController = new PharmacyController(MockPharmacyService);

  it("should be defined", () => {
    expect(pharmacyController).toBeDefined();
  });

  describe("Creating a new pharmacy", () => {
    const call = { request: {} as PharmacyDTO };

    it("should create a new pharmacy", async () => {
      const pharmacy = returnAValidPharmacy();

      MockPharmacyService.create.mockReturnValue(
        new Promise((resolve) => resolve(pharmacy))
      );

      await pharmacyController.createPharmacy(call, (error, result) => {
        expect(result).toEqual(pharmacy);
        expect(error).toBeNull();
      });

      expect(MockPharmacyService.create).toBeCalledTimes(1);
    });

    it("shouldn't create a new pharmacy (pharmacyService returned an Error)", async () => {
      MockPharmacyService.create.mockReturnValue(
        new Promise((resolve) => resolve(new Error("Any error message")))
      );

      await pharmacyController.createPharmacy(call, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(result).toBeNull();
      });

      expect(MockPharmacyService.create).toBeCalledTimes(1);
    });
  });

  describe("Showing a pharmacy", () => {
    const call = { request: { pharmacyId: "anyPharmacyId" } };

    it("should return a pharmacy", async () => {
      const pharmacy = returnAValidPharmacy();

      MockPharmacyService.show.mockReturnValue(
        new Promise((resolve) => resolve(pharmacy))
      );

      await pharmacyController.showPharmacy(call, (error, result) => {
        expect(error).toBeNull();
        expect(result).toEqual(pharmacy);
      });

      expect(MockPharmacyService.show).toBeCalledTimes(1);
    });

    it("shouldn't return a pharmacy (pharmacyService returned an Error)", async () => {
      MockPharmacyService.show.mockReturnValue(
        new Promise((resolve) => resolve(new Error("Any error message")))
      );

      await pharmacyController.showPharmacy(call, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(result).toBeNull();
      });

      expect(MockPharmacyService.show).toBeCalledTimes(1);
    });
  });

  describe("Listing pharmacies", () => {
    const call = { request: {} as paginationOptions };

    it("should return an array of pharmacies", async () => {
      const pharmacyList = {
        count: 1,
        pharmacies: Array(1).fill(returnAValidPharmacy()),
      };

      MockPharmacyService.index.mockReturnValue(
        new Promise((resolve) => resolve(pharmacyList))
      );

      await pharmacyController.listAllPharmacies(call, (error, result) => {
        expect(error).toBeNull();
        expect(result.pharmacies.length).toEqual(result.count);
        expect(result).toEqual(pharmacyList);
      });

      expect(MockPharmacyService.index).toBeCalledTimes(1);
    });
  });

  describe("Deleting pharmacies", () => {
    const call = { request: { pharmacyId: "anyPharmacyId" } };

    it("should delete a pharmacy", async () => {
      MockPharmacyService.delete.mockReturnValue(
        new Promise((resolve) => resolve(undefined))
      );

      await pharmacyController.deletePharmacy(call, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBeNull();
      });

      expect(MockPharmacyService.delete).toBeCalledTimes(1);
    });

    it("shouldn't delete a pharmacy (pharmacyService returned an Error)", async () => {
      MockPharmacyService.delete.mockReturnValue(
        new Promise((resolve) => resolve(new Error("Any error message")))
      );

      await pharmacyController.deletePharmacy(call, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(result).toBeNull();
      });

      expect(MockPharmacyService.delete).toBeCalledTimes(1);
    });
  });

  describe("Updating a pharmacy", () => {
    const call = { request: {} as Partial<PharmacyDTO> };

    it("should return an updated pharmacy", async () => {
      const pharmacy = returnAValidPharmacy();

      MockPharmacyService.update.mockReturnValue(
        new Promise((resolve) => resolve(pharmacy))
      );

      await pharmacyController.updatePharmacy(call, (error, result) => {
        expect(error).toBeNull();
        expect(result).toEqual(pharmacy);
      });

      expect(MockPharmacyService.update).toBeCalledTimes(1);
    });

    it("shouldn't update a pharmacy (pharmacyService returned an Error)", async () => {
      MockPharmacyService.update.mockReturnValue(
        new Promise((resolve) => resolve(new Error("Any error message")))
      );

      await pharmacyController.updatePharmacy(call, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(result).toBeNull();
      });

      expect(MockPharmacyService.update).toBeCalledTimes(1);
    });
  });
});
