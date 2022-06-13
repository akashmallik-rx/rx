import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { DOCTOR_DATA } from 'src/app/data/doctor';
import { PHARMACY_DATA } from 'src/app/data/pharmacy';
import { Advice } from 'src/app/models/advice';
import { Drug } from 'src/app/models/drug';
import { Encounter } from 'src/app/models/encounter';
import { GeneralExamination } from 'src/app/models/general-examination';
import { Medicine } from 'src/app/models/medicine';
import { MedicinePower } from 'src/app/models/medicine-power';
import { Patient } from 'src/app/models/patient';
import { Symptom } from 'src/app/models/symptom';
import { AdviceService } from 'src/app/services/advice.service';
import { DrugService } from 'src/app/services/drug.service';
import { EncounterService } from 'src/app/services/encounter.service';
import { GeneralExaminationService } from 'src/app/services/general-examination.service';
import { MedicinePowerService } from 'src/app/services/medicine-power.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { PatientService } from 'src/app/services/patient.service';
import { SymptomService } from 'src/app/services/symptom.service';
import { AlertUtil } from 'src/app/utils/alert.util';
import { NotificationUtil } from 'src/app/utils/notification.util';

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
  generalExamination: GeneralExamination = <GeneralExamination>{};
  selctedDrug: Drug = <Drug>{};
  drugs: Drug[] = [];
  selectedAdvice: Advice = <Advice>{};
  advices: Advice[] = [];
  medicines: Medicine[] = [];
  medicinePowers: MedicinePower[] = [];
  filteredmedicinePowers: MedicinePower[] = [];
  doctor = DOCTOR_DATA;
  pharmacy = PHARMACY_DATA;

  symptomForm = new FormGroup({
    id: new FormControl(''),
    encounter: new FormControl(''),
    symptom: new FormControl('', Validators.required)
  });

  generalExaminationForm = new FormGroup({
    id: new FormControl(''),
    encounter: new FormControl(''),
    pulse: new FormControl(''),
    bp: new FormControl(''),
    temp: new FormControl(''),
    height: new FormControl(''),
    lifestyle: new FormControl('')
  });

  drugForm = new FormGroup({
    id: new FormControl(''),
    medicine: new FormControl(''),
    power: new FormControl(''),
    dosage: new FormControl(''),
    instruction: new FormControl(''),
  });

  adviceForm = new FormGroup({
    id: new FormControl(''),
    encounter: new FormControl(''),
    advice: new FormControl('', Validators.required)
  });
  
  filteredOptions!: Observable<Medicine[]>;

  constructor(
    private notification: NotificationUtil,
    private alert: AlertUtil,
    private adviceService: AdviceService,
    private drugService: DrugService,
    private encounterService: EncounterService,
    private examinationService: GeneralExaminationService,
    private medicineService: MedicineService,
    private patientService: PatientService,
    private medicinePowerService: MedicinePowerService,
    private symptomService: SymptomService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.encounterId = params['encounterId'];
      this.fatchAllData();
    });

    this.drugForm.controls["medicine"].valueChanges.subscribe(value => {
      let medicineTypes: number[] = [];

      const medicine = this.medicines.find(medicine => medicine.name == value);
      if (medicine) {
        medicineTypes = medicine.types;
      }
      this.filteredmedicinePowers = this.medicinePowers.filter(
        medicinePower => medicineTypes.includes(medicinePower.type));
    });

    this.filteredOptions = this.drugForm.controls["medicine"].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): Medicine[] {
    if (value == undefined) {
      return []
    }
    const filterValue = value.toString().toLowerCase();

    return this.medicines.filter(medicine => medicine.name.toLowerCase().includes(filterValue));
  }

  // loadData() : void {
  //   Observable.forkJoin(
  //       this.blogApi.getPosts(),
  //       this.blogApi.getTags()
  //   ).subscribe((([posts, tags]: [Post[], Tag[]]) => {
  //       this.posts = posts;
  //       this.tags = tags;
  //   }));
  // }

  fatchAllData() {
    this.patientService.get(this.patientId)
    .subscribe({
      next: (response) => {
        this.patient = response;
        this.encounters = response['encounters'];
      },
      error: (error) => {
        this.notification.handleError('Failed to get patient information.', error);
      }
    });

    this.encounterService.get(this.encounterId)
    .subscribe({
      next: (response) => {
        this.selectedEncounter = response;
        this.symptoms = response['symptoms']
        const generalExamination = response['examination'];
        if (generalExamination) {
          this.generalExamination = generalExamination;
        } else {
          this.generalExamination = <GeneralExamination>{};
        }
        this.drugs = response['drugs'];
        this.advices = response['advices'];
      },
      error: (error) => {
        this.notification.handleError('Failed to get encounter information.', error);
      }
    });

    this.medicineService.getAll()
    .subscribe({
      next: (response) => {
        this.medicines = response;
      },
      error: (error) => {
        this.notification.handleError('Failed to get medicines information.', error);
      }
    });

    this.medicinePowerService.getAll()
    .subscribe({
      next: (response) => {
        this.medicinePowers = response;
      },
      error: (error) => {
        this.notification.handleError('Failed to get medicine powers information.', error);
      }
    });
  }

  addSymptom() {
    this.symptomForm.controls["encounter"].setValue(this.encounterId.toString());
    const symptomId = this.symptomForm.controls["id"].value;

    if (symptomId) {
      const index = this.symptoms.map(symptom => symptom.id).indexOf(symptomId);
      
      this.symptomService.update(symptomId, this.symptomForm.value)
      .subscribe({
        next: (response) => {
          this.symptoms.splice(index, 1, response);
          this.notification.onUpdateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to update symptom data', error);
        }
      });
    } else {
      this.symptomService.create(this.symptomForm.value)
      .subscribe({
        next: (response) => {
          this.symptoms.splice(this.symptoms.length, 0 , response);
          this.notification.onCreateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to create symptom', error);
        }
      });
    }
  }

  getSymptom(symptomId: number) {
    this.symptomService.get(symptomId)
    .subscribe({
      next: (response) => {
        this.selectedSymptom = response;
      },
      error: (error) => {
        this.notification.handleError('Failed to get symptom information.', error);
      }
    });
  }

  deleteSymptom(symptomId: any) {
    const confirmation$ = this.alert.onDeleteConfirmation();

    confirmation$.subscribe({
      next: (result) => {
        if(result) {
          const index = this.symptoms.map(symptom => symptom.id).indexOf(symptomId);
    
          this.symptomService.delete(symptomId)
          .subscribe({
            next: () => {
              this.symptoms.splice(index, 1);
              this.notification.onDeleteSuccess();
            },
            error: (error) => {
              this.notification.handleError('Failed to delete symptom.', error);
            }
          });
        }
      }
    });
  }

  saveGeneralExamination() {
    this.generalExaminationForm.controls["encounter"].setValue(this.encounterId.toString());
    const examinationId = this.generalExaminationForm.controls["id"].value;
    if (examinationId) {      
      this.examinationService.update(examinationId, this.generalExaminationForm.value)
      .subscribe({
        next: (response) => {
          this.generalExamination = response;
          this.notification.onUpdateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to update general examination data.', error);
        }
      });
    } else {
      this.examinationService.create(this.generalExaminationForm.value)
      .subscribe({
        next: (response) => {
          this.generalExamination = response;
          this.notification.onCreateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to create general examination.', error);
        }
      });
    }
  }

  addDrug(payload: any) {
    const formData: FormData = new FormData();
    const medicine = this.medicines.find(medicine => medicine.name == payload.medicine)!;
    formData.append('medicine', medicine.id.toString());
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
          response.medicine = medicine;
          this.drugs.splice(index, 1, response);
          this.notification.onUpdateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to update drug data.', error);
        }
      });
    } else {
      this.drugService.create(formData)
      .subscribe({
        next: (response) => {
          response.medicine = medicine;
          this.drugs.splice(this.drugs.length, 0 , response);
          this.notification.onCreateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to add drug data.', error);
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
        this.notification.handleError('Failed to get drug information.', error);
      }
    });
  }

  deleteDrug(drugId: number) {
    const confirmation$ = this.alert.onDeleteConfirmation();

    confirmation$.subscribe({
      next: (result) => {
        if(result) {
          const index = this.drugs.map(drug => drug.id).indexOf(drugId);

          this.drugService.delete(drugId)
          .subscribe({
            next: () => {
              this.drugs.splice(index, 1);
              this.notification.onDeleteSuccess();
            },
            error: (error) => {
              this.notification.handleError('Failed to delete drug.', error);
            }
          });
        }
      }
    });
  }

  addAdvice() {
    this.adviceForm.controls["encounter"].setValue(this.encounterId.toString());
    const adviceId = this.adviceForm.controls["id"].value;

    if (adviceId) {
      const index = this.advices.map(advice => advice.id).indexOf(adviceId);
      
      this.adviceService.update(adviceId, this.adviceForm.value)
      .subscribe({
        next: (response) => {
          this.advices.splice(index, 1, response);
          this.notification.onUpdateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to update advice data.', error);
        }
      });
    } else {
      this.adviceService.create(this.adviceForm.value)
      .subscribe({
        next: (response) => {
          this.advices.splice(this.advices.length, 0 , response);
          this.notification.onCreateSuccess();
        },
        error: (error) => {
          this.notification.handleError('Failed to add advice information.', error);
        }
      });
    }
  }

  getAdvice(adviceId: number) {
    this.adviceService.get(adviceId)
    .subscribe({
      next: (response) => {
        this.selectedAdvice = response;
      },
      error: (error) => {
        this.notification.handleError('Failed to get advice information.', error);
      }
    });
  }

  deleteAdvice(adviceId: number) {
    const confirmation$ = this.alert.onDeleteConfirmation();

    confirmation$.subscribe({
      next: (result) => {
        if(result) {
          const index = this.advices.map(advice => advice.id).indexOf(adviceId);

          this.adviceService.delete(adviceId)
          .subscribe({
            next: () => {
              this.advices.splice(index, 1);
              this.notification.onDeleteSuccess();
            },
            error: (error) => {
              this.notification.handleError('Failed to delete advice.', error);
            }
          });
        }
      }
    });
  }

  printPage() {
    window.print();
  }
}
