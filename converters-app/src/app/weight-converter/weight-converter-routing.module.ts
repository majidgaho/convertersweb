import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightConverterComponent } from './weight-converter/weight-converter.component';

const routes: Routes = [
  { path: '', component: WeightConverterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightConverterRoutingModule { }
