import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Advice } from 'src/app/models/advice';
import { Drug } from 'src/app/models/drug';
import { Encounter } from 'src/app/models/encounter';
import { Examination } from 'src/app/models/examination';
import { Medicine } from 'src/app/models/medicine';
import { MedicinePower } from 'src/app/models/medicine-power';
import { Patient } from 'src/app/models/patient';
import { Symptom } from 'src/app/models/symptom';
import { AdviceService } from 'src/app/services/advice.service';
import { DrugService } from 'src/app/services/drug.service';
import { EncounterService } from 'src/app/services/encounter.service';
import { ExaminationService } from 'src/app/services/examination.service';
import { MedicinePowerService } from 'src/app/services/medicine-power.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { PatientService } from 'src/app/services/patient.service';
import { SymptomService } from 'src/app/services/symptom.service';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss']
})
export class EncountersComponent implements OnInit {
  encounterId!: number;
  patientId!: number;
  patient$: Patient = <Patient>{};
  encounters: Encounter[] = [];
  selectedSymptom: Symptom = <Symptom>{};
  symptoms: Symptom[] = [];
  examination: Examination = <Examination>{};
  drugs: Drug[] = [];
  advices: Advice[] = [];
  medicines: Medicine[] = [];
  powers: MedicinePower[] = [];

  constructor(
    private adviceService: AdviceService,
    private drugService: DrugService,
    private encounterService: EncounterService,
    private examinationService: ExaminationService,
    private medicineService: MedicineService,
    private patientService: PatientService,
    private powerService: MedicinePowerService,
    private symptomService: SymptomService,
    private route: ActivatedRoute,
    // private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.encounterId = Number(this.route.snapshot.paramMap.get('encounterId'));

    this.patientService.get(this.patientId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.patient$ = response;
        this.encounters = response['encounters'];
      }
    });

    this.encounterService.get(this.encounterId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.symptoms = response["symptoms"]
        const examination = response["examination"];
        if (examination) {
          this.examination = examination;
        } else {
          // this.examination = new ExaminationData();
          this.examination;
        }
        this.drugs = response["drugs"];
        this.advices = response["advices"];
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.medicineService.getAll()
    .subscribe({
      next: (response) => {
        this.medicines = response;
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.powerService.getAll()
    .subscribe({
      next: (response) => {
        this.powers = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  encounter(data: Encounter) {
    const formData: FormData = new FormData();
    // formData.append('date', String(this.datepipe.transform(data.date, 'yyyy-MM-dd')));
    formData.append('visit_type', data.visit_type);
    formData.append('patient', this.patientId.toString());
    
    this.encounterService.create(formData)
    .subscribe({
      next: (response) => {
        this.encounters.splice(this.encounters.length, 0 , response);
      }
    });
  }

  addSymptom(payload: any) {
    const formData: FormData = new FormData();
    formData.append('symptom', payload.symptom);
    formData.append('encounter', this.encounterId.toString());

    const symptomId = payload.id;
    if (symptomId) {
      formData.append('id', symptomId);
      const index = this.symptoms.map(symptom => symptom.id).indexOf(symptomId);
      
      this.symptomService.update(symptomId, formData)
      .subscribe(
        (response) => {
          this.symptoms.splice(index, 1, response);
        }
      );
    } else {
      this.symptomService.create(formData)
      .subscribe(
        (response) => {
          this.symptoms.splice(this.symptoms.length, 0 , response);
        }
      );
    }
  }

  editSymptom(symptomId: any) {
    this.symptomService.get(symptomId)
    .subscribe({
      next: (response) => {
        this.selectedSymptom = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteSymptom(item: any) {
    const index = this.symptoms.indexOf(item);
    
    this.symptomService.delete(item.id)
    .subscribe({
      next: (response) => {
        this.symptoms.splice(index, 1);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
