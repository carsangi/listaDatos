import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ConsultaAPIService } from '../../services/consulta-api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Moment } from 'moment';
import * as moment from 'moment';

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
            this.filtrarEstadoRetiro();
            this.filtrarDepartamento();
            this.llenarDatos();
          }
        });
    }
  }

  filtrarEstadoOperacion() {
    let aux: any = [];
    this.data.forEach((element: any) => {
      element.forEach((element2: any) => {
        aux.push(element2[4]);
      });
    });
    this.estadosOperacion = aux.filter((item: any, index: any) => {
      return aux.indexOf(item) === index;
    });
    this.estadosOperacion.sort();
  }
  filtrarEstadoRetiro() {
    let aux: any = [];
    this.data.forEach((element: any) => {
      element.forEach((element2: any) => {
        aux.push(element2[5]);
      });
    });
    this.estadosRetiro = aux.filter((item: any, index: any) => {
      return aux.indexOf(item) === index;
    });
    this.estadosRetiro.sort();
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

  llenarDatos() {
    let arregloRecuperados: any = [];
    let arregloFallecidos: any = [];
    let labelGrafica: any = [];
    let dato1: any = [], dato2: any = [];
    let lDato1, lDato2;
    let cRecuperados: number = 0, cFallecidos: number = 0;
    if (this.opcionDepartamento == '0') {
      labelGrafica = this.departamentos;
      for (let i = 0; i < this.departamentos.length; i++) {
        this.data.map((item: any) => {
          item.forEach((row: any) => {
            if (this.departamentos[i].match(row[2])) {
              if ('INSTALADO'.match(row[4])) {
                lDato1 = 'INSTALADO';
                cRecuperados++;
              } else {
                lDato2 = 'NO INSTALADO';
                cFallecidos++;
              }
            }
          });
        });
        arregloRecuperados.push(cRecuperados);
        arregloFallecidos.push(cFallecidos);
        cRecuperados = 0;
        cFallecidos = 0;
      }
      dato1 = arregloRecuperados;
      dato2 = arregloFallecidos;
      this.llenarGrafica(labelGrafica, dato1, lDato1, dato2, lDato2)
    } else if (this.opcionDepartamento != 0) {
      this.filtrarMunicipio(this.opcionDepartamento);
      labelGrafica = this.municipios;
      for (let i = 0; i < this.municipios.length; i++) {
        this.data.map((element: any) => {
          element.forEach((mun: any) => {
            if (this.municipios[i].match(mun[1])) {
              lDato1 = 'INSTALADO';
              lDato2 = 'NO INSTALADO';
              if ('INSTALADO'.match(mun[4])) {
                cRecuperados++;
              } else{
                cFallecidos++;
              }
            }
          });
        });
        arregloRecuperados.push(cRecuperados);
        arregloFallecidos.push(cFallecidos);
        cRecuperados = 0;
        cFallecidos = 0;
      }
      dato1 = arregloRecuperados;
      dato2 = arregloFallecidos;
      this.llenarGrafica(labelGrafica, dato1, lDato1, dato2, lDato2)
    }
  }

  llenarGrafica(labelGrafica: any, dato1: any, lDato1: any, dato2: any, lDato2: any) {
    if (dato1 != null) {
      this.barChartData1 = {
        labels: labelGrafica,
        datasets: [
          { data: dato1, label: lDato1 },
          { data: dato2, label: lDato2 },
        ],
      };
    }
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
}
