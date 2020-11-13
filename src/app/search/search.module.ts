import { ResultsComponent } from './pages/results/results.component';
import { SearchRoutes } from './search.routing';
import { FilterComponent } from './components/filter/filter.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [
    SharedModule,
    SearchRoutes,
  ],
  declarations: [
    SearchComponent,
    FilterComponent,
    ResultsComponent,
  ],
  exports: [
    FilterComponent
  ]
})
export class SearchModule { }
