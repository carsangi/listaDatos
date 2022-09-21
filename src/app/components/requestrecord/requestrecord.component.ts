import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ConsultaAPIService } from '../../services/consulta-api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Service } from '../../models/servicios';

@Component({
  selector: 'app-requestrecord',
  templateUrl: './requestrecord.component.html',
  styleUrls: ['./requestrecord.component.css']
})
export class RequestrecordComponent implements OnInit {
public barChartData1: ChartData<'bar'> | any | undefined;
  public barChartData2: ChartData<'bar'> | any | undefined;
  @HostBinding('class') classes = 'container';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  columnDate: any = [];
  bd_selector: number = 0;
  fechaDesde: any;
  fechaHasta: any;
  data: any;
  constructor(private consultaAPIservice: ConsultaAPIService) { }

  ngOnInit(): void {
  }

  getColumn(column: string) {
    this.consultaAPIservice.getConsultaColumnas(column).subscribe((res) => {
      this.columnDate = res;
      let diaDesde = moment(this.fechaDesde).date();
      let mesDesde = moment(this.fechaDesde).month()-6;
      let anioDesde = moment(this.fechaDesde).year();
      let fechaDesde = moment(`${anioDesde}-${mesDesde}-${diaDesde}`, 'YYYY-MM-DD');
      let fechaHasta = moment(this.fechaHasta);
      this.filtrarColumna(fechaDesde, fechaHasta);
    });
  }

  getDataSQL(columna: string) {
    let diaDesde = moment(this.fechaDesde).date();
    let mesDesde = moment(this.fechaDesde).month()-6;
    let anioDesde = moment(this.fechaDesde).year();
    let fechaDesde = moment(`${anioDesde}-${mesDesde}-${diaDesde}`, 'YYYY-MM-DD');
    let fechaHasta = moment(this.fechaHasta);
    this.consultaAPIservice
      .getConsultaSQL(fechaDesde.format('YYYY-MM-DD'), fechaHasta.format('YYYY-MM-DD'), columna)
      .subscribe((res) => {
        this.data = res;
        this.filtrarFechas(this.data, fechaDesde, fechaHasta);
      });
  }

  buscar() {
    if (this.bd_selector == 1) {
      this.getColumn('B');
    } else if (this.bd_selector == 2) {
      this.getDataSQL('fechaSolicitud');
    }
  }

  filtrarColumna(fechaDesde: Moment, fechaHasta: Moment) {
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
        let anio = element.year();
        let fechaActual = new Date(anio, mes, dia);
        if (fechaActual >= fechaA && fechaActual <= fechaB) {
          let rowIndex = row + 1;
          arregloFechas.push(rowIndex);
        }
      }
    }
    this.consultarExtremos(arregloFechas.sort(), fechaDesde, fechaHasta);
    arregloFechas = [];
  }

  consultarExtremos(arregloFechas: any, fechaDesde: Moment, fechaHasta: Moment) {
    let izquierda = arregloFechas[0];
    let derecha = arregloFechas[arregloFechas.length - 1];
    this.consultaAPIservice
      .getConsultaDatos(izquierda, derecha)
      .subscribe((res) => {
        this.data = res;
        this.crearObjeto(fechaDesde, fechaHasta);
      });
  }

  crearObjeto(fechaDesde: Moment, fechaHasta: Moment){
    let fechaSolicitud: string,
      fechaActivacion: string,
      municipio: string,
      departamento: string,
      estadoOperacion: string,
      estadoRetiro: string;
    let arreglo: Array<Service> = [];
    let servicio: Service;
    this.data.forEach((element: object[]) =>{
      if (element[0] != undefined) {
        if (
          element[4] == undefined ||
          element[4].toString() == '' ||
          element[4].toString() == ' '
        ) {
          estadoOperacion = 'SIN ESTADO DE OPERACION';
        } else {
          estadoOperacion = element[4].toString();
        }
        if (
          element[5] == undefined ||
          element[5].toString() == '' ||
          element[5].toString() == ' '
        ) {
          estadoRetiro = 'SIN ESTADO DE RETIRO';
        } else {
          estadoRetiro = element[5].toString();
        }
        if (
          element[3] == undefined ||
          element[3].toString() == '' ||
          element[3].toString() == ' '
        ) {
          fechaActivacion = 'SIN ESTADO DE ACTIVACION';
        } else {
          fechaActivacion = moment(element[3].toString(),'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        fechaSolicitud = moment(element[0].toString(),'DD/MM/YYYY').format('YYYY-MM-DD');
        municipio = element[1].toString();
        departamento = element[2].toString();
        servicio = {
          fechaSolicitud: fechaSolicitud,
          municipio: municipio,
          departamento: departamento,
          fechaActivacion: fechaActivacion,
          estadoOperacion: estadoOperacion,
          estadoRetiro: estadoRetiro,
        };
        arreglo.push(servicio);
      }
    });
    this.filtrarFechas(arreglo, fechaDesde, fechaHasta);
  }

  filtrarFechas(arreglo: Array<Service>,fechaDesde: Moment, fechaHasta: Moment){
    console.log(arreglo);
    let matrizMes: any[][];
    let fechaActual: Moment = fechaDesde;
    for(let i=0; fechaActual.month()<= fechaHasta.month(); i++){
      let lastDay = fechaActual.endOf('month').format('YYYY-MM-DD');
      let firstDay = fechaActual.startOf('month').format('YYYY-MM-DD');
      arreglo.forEach((item)=>{
        let auxDate = item['fechaSolicitud'];
        if(auxDate>= firstDay && auxDate <= lastDay){
          matrizMes[i].push(auxDate)
        }
      })
      console.log(`${fechaActual.month()} primer dia: ${firstDay} ultimo dia: ${lastDay}`);
      fechaActual.add(1,'M');
    }
    console.log(matrizMes);
  }
}
