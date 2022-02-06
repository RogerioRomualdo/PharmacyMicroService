import {
  paginationOptions,
  Pharmacy,
  PharmacyDTO,
  PharmacyList,
} from "../../types";
import { Pharmacy as PharmacyEntity } from "../../../infra/database/models/Pharmacy";

export interface IPharmacyRepository {
  index: (options: paginationOptions) => Promise<PharmacyList>;
  findById: (pharmacyId: string) => Promise<PharmacyEntity | undefined>;
  countSubsidiariesOf: (headOfficeId: string) => Promise<Number>;
  create: (pharmacyData: PharmacyDTO) => Promise<Pharmacy>;
  update: (
    pharmacyId: string,
    pharmacyData: Partial<PharmacyDTO>
  ) => Promise<Pharmacy>;
  delete: (pharmacyId: string) => Promise<void>;
}
