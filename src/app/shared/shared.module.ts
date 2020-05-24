import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputComponent } from "./components/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule],
  exports: [InputComponent, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
