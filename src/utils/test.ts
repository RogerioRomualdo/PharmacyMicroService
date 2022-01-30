import { PharmacyDTO } from "../core/types";
import { Pharmacy } from "../infra/database/models/Pharmacy";

const defaultValues = {
  id: "anyPharmacyId",
  isSubsidiaryOf: null,
  logo: "anyUri",
  name: "anyPharmacyName",
  contactPhone: "anyPhone",
  documentNumber: "anyDocumentNumber",
  city: "anyCity",
  street: "anyStreet",
  number: "anyNumber",
  openTime: "anyTime",
  closeTime: "anyTime",
};

export const returnAValidPharmacy = (pharmacyData?: Partial<PharmacyDTO>) => {
  const pharmacy = new Pharmacy();

  Object.assign(pharmacy, defaultValues);
  Object.assign(pharmacy, pharmacyData);

  return pharmacy;
};
