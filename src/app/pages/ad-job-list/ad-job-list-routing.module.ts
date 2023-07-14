

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";

import { AdJobListComponent } from './ad-job-list.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { CreateJobComponent } from './create-job/create-job.component';

const routes: Routes = [
  {
    path: "",
    component: AdJobListComponent
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
