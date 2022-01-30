export interface Pharmacy {
  id: string;
  is_subsidiary_of?: string;
  logo: string;
  name: string;
  contact_phone: string;
  document_number: string;
  city: string;
  street: string;
  number: string;
  open_time: string;
  close_time: string;
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
