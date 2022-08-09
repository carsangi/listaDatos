import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsultaAPIService } from './services/consulta-api.service'
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavegationComponent } from './components/navegation/navegation.component';
import { LastmonthComponent } from './components/lastmonth/lastmonth.component';
import { AlldataComponent } from './components/alldata/alldata.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavegationComponent,
    LastmonthComponent,
    AlldataComponent,
    FooterComponent
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
  ],
  providers: [
    ConsultaAPIService,
    {provide: MAT_DATE_LOCALE, useValue: 'es-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
