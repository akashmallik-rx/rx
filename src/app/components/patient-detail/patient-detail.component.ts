import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Encounter } from 'src/app/models/encounter';
import { Patient } from 'src/app/models/patient';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { EncounterService } from 'src/app/services/encounter.service';
import { PatientService } from 'src/app/services/patient.service';
import { NotificationService } from 'src/app/utils/notification.service';

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

  constructor(
    public notification: NotificationService,
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
        this.encounterDataSource = new MatTableDataSource<Encounter>(response['encounters']);
      },
      error: (error) => {
        this.notification.handleError('Failed to get patient information.', error);
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
        this.encounterDataSource.data.splice(this.encounterDataSource.data.length, 0, response);
        this.encounterDataSource._updateChangeSubscription();
        this.notification.onCreateSuccess();        
      },
      error: (error) => {
        this.notification.handleError('Failed to add encounter data.', error);
      }
    });
  }

  deleteEncounter(encounterId: number) {
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

  ngOnDestroy() {
    this.patientSubscription.unsubscribe();
  }
}
