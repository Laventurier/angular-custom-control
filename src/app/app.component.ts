import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "custom-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  name: FormControl;

  ngOnInit() {
    this.createFormControl();
  }

  createFormControl() {
    this.name = new FormControl("", [
      Validators.required,
      Validators.maxLength(2),
      Validators.min(2),
      Validators.max(20),
    ]);
  }
}
