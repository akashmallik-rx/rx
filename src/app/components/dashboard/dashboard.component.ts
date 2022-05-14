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
export class DashboardComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'age', 'phone', 'address'];
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  dataSource!: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private patientService: PatientService,
  ) { }

  ngAfterViewInit(): void {
    this.patientService.getAll()
    .subscribe(
      {
        next: (response) => {
          this.dataSource = new MatTableDataSource<Patient>(response);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          console.error(error);
        }
      }
    );
  }

}
