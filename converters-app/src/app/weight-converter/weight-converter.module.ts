import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WeightConverterComponent } from './weight-converter/weight-converter.component';
import { KeysPipe } from '../core/key.pipe';

@NgModule({
  declarations: [WeightConverterComponent, KeysPipe],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports: [WeightConverterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WeightConverterModule { }
