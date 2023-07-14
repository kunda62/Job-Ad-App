import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { FilterModule } from 'src/app/shared/components/filter/filter.module';
import { SearchDirectiveModule } from 'src/app/shared/directive/search.module';

import { AdJobListComponent } from './ad-job-list.component';
import { AdJobListRoutingModule } from './ad-job-list-routing.module';
import { AdJobListService } from './ad-job-list.service';
import { EditJobModule } from './edit-job/edit-job.module';
import { CreateJobModule } from './create-job/create-job.module';

@NgModule({
  declarations: [AdJobListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdJobListRoutingModule,
    EditJobModule,
    CreateJobModule,
    PaginationModule,
    FilterModule,
    SearchDirectiveModule
  ],
  providers: [AdJobListService],
})
export class AdJobListModule {}
