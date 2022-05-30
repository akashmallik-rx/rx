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
  patient: Patient = <Patient>{};
  selectedEncounter: Encounter = <Encounter>{};
  encounters: Encounter[] = [];
  selectedSymptom: Symptom = <Symptom>{};
  symptoms: Symptom[] = [];
  examination: Examination = <Examination>{};
  selctedDrug: Drug = <Drug>{};
  drugs: Drug[] = [];
  selectedAdvice: Advice = <Advice>{};
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
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.encounterId = params['encounterId'];
      this.fatchAllData();
    })
    // this.patientId = Number(this.activatedRoute.snapshot.paramMap.get('patientId'));
    // this.encounterId = Number(this.activatedRoute.snapshot.paramMap.get('encounterId'));
  }

  fatchAllData() {
    this.patientService.get(this.patientId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.patient = response;
        this.encounters = response['encounters'];
      }
    });

    this.encounterService.get(this.encounterId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.selectedEncounter = response;
        this.symptoms = response["symptoms"]
        const examination = response["examination"];
        if (examination) {
          this.examination = examination;
        } else {
          this.examination = <Examination>{};
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

  editSymptom(symptomId: number) {
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

  deleteSymptom(symptomId: any) {
    const index = this.symptoms.map(symptom => symptom.id).indexOf(symptomId);
    
    this.symptomService.delete(symptomId)
    .subscribe({
      next: () => {
        this.symptoms.splice(index, 1);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateExamination(payload: any)  {
    const formData: FormData = new FormData();
    formData.append('pulse', payload.pulse);
    formData.append('bp', payload.bp);
    formData.append('temp', payload.temp);
    formData.append('resp_rate', payload.resp_rate);
    formData.append('height', payload.height);
    formData.append('lifestyle', payload.lifestyle);
    formData.append('encounter', this.encounterId.toString());

    const examinationId = payload.id
    if (examinationId) {
      formData.append('id', examinationId);
      
      this.examinationService.update(examinationId, formData)
      .subscribe({
        next: (response) => {
          this.examination = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.examinationService.create(formData)
      .subscribe({
        next: (response) => {
          this.examination = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  addDrug(payload: any) {
    const formData: FormData = new FormData();
    formData.append('medicine', payload.medicine);
    formData.append('power', payload.power);
    formData.append('dosage', payload.dosage);
    formData.append('instruction', payload.instruction);
    formData.append('encounter', this.encounterId.toString());

    const drugId = payload.id;
    if (drugId) {
      formData.append('id', drugId);
      const index = this.drugs.map(drug => drug.id).indexOf(drugId);
      
      this.drugService.update(drugId, formData)
      .subscribe({
        next: (response) => {
          this.drugs.splice(index, 1, response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.drugService.create(formData)
      .subscribe({
        next: (response) => {
          this.drugs.splice(this.drugs.length, 0 , response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  editDrug(drugId: number) {
    this.drugService.get(drugId)
    .subscribe({
      next: (response) => {
        this.selctedDrug = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteDrug(drugId: number) {
    const index = this.drugs.map(drug => drug.id).indexOf(drugId);

    this.drugService.delete(drugId)
    .subscribe({
      next: () => {
        this.drugs.splice(index, 1);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addAdvice(payload: any) {
    const formData: FormData = new FormData();
    formData.append('encounter', this.encounterId.toString());
    formData.append('advice', payload.advice);

    const adviceId = payload.id;
    if (adviceId) {
      formData.append('id', adviceId);
      const index = this.advices.map(advice => advice.id).indexOf(adviceId);
      
      this.adviceService.update(adviceId, formData)
      .subscribe({
        next: (response) => {
          this.advices.splice(index, 1, response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.adviceService.create(formData)
      .subscribe({
        next: (response) => {
          this.advices.splice(this.advices.length, 0 , response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  editAdvice(adviceId: number) {
    this.adviceService.get(adviceId)
    .subscribe({
      next: (response) => {
        this.selectedAdvice = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteAdvice(adviceId: number) {
    const index = this.advices.map(advice => advice.id).indexOf(adviceId);

    this.adviceService.delete(adviceId)
    .subscribe({
      next: (response) => {
        this.advices.splice(index, 1);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  printPage() {
    window.print();
  }
}
