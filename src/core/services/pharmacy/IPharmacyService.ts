import {
  paginationOptions,
  Pharmacy,
  PharmacyDTO,
  PharmacyList,
} from "../../types";

import { Pharmacy as PharmacyEntity } from "../../../infra/database/models/Pharmacy";

export interface IPharmacyService {
  create: (pharmacyData: PharmacyDTO) => Promise<Pharmacy | Error>;
  index: (options: paginationOptions) => Promise<PharmacyList>;
  update: (
    pharmacyId: string,
    pharmacyData: Partial<PharmacyDTO>
  ) => Promise<Pharmacy | Error>;
  show: (pharmacyId: string) => Promise<Pharmacy | Error>;
  delete: (pharmacyId: string) => Promise<void | Error>;
  linkProductsToPhramacy: (
    pharmacyId: string,
    productIds: Array<string>
  ) => Promise<PharmacyEntity | Error>;
  unlinkProductFromAllPharmacies: (productId: string) => Promise<void>;
}
