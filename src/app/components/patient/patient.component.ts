import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient, PatientFormGroup } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { NotificationUtil } from 'src/app/utils/notification.util';

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
  fileToUpload!: File;

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

  patientForm: PatientFormGroup;

  constructor(
    private notification: NotificationUtil,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router) {
      this.patientForm = this.formBuilder.group({
        id: [''],
        name: ['', Validators.required],
        age: [null, Validators.compose([Validators.required, Validators.min(0)])],
        sex: ['', Validators.required],
        blood_group: [''],
        phone: ['', Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)],
        email: ['', Validators.email],
        address: [''],
        avatar: [null],
        encounters: ['']
      }) as PatientFormGroup;
    }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  save() {
    this.patientService.create(this.patientForm.value)
    .subscribe({
      next: () => {
        this.notification.onCreateSuccess();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.notification.handleError('Failed to add patient data.', error);
      }
    });
  }
}
