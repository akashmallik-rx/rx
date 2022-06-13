import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EncountersComponent } from './components/encounters/encounters.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientComponent } from './components/patient/patient.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'patients', component: PatientComponent },
  { path: 'patients/:id', component: PatientDetailComponent },
  { path: 'patients/:patientId/encounters/:encounterId', component: EncountersComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
