import { Encounter } from "./encounter";

export interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  sex: string;
  age: number;
  blood_group: string;
  avatar: string;
  encounters: Encounter[];
}
