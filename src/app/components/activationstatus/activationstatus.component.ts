import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ConsultaAPIService } from '../../services/consulta-api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-activationstatus',
  templateUrl: './activationstatus.component.html',
  styleUrls: ['./activationstatus.component.css']
})
export class ActivationstatusComponent implements OnInit {
  columnDate: any = [];
  fechaDesde: Object = {};
  fechaHasta: Object = {};

  constructor(private consultaAPIservice: ConsultaAPIService) { }

  ngOnInit(): void {
    this.getColumn('E')
  }
  
  getColumn(column: string) {
    this.consultaAPIservice.getConsultaColumnas(column).subscribe((res) => {
      this.columnDate = res;
    });
  }

  buscar() {
    let fechaDesde = moment(this.fechaDesde);
    let fechaHasta = moment(this.fechaHasta);
    this.filtrarColumna(fechaDesde, fechaHasta);
  }

  filtrarColumna(fechaDesde: Moment, fechaHasta: Moment){
    let arregloFechas: any = [];
    let diaA: number = fechaDesde.date();
    let mesA: number = fechaDesde.month();
    let añoA: number = fechaDesde.year();
    let diaB: number = fechaHasta.date();
    let mesB: number = fechaHasta.month();
    let añoB: number = fechaHasta.year();
    let fechaA = new Date(añoA, mesA, diaA);
    let fechaB = new Date(añoB, mesB, diaB);
    for (let row = 1; row < this.columnDate.length; row++) {
      let element = moment(this.columnDate[row].toString(), 'DD-MM-YYYY');
      if (element == null) {
      } else {
        let dia = element.date();
        let mes = element.month();
        let año = element.year();
        let fechaActual = new Date(año, mes, dia);
        if (fechaActual >= fechaA && fechaActual <= fechaB) {
          var objeto = {
            fecha: fechaActual,
            rowIndex: row + 1,
          };
          arregloFechas.push(objeto);
        }
      }
    }
    this.filtrarExtremos(arregloFechas)
    arregloFechas = []
    this.columnDate = []
  }

  filtrarExtremos(arregloFechas: any){
    /* buscar los extremos por medio de un mergesort, vaciar memoria de arregloFechas y hacer la cosulta de los medios */
  }

  filtrarFechas(){
    /*  */
  }
}
