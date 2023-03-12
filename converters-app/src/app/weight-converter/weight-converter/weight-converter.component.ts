import { Component } from '@angular/core';

@Component({
  selector: 'app-weight-converter',
  templateUrl: './weight-converter.component.html',
  styleUrls: ['./weight-converter.component.scss']
})
export class WeightConverterComponent {
  inputValue: number = 0;
  outputValue: number = 0;
  inputUnit: string = 'kg';
  outputUnit: string = 'lb';

  weightUnits: string[] = ['kg', 'lb'];

  convert(): void {
    // Convert the input value from the input unit to the output unit
    if (this.inputUnit === 'kg' && this.outputUnit === 'lb') {
      this.outputValue = this.inputValue * 2.20462;
    } else if (this.inputUnit === 'lb' && this.outputUnit === 'kg') {
      this.outputValue = this.inputValue / 2.20462;
    } else {
      this.outputValue = this.inputValue;
    }
  }
}
