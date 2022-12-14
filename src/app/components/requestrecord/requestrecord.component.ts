import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ConsultaAPIService } from '../../services/consulta-api.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import 'moment/locale/es-mx'
moment.locale('es-mx');
import { Service } from '../../models/servicios';

@Component({
  selector: 'app-requestrecord',
  templateUrl: './requestrecord.component.html',
  styleUrls: ['./requestrecord.component.css']
})
export class RequestrecordComponent implements OnInit {
  @HostBinding('class') classes = 'container';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  columnDate: any = [];
  bd_selector: number = 0;
  fechaDesde: any;
  fechaHasta: any;
  data: any;
  estadosOperacion: string[] = [];
  estadosRetiro: string[] = [];
  departamentos: string[] = [];
  municipios: string[] = [];
  meses: Array<number> = [];
  stringMeses: Array<string> = [];
  servicios: Array<Service> = [];
  mainTable:Array<Array<Array<number>>> = [];
  requestByCitiesTable: Array<Array<number>> = [];
  requestByMonthTable: Array<Array<number>> = [];
  busqueda: number = 0;

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
        this.createMainTable(this.data, fechaDesde, fechaHasta);
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
    let a??oA: number = fechaDesde.year();
    let diaB: number = fechaHasta.date();
    let mesB: number = fechaHasta.month();
    let a??oB: number = fechaHasta.year();
    let fechaA = new Date(a??oA, mesA, diaA);
    let fechaB = new Date(a??oB, mesB, diaB);
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
    this.createMainTable(arreglo, fechaDesde, fechaHasta);
  }

  createMainTable(arreglo: Array<Service>, fechaDesde: Moment, fechaHasta: Moment){
    console.log(arreglo);
    this.filtrarEstadosOperacion(arreglo);
    this.filtrarMunicipios(arreglo);
    this.createMonths(fechaDesde, fechaHasta);
    let tabla:Array<Array<Array<number>>> = Array(this.municipios.length);
    let historial: Array<Array<number>> = Array(this.meses.length);
    let contadores: Array<number> = Array(this.estadosOperacion.length);
    let cont = 0;
    tabla.length = this.municipios.length;
    this.municipios.forEach((municipio, index2) =>{
      let fechaActual: Moment = moment(fechaDesde.format('YYYY-MM-DD'),'YYYY-MM-DD');
      historial.length = this.meses.length;
      historial.fill([0]);
      for(let l=0; fechaActual.month()<= fechaHasta.month(); l++){
        let firstDay = moment(fechaActual.startOf('month'),'YYYY-MM-DD');
        let lastDay = moment(fechaActual.endOf('month'),'YYYY-MM-DD');
        contadores.length = this.estadosOperacion.length;
        contadores.fill(0)
        arreglo.forEach((servicio: Service)=>{
          let auxDate = moment(servicio['fechaSolicitud'],'YYYY-MM-DD'); 
          if(auxDate>= firstDay && auxDate <= lastDay){
            this.estadosOperacion.forEach((estadoOperacion,index) =>{
              if(servicio['estadoOperacion'] == estadoOperacion && servicio['municipio'] == municipio){
                contadores[index]++;
                cont++
              }
            })
          }
        })
        contadores[contadores.length-1]=cont;
        cont = 0;
        historial[l] = contadores;
        contadores = [];
        fechaActual.add(1,'M');
      }
      tabla[index2] = historial;
      historial = []
    })
    
    this.mainTable = tabla;
    this.createStatusVMonthTable(tabla);
    this.createRequestVMonthTable(tabla);
    this.busqueda = 1;
  }

  createStatusVMonthTable(tabla: number[][][]){
    let matriz: Array<number[]> = [];
    let totalValores;
    let aux: number[];
    this.meses.forEach((mes, index)=>{
      aux = []
      tabla.forEach(mun =>{
        aux.push(mun[index][this.estadosOperacion.length-1]);
      })
      totalValores = aux.reduce(
        (previousValue: any, currentValue: any) => previousValue + currentValue,
        0
      );
      aux.push(totalValores);
      matriz.push(aux)
    })
    this.requestByCitiesTable = matriz;
  }

  createRequestVMonthTable(tabla: number[][][]){
    let contadores: number[] = [];
    let matriz: Array<number[]> = [];
    let totalValores;
    let aux: number[]
    this.meses.forEach((mes, index)=>{
      contadores=[];
      this.estadosOperacion.forEach((estado, index2)=>{
        aux = [];
        tabla.forEach((mun)=>{
          aux.push(mun[index][index2])
        })
        totalValores = aux.reduce(
          (previousValue: any, currentValue: any) => previousValue + currentValue,
          0
        );
        contadores.push(totalValores);
      })
      matriz.push(contadores);
    })
    this.requestByMonthTable = matriz;
  }

  createMonths(fechaDesde: Moment, fechaHasta: Moment){
    let fecha : Moment = moment(fechaDesde.format('YYYY-MM-DD'),'YYYY-MM-DD');
    let meses: Array<number> = []; 
    meses.length=8;
    meses.fill(0);
    let aux = fecha.month()
    meses.forEach((mes:number,index) =>{
      meses[index] = aux
      aux = fecha.add(1,'month').month();
    })
    this.meses =  meses;
    this.stringMonth(meses);

  }

  stringMonth(meses: Array<number>){
    let stringMeses: Array<string> = [];
    let aux: string;
    meses.map(mes =>{
      aux = moment(`2022-${mes+1}-01`,'YYYY-MM-DD').format('MMMM');
      stringMeses.push(aux);
    })
    this.stringMeses = stringMeses;  
  }
  filtrarEstadosOperacion(arreglo: Array<Service>) {
    let aux: any = [];
    arreglo.forEach((element: any) => {
      aux.push(element.estadoOperacion);
    });
    this.estadosOperacion = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
    });
    this.estadosOperacion.sort();
    this.estadosOperacion.push("TOTAL")
  }

  filtrarMunicipios(arreglo: Array<Service>) {
    let aux: any = [];
    arreglo.forEach((element: any) => {
      aux.push(element.municipio);
    });
    this.municipios = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
    });
    this.municipios.sort();
  }
}
