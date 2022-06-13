import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
        id: new FormControl(''),
        name: new FormControl('', Validators.required),
        age: new FormControl(null, Validators.compose([Validators.required, Validators.min(0)])),
        sex: new FormControl('', Validators.required),
        blood_group: new FormControl(''),
        phone: new FormControl('', Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)),
        email: new FormControl('', Validators.email),
        address: new FormControl(''),
        avatar: new FormControl(null),
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
