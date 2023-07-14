import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { EditJobComponent } from "./edit-job.component";
import { EditJobService } from "./edit-job.service";

@NgModule({
  declarations: [EditJobComponent],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [EditJobService]
})
export class EditJobModule {}
