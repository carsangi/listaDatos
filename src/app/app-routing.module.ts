import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequeststatusComponent } from './components/requeststatus/requeststatus.component'
import { ActivationstatusComponent } from './components/activationstatus/activationstatus.component'
import { HomeComponent } from './components/home/home.component'
import { RequestrecordComponent } from './components/requestrecord/requestrecord.component'
import { ActivationrecordComponent } from './components/activationrecord/activationrecord.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'estado-solicitud',
    component: RequeststatusComponent
  },
  {
    path: 'estado-activacion',
    component: ActivationstatusComponent
  },
  {
    path: 'historial-solicitud',
    component: RequestrecordComponent
  },
  {
    path: 'historial-activacion',
    component: ActivationrecordComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
