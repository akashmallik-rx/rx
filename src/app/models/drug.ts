import { Medicine } from "./medicine";
import { MedicinePower } from "./medicine-power";

export interface Drug {
  id: number;
  encounter: number;
  medicine: Medicine;
  power: MedicinePower;
  dosage: string;
  instruction: string;
}
