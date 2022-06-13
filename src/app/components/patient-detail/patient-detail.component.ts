import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Encounter } from 'src/app/models/encounter';
import { Patient } from 'src/app/models/patient';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { EncounterService } from 'src/app/services/encounter.service';
import { PatientService } from 'src/app/services/patient.service';
import { AlertUtil } from 'src/app/utils/alert.util';
import { NotificationUtil } from 'src/app/utils/notification.util';

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

  displayedColumns: string[] = ['encounter', 'action'];
  encounterDataSource!: MatTableDataSource<Encounter>;

  visitTypes: Visit[] = [
    { key: 'ODP', value: 'ODP'},
  ];

  encounterForm = new FormGroup({
    id: new FormControl(''),
    patient: new FormControl(''),
    visit_type: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  });

  constructor(
    private notification: NotificationUtil,
    private alert: AlertUtil,
    private customDatepipe: CustomDatePipe,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private encounterService: EncounterService
  ) { }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));

    this.patientSubscription = this.patientService.get(this.patientId).subscribe({
      next: (response) => {
        this.patient$ = response;
        this.encounterDataSource = new MatTableDataSource<Encounter>(response['encounters']);
      },
      error: (error) => {
        this.notification.handleError('Failed to get patient information.', error);
      }
    });
  }

  addEncounter() {
    const encounterDate = this.customDatepipe.transform(this.encounterForm.controls['date'].value);
    this.encounterForm.controls['patient'].setValue(this.patientId.toString());
    this.encounterForm.controls['date'].setValue(encounterDate);
    
    this.encounterService.create(this.encounterForm.value)
    .subscribe({
      next: (response) => {
        this.encounterDataSource.data.splice(this.encounterDataSource.data.length, 0, response);
        this.encounterDataSource._updateChangeSubscription();
        this.notification.onCreateSuccess();        
      },
      error: (error) => {
        this.notification.handleError('Failed to add encounter data.', error);
      }
    });
  }

  async deleteEncounter(encounterId: number) {
    const confirmation$ = this.alert.onDeleteConfirmation();

    confirmation$.subscribe({
      next: (result) => {
        if(result) {
          const index = this.encounterDataSource.data.map(encounter => encounter.id).indexOf(encounterId);

          this.encounterService.delete(encounterId)
          .subscribe({
            next: () => {
              this.encounterDataSource.data.splice(index, 1);
              this.encounterDataSource._updateChangeSubscription();
              this.notification.onDeleteSuccess();
            },
            error: (error) => {
              this.notification.handleError('Failed to delete encounter.', error);
            }
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.patientSubscription.unsubscribe();
  }
}
