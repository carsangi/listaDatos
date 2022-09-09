import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaAPIService {

  API_URI = 'http://localhost:3000/api'

  constructor(private http: HttpClient) { }

  getConsultaColumnas(column: string){
    return this.http.get(`${this.API_URI}/listarFechaPrueba?column=${column}`);
  }

  getConsultaDatos(indexInicio: number, indexFinal: number){
    return this.http.get(`${this.API_URI}/listarconIndex?indexInicio=${indexInicio}&indexFinal=${indexFinal}`);
  }

  getConsultaSQL(fechaDesde: string, fechaHasta: string, columna: string){
    return this.http.get(`${this.API_URI}/SQLquery?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&variable=${columna}`);
  }
}
