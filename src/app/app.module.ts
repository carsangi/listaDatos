import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, FormControl} from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsultaAPIService } from './services/consulta-api.service'
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule, MatDatepicker} from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE,DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';
import { MatMomentDateModule,MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { NavegationComponent } from './components/navegation/navegation.component';
import { LastmonthComponent } from './components/lastmonth/lastmonth.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ActivationstatusComponent } from './components/activationstatus/activationstatus.component';
import { RequeststatusComponent } from './components/requeststatus/requeststatus.component';
import { RequestrecordComponent } from './components/requestrecord/requestrecord.component';
import { ActivationrecordComponent } from './components/activationrecord/activationrecord.component';

@NgModule({
  declarations: [
    AppComponent,
    NavegationComponent,
    LastmonthComponent,
    FooterComponent,
    HomeComponent,
    ActivationstatusComponent,
    RequeststatusComponent,
    RequestrecordComponent,
    ActivationrecordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgChartsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
  

  ],
  providers: [
    ConsultaAPIService,
    {provide: MAT_DATE_LOCALE, useValue: 'es-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
