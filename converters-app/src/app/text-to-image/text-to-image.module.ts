import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextToImageComponent } from './text-to-image/text-to-image.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';
import { MaterialExampleModule } from '../material.module';


@NgModule({
  declarations: [
    TextToImageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialExampleModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TextToImageModule { }
