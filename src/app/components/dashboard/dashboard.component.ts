import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';

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
          console.error(error);
        }
      }
    );
  }

  delete(patientId: number) {
    const index = this.dataSource.data.findIndex(x => x.id === patientId);
    this.patientService.delete(patientId)
    .subscribe(
      {
        next: (response) => {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        },
        error: (error) => {
          console.error(error);
        }
      }
    );
  }

}
