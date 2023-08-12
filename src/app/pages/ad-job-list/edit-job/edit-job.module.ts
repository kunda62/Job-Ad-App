import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { EditJobComponent } from "./edit-job.component";

@NgModule({
  declarations: [EditJobComponent],
  imports: [CommonModule, ReactiveFormsModule],
  providers: []
})
export class EditJobModule {}
