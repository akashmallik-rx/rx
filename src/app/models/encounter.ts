import { Advice } from "./advice";
import { Drug } from "./drug";
import { GeneralExamination } from "./general-examination";
import { Patient } from "./patient";
import { Symptom } from "./symptom";
import { VisitType } from "./visit-type";

export interface Encounter {
  id: number;
  patient: number; 
  visit_type: string;
  date: string;
  symptoms: Symptom[];
  examination: GeneralExamination;
  drugs: Drug[];
  advices: Advice[];
}
