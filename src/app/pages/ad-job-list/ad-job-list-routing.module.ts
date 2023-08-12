import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";

import { AdJobListComponent } from './ad-job-list.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { AdJobResolver } from './services/ad-job.resolver';

const routes: Routes = [
  {
    path: "",
    component: AdJobListComponent,
    resolve: {
      jobs: AdJobResolver
    }
  },
  {
    path: 'edit',
    component: EditJobComponent
  },
  {
    path: 'add',
    component: CreateJobComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})

export class AdJobListRoutingModule {}
