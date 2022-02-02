import { IPharmacyController } from "./IPharmacyController";
import { IPharmacyService } from "../../services/pharmacy/IPharmacyService";
import { Callback } from "../../types";

export class PharmacyController implements IPharmacyController {
  constructor(private pharmacyService: IPharmacyService) {}

  listAllPharmacies = async (call: Record<string, any>, callback: Callback) => {
    const { ...options } = call.request;

    const pharmacyList = await this.pharmacyService.index(options);

    return callback(null, pharmacyList);
  };
  showPharmacy = async (call: Record<string, any>, callback: Callback) => {
    const { id: pharmacyId } = call.request;

    const pharmacy = await this.pharmacyService.show(pharmacyId);

    if (pharmacy instanceof Error) return callback(pharmacy, null);

    return callback(null, pharmacy);
  };
  createPharmacy = async (call: Record<string, any>, callback: Callback) => {
    const { ...pharmacyData } = call.request;

    const pharmacy = await this.pharmacyService.create(pharmacyData);

    if (pharmacy instanceof Error) return callback(pharmacy, null);

    return callback(null, pharmacy);
  };
  updatePharmacy = async (call: Record<string, any>, callback: Callback) => {
    const { id: pharmacyId, ...pharmacyData } = call.request;

    const pharmacy = await this.pharmacyService.update(
      pharmacyId,
      pharmacyData
    );

    if (pharmacy instanceof Error) return callback(pharmacy, null);

    return callback(null, pharmacy);
  };
  deletePharmacy = async (call: Record<string, any>, callback: Callback) => {
    const { id: pharmacyId } = call.request;

    const error = await this.pharmacyService.delete(pharmacyId);

    if (error instanceof Error) return callback(error, null);

    return callback(null, null);
  };
}
