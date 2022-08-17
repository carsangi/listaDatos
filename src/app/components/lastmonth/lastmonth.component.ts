import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ConsultaAPIService } from '../../services/consulta-api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-lastmonth',
  templateUrl: './lastmonth.component.html',
  styleUrls: ['./lastmonth.component.css'],
})
export class LastmonthComponent implements OnInit {
  public barChartData1: ChartData<'bar'> | any | undefined;
  @HostBinding('class') classes = 'container';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  columnDate: any = [];
  fechaDesde: any;
  fechaHasta: any;
  data: any;
  departamentos: any;
  opcionDepartamento: any = 0;
  municipios: any;
  estadosOperacion: any;
  mes:String = '';
  mes1:String  = ''; 
  mes2:String  = '' ; 
  mes3:String  = '' ; 
  mes4:String  = '' ; 
  mes5:String  = ''; 
  mes6:String = '';

  constructor(private consultaAPIservice: ConsultaAPIService) {}

  ngOnInit(): void {}

  getFechas(column: string) {
    this.consultaAPIservice.getConsultaColumnas(column).subscribe((res) => {
      this.columnDate = res;
    });
  }

  buscar() {
    let fechaDesde = moment(this.fechaDesde);
    let fechaHasta = moment(this.fechaHasta);
    this.filtrarFechas(fechaDesde, fechaHasta);
  }
  filtrarFechas(fechaDesde: Moment, fechaHasta: Moment) {
    let arregloFechas: any = [];
    this.mes = fechaDesde.format('MMMM');
    this.mes1 =fechaDesde.subtract(1,'M').format('MMMM');
    this.mes2 =fechaDesde.subtract(1,'M').format('MMMM');
    this.mes3 =fechaDesde.subtract(1,'M').format('MMMM');
    this.mes4 =fechaDesde.subtract(1,'M').format('MMMM');
    this.mes5 =fechaDesde.subtract(1,'M').format('MMMM');
    this.mes6 =fechaDesde.subtract(1,'M').format('MMMM');
    let fechaLastMonth = fechaDesde;
    let diaA: number = fechaLastMonth.date();
    let mesA: number = fechaLastMonth.month();
    let añoA: number = fechaLastMonth.year();
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
    this.divirArreglo(arregloFechas);
  }

  divirArreglo(arregloFechas: Array<any>) {
    let matrizFecha: any = [];
    let aux: any = [];
    let rowAnterior: number;
    arregloFechas.map((fechaActual: any, index: number) => {
      if (aux.length == 0) {
        rowAnterior = fechaActual['rowIndex'];
        aux.push(fechaActual['rowIndex']);
      } else {
        if (fechaActual['rowIndex'] == rowAnterior + 1) {
          rowAnterior = fechaActual['rowIndex'];
          aux.push(fechaActual['rowIndex']);
        } else {
          matrizFecha.push(aux);
          aux = [];
          rowAnterior = fechaActual['rowIndex'];
          aux.push(fechaActual['rowIndex']);
        }
        if (index + 1 == arregloFechas.length) {
          matrizFecha.push(aux);
        }
      }
      index++;
    });
    this.consultarDatos(matrizFecha);
  }

  consultarDatos(matrizFecha: Array<any>) {
    this.data = [];
    for (let i = 0; i < matrizFecha.length; i++) {
      const subArreglo = matrizFecha[i];
      let indexInicio = subArreglo[0];
      let indexFinal = subArreglo[subArreglo.length - 1];
      this.consultaAPIservice
        .getConsultaDatos(indexInicio, indexFinal)
        .subscribe((res) => {
          this.data.push(res);
          if (i == matrizFecha.length - 1) {
            this.filtrarEstadoOperacion();
            //this.filtrarEstadoRetiro();
            this.filtrarDepartamento();
            this.llenarContador();
            
          }
        });
    }
  }

