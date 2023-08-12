import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { CreateJobComponent } from "./create-job.component";

@NgModule({
  declarations: [CreateJobComponent],
  imports: [CommonModule, ReactiveFormsModule],
  providers: []
})
export class CreateJobModule {}
