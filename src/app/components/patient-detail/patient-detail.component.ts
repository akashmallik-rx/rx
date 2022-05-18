import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { Encounter } from 'src/app/models/encounter';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';

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

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));

    this.patientSubscription = this.patientService.get(this.patientId).subscribe(
      {
        next: (response) => {
          console.log(response);
          this.patient$ = response;
          this.encounters = response['encounters'];
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  ngOnDestroy() {
    console.log('test');
    this.patientSubscription.unsubscribe();
  }
}
