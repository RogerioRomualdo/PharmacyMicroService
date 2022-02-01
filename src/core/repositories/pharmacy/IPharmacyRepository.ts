import {
  paginationOptions,
  Pharmacy,
  PharmacyDTO,
  PharmacyList,
} from "../../types";

export interface IPharmacyRepository {
  index: (options: paginationOptions) => Promise<PharmacyList>;
  findById: (pharmacyId: string) => Promise<Pharmacy | undefined>;
  create: (pharmacyData: PharmacyDTO) => Promise<Pharmacy>;
  update: (
    pharmacyId: string,
    pharmacyData: Partial<PharmacyDTO>
  ) => Promise<Pharmacy>;
  delete: (pharmacyId: string) => Promise<void>;
}
