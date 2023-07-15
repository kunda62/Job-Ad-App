import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchDirective } from './search.directive';

@NgModule({
  imports: [CommonModule],
  exports: [SearchDirective],
  declarations: [SearchDirective]
})
export class SearchDirectiveModule { }
