import { Advice } from "./advice";
import { Drug } from "./drug";
import { Examination } from "./examination";
import { Patient } from "./patient";
import { Symptom } from "./symptom";
import { VisitType } from "./visit-type";

export interface Encounter {
  id: number;
  patient: number; 
  visit_type: string;
  date: Date;
  symptoms: Symptom[];
  examination: Examination;
  drugs: Drug[];
  advices: Advice[];
}
