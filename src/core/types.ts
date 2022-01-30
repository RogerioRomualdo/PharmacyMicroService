export interface Pharmacy {
  id: string;
  isSubsidiaryOf?: string;
  logo: string;
  name: string;
  contactPhone: string;
  documentNumber: string;
  city: string;
  street: string;
  number: string;
  openTime: string;
  closeTime: string;
}

export type PharmacyDTO = Omit<Pharmacy, "id">;

export type PharmacyList = {
  count: number;
  pharmacies: Array<Pharmacy>;
};

export type paginationOptions = {
  currentPage: number;
  pageSize: number;
};

export type Callback = (error: Error | null, result?: any) => void;
