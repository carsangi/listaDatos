import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
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
    BrowserAnimationsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
