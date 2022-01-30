import { PharmacyDTO } from "../core/types";
import { Pharmacy } from "../infra/database/models/Pharmacy";

const defaultValues = {
  id: "any_pharmacy_id",
  is_subsidiary_of: null,
  logo: "any_uri",
  name: "any_pharmacy_name",
  contact_phone: "any_phone",
  document_number: "any_document_number",
  city: "any_city",
  street: "any_street",
  number: "any_number",
  open_time: "any_time",
  close_time: "any_time",
};

export const returnAValidPharmacy = (pharmacyData?: Partial<PharmacyDTO>) => {
  const pharmacy = new Pharmacy();

  Object.assign(pharmacy, defaultValues);
  Object.assign(pharmacy, pharmacyData);

  return pharmacy;
};
