import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';

export interface Sex {
  key: string;
  value: string;
}

export interface BloodGroup {
  key: string;
  value: string;
}

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patientId!: number;
  patient: Patient = <Patient>{};

  sexList: Sex[] = [
    { key: 'Male', value: 'Male'},
    { key: 'Female', value: 'Female'},
    { key: 'Others', value: 'Others'},
  ];

  bloodGroup: BloodGroup[] = [
    { key: 'A+', value: 'A+'},
    { key: 'A-', value: 'A-'},
    { key: 'B+', value: 'B+'},
    { key: 'B-', value: 'B-'},
    { key: 'AB+', value: 'AB+'},
    { key: 'AB-', value: 'AB-'},
    { key: 'O+', value: 'O+'},
    { key: 'O-', value: 'O-'},
  ];
  selectedFile: any;

  constructor(
    private patientService: PatientService,
    private router: Router) { }

  ngOnInit(): void {
    this.patientService.get(this.patientId)
    .subscribe({
      next: (response) => {

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  save(payload: any) {
    const formData: FormData = new FormData();
    formData.append('name', payload.name);
    formData.append('age', payload.age);
    formData.append('sex', payload.sex);
    formData.append('blood_group', payload.blood_group);
    formData.append('phone', payload.phone);
    formData.append('email', payload.email);
    formData.append('address', payload.address);
    
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile, this.selectedFile.name);
    }

    if (this.patientId) {
      this.patientService.update(this.patientId, formData)
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.patientService.create(formData)
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    // this.router.navigate(['/']);
  }
}
