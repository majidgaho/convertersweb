import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LengthConverterComponent } from './length-converter.component';

@NgModule({
  declarations: [LengthConverterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [LengthConverterComponent]
})
export class LengthConverterModule { }
