import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { AlertService } from 'src/app/utils/alert.service';
import { NotificationService } from 'src/app/utils/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'phone', 'address', 'action'];
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  dataSource!: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private notification: NotificationService,
    private alert: AlertService,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.patientService.getAll()
    .subscribe(
      {
        next: (response) => {
          console.log(response);
          this.dataSource = new MatTableDataSource<Patient>(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource._updateChangeSubscription();
        },
        error: (error) => {
          this.notification.handleError('Failed to get patient information.', error);
        }
      }
    );
  }

  delete(patientId: number) {
    const confirmation$ = this.alert.onDeleteConfirmation();

    confirmation$.subscribe({
      next: (result) => {
        if (result) {
          const index = this.dataSource.data.map(patient => patient.id).indexOf(patientId);

          this.patientService.delete(patientId)
          .subscribe(
            {
              next: () => {
                this.dataSource.data.splice(index, 1);
                this.dataSource._updateChangeSubscription();
                this.notification.onDeleteSuccess();
              },
              error: (error) => {
                this.notification.handleError('Failed to delete patient.', error);
              }
            }
          );
        }
      }
    });
  }
}
