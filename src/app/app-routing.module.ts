import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlldataComponent } from './components/alldata/alldata.component'
import { LastmonthComponent } from './components/lastmonth/lastmonth.component'
import { HomeComponent } from './components/home/home.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
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
