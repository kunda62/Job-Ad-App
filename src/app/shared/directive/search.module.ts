/*
 * Date: 11/24/2021
 * Modified: 11/24/2021
 * File: search.module.ts
 * Project: pwt
 * Copyright EY (c) 2021
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchDirective } from './search.directive';

@NgModule({
  imports: [CommonModule],
  exports: [SearchDirective],
  declarations: [SearchDirective]
})
export class SearchDirectiveModule { }
