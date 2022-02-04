import { Callback, Pharmacy, PharmacyDTO, PharmacyList } from "../../types";

export type ListAllPharmaciesParamsDTO = {
  currenPage: number;
  pageSize: number;
};

export type RpcFunction = (
  call: Record<string, any>,
  callback: Callback
) => Promise<void>;

export interface IPharmacyController {
  listAllPharmacies: RpcFunction;
  showPharmacy: RpcFunction;
  createPharmacy: RpcFunction;
  updatePharmacy: RpcFunction;
  deletePharmacy: RpcFunction;
  linkProductsToPharmacy: RpcFunction;
}
