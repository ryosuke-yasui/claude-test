export type Sex = "male" | "female" | "other";

export interface Address {
  id: number;
  user_id: number;
  street: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  country: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  sex: Sex;
  created_at: string;
  addresses: Address[];
}

export type AddressInput = Omit<Address, "id" | "user_id">;

export interface UserInput {
  name: string;
  age: number;
  sex: Sex;
  addresses: AddressInput[];
}
