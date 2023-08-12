import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';

import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { FilterModule } from 'src/app/shared/components/filter/filter.module';
import { SearchDirectiveModule } from 'src/app/shared/directive/search.module';

import { AdJobListComponent } from './ad-job-list.component';
import { AdJobListRoutingModule } from './ad-job-list-routing.module';
import { EditJobModule } from './edit-job/edit-job.module';
import { CreateJobModule } from './create-job/create-job.module';
import { AdJobDataService } from './services/ad-job-data.service';
import { AdJobEntityService } from './services/ad-job-entity.service';
import { AdJobResolver } from './services/ad-job.resolver';

const entityMetadata: EntityMetadataMap = {
  AdJob: {
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticUpsert: true,
    }
  }
};

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
  providers: [
    AdJobDataService,
    AdJobEntityService,
    AdJobResolver
],
})
export class AdJobListModule {

  constructor(
    eds: EntityDefinitionService,
    entityDataService: EntityDataService,
    coursesDataService: AdJobDataService) {

    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService('AdJob', coursesDataService);
  }
}
