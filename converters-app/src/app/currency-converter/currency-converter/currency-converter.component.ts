// import { Component, OnInit } from '@angular/core';
// import { CurrencyService } from '../currency-converter.service';


// @Component({
//   selector: 'app-currency-converter',
//   templateUrl: './currency-converter.component.html',
//   styleUrls: ['./currency-converter.component.scss']
// })
// export class CurrencyConverterComponent implements OnInit {

//   currencies: string[] = [];
//   selectedFrom: string = 'USD';
//   selectedTo: string = 'EUR';
//   amount: number = 1;
//   result: number = 0;

//   constructor(private currencyService: CurrencyService) { }

//   ngOnInit(): void {
//     // this.currencyService.getCurrencies().subscribe((data: any) => {
//     //   this.currencies = Object.keys(data.rates);
//     // });
//   }

//   convert(): void {
//     // this.currencyService.getExchangeRate(this.selectedFrom, this.selectedTo).subscribe((data: any) => {
//     //   this.result = data.rates[this.selectedTo] * this.amount / data.rates[this.selectedFrom];
//     // });
//   }
// }
