import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CurrencyConverterComponent } from './currency-converter/currency-converter/currency-converter.component';
import { HomeComponent } from './home/home.component';
import { TemperatureConverterComponent } from './temperature-converter/temperature-converter/temperature-converter.component';
import { TextToImageComponent } from './text-to-image/text-to-image/text-to-image.component';
import { WeightConverterComponent } from './weight-converter/weight-converter/weight-converter.component';
// import { LengthConverterComponent } from './length-converter/length-converter.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'temperature-converter',
    loadChildren: () =>
      import('./temperature-converter/temperature-converter.module').then(
        (module) => module.TemperatureConverterModule
      ),
    component: TemperatureConverterComponent
  },
  {
    path: 'weight-converter',
    loadChildren: () =>
      import('./weight-converter/weight-converter.module').then(
        (module) => module.WeightConverterModule
      ),
    component: WeightConverterComponent
  },
  {
    path: 'text-to-image',
    loadChildren: () =>
      import('./text-to-image/text-to-image.module').then(
        (module) => module.TextToImageModule
      ),
    component: TextToImageComponent
  },
  // { path: 'length-converter', component: LengthConverterComponent },
  // { path: 'weight-converter', component: WeightConverterComponent },
  // Add more routes for other converters as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
