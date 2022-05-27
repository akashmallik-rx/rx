import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { Encounter } from 'src/app/models/encounter';
import { Patient } from 'src/app/models/patient';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { EncounterService } from 'src/app/services/encounter.service';
import { PatientService } from 'src/app/services/patient.service';

export interface Visit {
  key: string;
  value: string;
}

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  patientId!: number;
  patient$: Patient = <Patient>{};
  patientSubscription: Subscription = new Subscription;
  encounters: Encounter[] = [];

  visitTypes: Visit[] = [
    { key: 'ODP', value: 'ODP'},
  ];

  constructor(
    public datepipe: CustomDatePipe,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private encounterService: EncounterService
  ) { }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));

    this.patientSubscription = this.patientService.get(this.patientId).subscribe({
      next: (response) => {
        this.patient$ = response;
        this.encounters = response['encounters'];
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  addEncounter(payload: any) {
    const formData: FormData = new FormData();
    formData.append('date', this.datepipe.transform(payload.date));
    formData.append('visit_type', payload.visit_type);
    formData.append('patient', this.patientId.toString());
    
    this.encounterService.create(formData)
    .subscribe({
      next: (response) => {
        this.encounters.splice(this.encounters.length, 0 , response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy() {
    this.patientSubscription.unsubscribe();
  }
}
