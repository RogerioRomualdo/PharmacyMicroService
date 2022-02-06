import { PharmacyDTO, Product } from "../core/types";
import { Pharmacy } from "../infra/database/models/Pharmacy";

const defaultValues = {
  pharmacy: {
    id: "anyPharmacyId",
    isSubsidiaryOf: undefined,
    logo: "anyUri",
    name: "anyPharmacyName",
    contactPhone: "anyPhone",
    documentNumber: "anyDocumentNumber",
    city: "anyCity",
    street: "anyStreet",
    number: "anyNumber",
    openTime: "anyTime",
    closeTime: "anyTime",
  },
  product: {
    id: "anyProductId",
    thumbnail: "anyUri",
    name: "anyName",
    price: 0,
    volume: 0,
    createdAt: "anyTime",
    updatedAt: "anyTime",
  },
};

export type entityName = "pharmacy" | "product";

export const returnAValidPharmacy = (pharmacyData?: Partial<PharmacyDTO>) => {
  const pharmacy = new Pharmacy();

  Object.assign(pharmacy, defaultValues.pharmacy);
  Object.assign(pharmacy, pharmacyData);

  return pharmacy;
};

export const returnAValidEntity = <T extends Object>(
  entityName: entityName,
  entityData?: Object
) => {
  const entity = {} as T;

  Object.assign(entity, defaultValues[entityName]);
  Object.assign(entity, entityData);

  return entity;
};
