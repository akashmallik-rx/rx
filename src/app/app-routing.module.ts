import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EncountersComponent } from './components/encounters/encounters.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'patients/:id', component: PatientDetailComponent},
  {path: 'patients/:patientId/encounters/:encounterId', component: EncountersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
