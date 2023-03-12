import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/';

  constructor(private http: HttpClient) { }

  getExchangeRates(baseCurrency: string) {
    return this.http.get(`${this.apiUrl}${baseCurrency}`);
  }
}
