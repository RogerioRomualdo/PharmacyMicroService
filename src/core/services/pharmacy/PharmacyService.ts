import { IPharmacyRepository } from "../../repositories/pharmacy/IPharmacyRepository";
import { PharmacyDTO, paginationOptions, PharmacyList } from "../../types";
import { IPharmacyService } from "./IPharmacyService";
import { Validator } from "../../../utils/validator";

export class PharmacyService implements IPharmacyService {
  private validator;

  constructor(private pharmacyRepository: IPharmacyRepository) {
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
    const jooj = await this.pharmacyRepository.index(options);
    console.log(jooj);
    return jooj;
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

    return pharmacy;
  };
  delete = async (pharmacyId: string) => {
    const pharmacy = await this.pharmacyRepository.findById(pharmacyId);

    if (!pharmacy) return new Error("Pharmacy not found");

    await this.pharmacyRepository.delete(pharmacy.id);
  };
}