  filtrarEstadoOperacion() {
    let aux: any = [];
    this.data.forEach((element: any) => {
      element.forEach((element2: any) => {
        if(element2[4] === undefined){
          aux.push(' ');
        }else{
          aux.push(element2[4]);
        }
      });
    });
    this.estadosOperacion = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
    });
    this.estadosOperacion.sort();
  }

  filtrarDepartamento() {
    let aux: any = [];
    this.data.map((element: any) => {
      element.forEach((element2: any) => {
        aux.push(element2[2]);
      });
    });
    this.departamentos = aux.filter((item: any, index: any) => {
      return aux.indexOf(item) === index;
    });
    this.departamentos.sort();
  }

  filtrarMunicipio(departamento: string) {
    let aux: any = [];
    this.data.forEach((element: any) => {
      element.forEach((element2: any) => {
        if (element2[2] == departamento) {
          aux.push(element2[1]);
        }
      });
    });
    this.municipios = aux.filter((item: any, index: any) => {
      return aux.indexOf(item) === index;
    });
    this.municipios.sort();
  }

  llenarContador() {
    let arregloRecuperados: any = [];
    let arregloFallecidos: any = [];
    let labelGrafica: any = [];
    let lDatos = this.estadosOperacion;
    let datos = Array(this.departamentos.length)
    let contadores=Array(this.estadosOperacion.length);
    let dato1: any = [],
      dato2: any = [],
      contadorVacios = 0;
    let lDato1, lDato2;
    let cRecuperados: number = 0,
      cFallecidos: number = 0;
    if (this.opcionDepartamento == '0') {
      labelGrafica = this.departamentos;
      for (let i = 0; i < this.departamentos.length; i++) {
        contadores.length = this.estadosOperacion.length;
        contadores.fill(0);
        this.data.map((item: any) => {
          item.forEach((row: any) => {
            if (this.departamentos[i] === (row[2]) && row[4] == undefined ){
              contadorVacios++;
            }else{
              for (let j = 0; j < contadores.length; j++) {
                if (this.departamentos[i] === (row[2]) && this.estadosOperacion[j] === row[4]) {
                  contadores[j]++;
                }
              }
            }  
          });
        });
        if(contadorVacios > 0){
          contadores[0]= contadores[0] + contadorVacios;
          contadorVacios = 0;
        } 
        datos[i]=contadores;
        contadores = []
      }
    } else if (this.opcionDepartamento != 0) {
      this.filtrarMunicipio(this.opcionDepartamento);
      labelGrafica = this.municipios;
      for (let i = 0; i < this.municipios.length; i++) {
        contadores.length = this.estadosOperacion.length;
        contadores.fill(0);
        this.data.map((item: any) => {
          item.forEach((row: any) => {
            if (this.municipios[i] === (row[1]) && (row[4] == undefined || row[4] == '')){
              contadorVacios++;
            }else{
              for (let j = 0; j < contadores.length; j++) {
                if (this.municipios[i] === (row[1]) && this.estadosOperacion[j] === row[4]) {
                  contadores[j]++;
                }
              }
            }
          });
        });
        if(contadorVacios > 0){
          contadores[0]= contadores[0] + contadorVacios;
          contadorVacios = 0;
        } 
        datos[i]=contadores;
        contadores = []
      }      
    }
    this.crearObjetoDataset(labelGrafica, datos, lDatos);
  }

  crearObjetoDataset(labelGrafica: any, datos: any, lDatos: any){
    let dataSet: Array<Object> = []
    let ArregloDatos: Array<Object> = []
    for (let i = 0; i < lDatos.length; i++) {
      for (let j = 0; j < datos.length; j++) {
        let aux = datos[j][i]
        ArregloDatos.push(aux)
      }
        if(lDatos[i] == ''){
          let objeto = {data: ArregloDatos, label: "SIN ESTADO DE OPERACION"};        
          dataSet.push(objeto)
          ArregloDatos = [];
        }else{
          let objeto = {data: ArregloDatos, label: lDatos[i]};
          dataSet.push(objeto)
          ArregloDatos = [];
        }
      }
    this.llenarGrafica(labelGrafica, dataSet);
  }

  llenarGrafica(labelGrafica: any, dataSet: Array<object>) {
    this.barChartData1 = {
      labels: labelGrafica,
      datasets: dataSet,
    };

  this.chart?.update();
}

  public barChartOptions1: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType1: ChartType = 'bar';
  public barChartPlugins1 = [DataLabelsPlugin];
}
