import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-temperature-converter',
  templateUrl: './temperature-converter.component.html',
  styleUrls: ['./temperature-converter.component.scss'],
  host: { class: 'center-container' }
})
export class TemperatureConverterComponent implements OnInit {
  inputTemperature!: number;
  inputUnit: string = 'celsius';
  outputTemperature!: number;
  outputUnit: string = 'fahrenheit';

  constructor() { }

  ngOnInit(): void {
  }

  convert(): void {
    if (this.inputUnit === 'celsius' && this.outputUnit === 'fahrenheit') {
      this.outputTemperature = this.inputTemperature * 1.8 + 32;
    } else if (this.inputUnit === 'fahrenheit' && this.outputUnit === 'celsius') {
      this.outputTemperature = (this.inputTemperature - 32) / 1.8;
    } else {
      this.outputTemperature = this.inputTemperature;
    }
  }
}
