import { AbstractControl, FormGroup } from "@angular/forms";
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

export interface PatientFormGroup extends FormGroup {
  value: Patient;

  // We need to add these manually again, same fields as IUser
  controls: {
    id: AbstractControl;
    name: AbstractControl;
    phone: AbstractControl;
    email: AbstractControl;
    address: AbstractControl;
    sex: AbstractControl;
    age: AbstractControl;
    blood_group: AbstractControl;
    avatar: AbstractControl;
    encounters: AbstractControl;
  };
}