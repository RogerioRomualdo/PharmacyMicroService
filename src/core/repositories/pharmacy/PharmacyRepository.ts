import { getRepository, Repository } from "typeorm";
import { Pharmacy as PharmacyEntity } from "../../../infra/database/models/Pharmacy";
import { PharmacyDTO, paginationOptions } from "../../types";
import { IPharmacyRepository } from "./IPharmacyRepository";

export class PharmacyRepository implements IPharmacyRepository {
  private typeOrm: Repository<PharmacyEntity>;

  constructor() {
    this.typeOrm = getRepository(PharmacyEntity);
  }

  index = async (options: paginationOptions) => {
    const { currentPage, pageSize } = options;

    const [pharmacies, count] = await this.typeOrm.findAndCount({
      take: pageSize,
      skip: currentPage * pageSize,
    });

    return { count, pharmacies };
  };
  findById = async (pharmacyId: string) => {
    return await this.typeOrm.findOne({
      where: { id: pharmacyId },
      relations: ["pharmacyProducts"],
    });
  };
  create = async (pharmacyData: PharmacyDTO) => {
    return await this.typeOrm.save(pharmacyData);
  };
  update = async (phramacyId: string, pharmacyData: Partial<PharmacyDTO>) => {
    return await this.typeOrm.save({ id: phramacyId, ...pharmacyData });
  };
  delete = async (pharmacyId: string) => {
    await this.typeOrm.delete(pharmacyId);
  };
}
