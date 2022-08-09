import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlldataComponent } from './components/alldata/alldata.component'
import { LastmonthComponent } from './components/lastmonth/lastmonth.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/consulta',
    pathMatch: 'full'
  },
  {
    path: 'consulta',
    component: AlldataComponent
  },
  {
    path: 'historial',
    component: LastmonthComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
