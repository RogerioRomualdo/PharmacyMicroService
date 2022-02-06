import { IPharmacyController } from "./IPharmacyController";
import { IPharmacyService } from "../../services/pharmacy/IPharmacyService";
import { Callback } from "../../types";

export class PharmacyController implements IPharmacyController {
  constructor(private pharmacyService: IPharmacyService) {}

  listAllPharmacies = async (call: Record<string, any>, callback: Callback) => {
    try {
      const { ...options } = call.request;

      const pharmacyList = await this.pharmacyService.index(options);

      return callback(null, pharmacyList);
    } catch (e: any) {
      return callback(e, null);
    }
  };
  showPharmacy = async (call: Record<string, any>, callback: Callback) => {
    try {
      const { id: pharmacyId } = call.request;

      const pharmacy = await this.pharmacyService.show(pharmacyId);

      if (pharmacy instanceof Error) return callback(pharmacy, null);

      return callback(null, pharmacy);
    } catch (e: any) {
      return callback(e, null);
    }
  };
  createPharmacy = async (call: Record<string, any>, callback: Callback) => {
    try {
      const { ...pharmacyData } = call.request;

      const pharmacy = await this.pharmacyService.create(pharmacyData);

      if (pharmacy instanceof Error) return callback(pharmacy, null);

      return callback(null, pharmacy);
    } catch (e: any) {
      return callback(e, null);
    }
  };
  updatePharmacy = async (call: Record<string, any>, callback: Callback) => {
    try {
      const { id: pharmacyId, ...pharmacyData } = call.request;

      const pharmacy = await this.pharmacyService.update(
        pharmacyId,
        pharmacyData
      );

      if (pharmacy instanceof Error) return callback(pharmacy, null);

      return callback(null, pharmacy);
    } catch (e: any) {
      return callback(e, null);
    }
  };
  deletePharmacy = async (call: Record<string, any>, callback: Callback) => {
    try {
      const { id: pharmacyId } = call.request;

      const error = await this.pharmacyService.delete(pharmacyId);

      if (error instanceof Error) return callback(error, null);

      return callback(null, null);
    } catch (e: any) {
      return callback(e, null);
    }
  };
  linkProductsToPharmacy = async (
    call: Record<string, any>,
    callback: Callback
  ) => {
    try {
      const { pharmacyId, productIds } = call.request;

      const pharmacyWithProducts =
        await this.pharmacyService.linkProductsToPhramacy(
          pharmacyId,
          productIds
        );

      if (pharmacyWithProducts instanceof Error)
        return callback(pharmacyWithProducts, null);

      return callback(null, pharmacyWithProducts);
    } catch (e: any) {
      return callback(e, null);
    }
  };
  unlinkProductFromAllPharmacies = async (
    call: Record<string, any>,
    callback: Callback
  ) => {
    try {
      const { id: productId } = call.request;

      this.pharmacyService.unlinkProductFromAllPharmacies(productId);

      callback(null, null);
    } catch (e: any) {
      return callback(e, null);
    }
  };
}
