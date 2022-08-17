import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ThemePalette } from '@angular/material/core';
import { BaseChartDirective } from 'ng2-charts';
import { ConsultaAPIService } from '../../services/consulta-api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Moment } from 'moment';
import * as moment from 'moment';

export interface Estado {
  nombre: string;
  completed: boolean;
  color: ThemePalette;
  subEstados?: Array<Estado>;
}

@Component({
  selector: 'app-alldata',
  templateUrl: './alldata.component.html',
  styleUrls: ['./alldata.component.css'],
})
export class AlldataComponent implements OnInit {
  public barChartData1: ChartData<'bar'> | any | undefined;
  public barChartData2: ChartData<'bar'> | any | undefined;
  public barChartData3: ChartData<'bar'> | any | undefined;
  @HostBinding('class') classes = 'container';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  columnDate: any = [];
  columnFilter: any = [];
  data: any;
  fechaDesde: any;
  fechaHasta: any;
  departamentos: any;
  municipios: any;
  opcionDepartamento: any = 0;
  selector: string = 'A';
  estadosOperacion: any = [];
  estadosRetiro: any = [];
  opcionFiltrado: any;
  categoria: any;
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
    this.divirArreglo(arregloFechas);
    arregloFechas = []
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
    matrizFecha = [];
    aux = [];
    rowAnterior = 0;

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
            this.filtrarEstadoRetiro();
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
        if(element2[4] === undefined || element2[4] == ' ' || element2[4] === ''){
          aux.push('');
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
  
  filtrarEstadoRetiro() {
    let aux: any = [];
    this.data.forEach((element: any) => {
      element.forEach((element2: any) => {
        if(element2[5] === undefined || element2[5] == ' ' || element2[5] === ''){
          aux.push('');
        }else{
          aux.push(element2[5]);
        }
      });
    });
    this.estadosRetiro = aux.filter((item: any, index: any) => {
      return aux.indexOf(item) === index;
    });
    this.estadosRetiro.sort();
  }
  filtrarDepartamento() {
    let aux: any = [];
    let aux2: any = [];

    this.data.map((element: any) => {
      element.forEach((element2: any) => {
        aux.push(element2[2]);
      });
    });
    this.departamentos = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
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
    let labelGrafica: any = [];
    let lDatos = this.estadosOperacion;
    let datos = Array(this.departamentos.length)
    let contadores=Array(this.estadosOperacion.length);
    let contadorVacios = 0, contador=0;

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
    this.crearSubEstados;
    let dataSet: Array<Object> = []
    let ArregloDatos: Array<Object> = []
    for (let i = 0; i < lDatos.length; i++) {
      for (let j = 0; j < datos.length; j++) {
        let aux = datos[j][i]
        if(aux === undefined){
          ArregloDatos.push(0)
        }else{
          ArregloDatos.push(aux)   
        }
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
      this.crearSubEstados()
    this.chart?.update();
  }

  /* Barra chart1*/
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

  /* Barra chart2*/
  public barChartOptions2: ChartConfiguration['options'] = {
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
  public barChartType2: ChartType = 'bar';
  public barChartPlugins2 = [DataLabelsPlugin];

  /* Barra chart3*/
  public barChartOptions3: ChartConfiguration['options'] = {
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
  public barChartType3: ChartType = 'bar';
  public barChartPlugins3 = [DataLabelsPlugin];

  /* check box */
crearSubEstados(): Array<Estado>{
  let subestado:any = []
  this.opcionFiltrado = this.estadosOperacion;
  this.opcionFiltrado.forEach((element: string) => {
    if(element == ''){
      let objeto: Estado = {nombre: "SIN ESTADO DE OPERACION", completed: false, color: 'primary'};        
      subestado.push(objeto)
      
    }else{
      let objeto: Estado = {nombre: element, completed: false, color: 'accent'};        
      subestado.push(objeto)
    }
    console.log(subestado)
    return subestado;
  });
  return [];
}
  estados: Estado = {
    nombre: 'Indeterminate',
    completed: false,
    color: 'primary',
    subEstados: this.crearSubEstados(),
    
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete =
      this.estados.subEstados != null &&
      this.estados.subEstados.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.estados.subEstados == null) {
      return false;
    }
    return (
      this.estados.subEstados.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.estados.subEstados == null) {
      return;
    }
    this.estados.subEstados.forEach((t) => (t.completed = completed));
  }
}
