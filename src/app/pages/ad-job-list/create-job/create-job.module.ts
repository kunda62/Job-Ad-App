import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { CreateJobComponent } from "./create-job.component";
import { CreateJobService } from "./create-job.service";

@NgModule({
  declarations: [CreateJobComponent],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CreateJobService]
})
export class CreateJobModule {}
