import { Component, OnInit, Input, Type, forwardRef } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";

/**
 *Allows to assign formControl/formControlName tag in parent component
 *
 *
 * @export
 * @param {Type<any>} component
 * @returns
 */
export function valueAccessor(component: Type<any>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}

/**
 *Provides parent control validators to current component
 *
 * @export
 * @param {Type<any>} component
 * @returns
 */
export function validatorAccessor(component: Type<any>) {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}

@Component({
  selector: "custom-input", //Name to be used for including component into template
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  providers: [valueAccessor(InputComponent), validatorAccessor(InputComponent)],
})
export class InputComponent implements OnInit, ControlValueAccessor, Validator {
  control: AbstractControl; //Store control from parent here
  value: any; //Value of control

  protected fnOnChange: Function; // Function that is triggered when control state changes
  protected fnOnTouched: Function; // Function called when control is touched

  @Input() config: InputConfig = new InputConfig(); //Pass config to apply customization for your control

  constructor() {}

  ngOnInit(): void {}

  /**
   *Additional styles to handle control states
   *via CSS
   *
   * @readonly
   * @type {{ [key: string]: boolean }}
   * @memberof InputComponent
   */
  get styles(): { [key: string]: boolean } {
    return {
      "has-value": !!this.hasValue,
      "border-danger": !!this.hasError,
    };
  }

  /**
   *Check whether control contains value
   *
   * @readonly
   * @type {boolean}
   * @memberof InputComponent
   */
  get hasValue(): boolean {
    return this.value && this.value.length;
  }

  /**
   *Check whether control is invalid
   *
   * @readonly
   * @type {boolean}
   * @memberof InputComponent
   */
  get hasError(): boolean {
    return this.control?.touched && this.control?.invalid;
  }

  /**
   *Returns message for current invalid state
   *
   * @readonly
   * @memberof InputComponent
   */
  get errors(): string {
    const errors = this.control?.errors;
    if (!!errors?.required) {
      return "Field is required";
    }

    if (!!errors?.maxlength) {
      return `Should be max ${errors.maxlength.requiredLength} symbols`;
    }

    if (!!errors?.minlength) {
      return `Should be min ${errors.maxlength.requiredLength} symbols`;
    }

    if (!!errors?.max) {
      return `Value shouldn\`t be larger than ${errors.max.max}`;
    }

    if (!!errors?.min) {
      return `Value shouldn\`t be lower than ${errors.min.min}`;
    }

    return "No validator";
  }

  /**
   *Handle writing state changing with new value
   *
   * @param {*} value
   * @memberof InputComponent
   */
  input(value: any): void {
    this.writeValue(value);
    this.fnOnChange ? this.fnOnChange(value) : null;
  }

  /**
   *Handle focus state triggered
   *
   * @param {*} value
   * @memberof InputComponent
   */
  focus(value: any): void {
    this.writeValue(value);
    this.fnOnTouched ? this.fnOnTouched(value) : null;
  }

  /**
   *Update current value of control
   *
   * @param {*} value
   * @memberof InputComponent
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   *Register change control event
   *
   * @param {Function} fn
   * @memberof InputComponent
   */
  registerOnChange(fn: Function): void {
    this.fnOnChange = fn;
  }

  /**
   *Register touch event
   *
   * @param {Function} fn
   * @memberof InputComponent
   */
  registerOnTouched(fn: Function): void {
    this.fnOnTouched = fn;
  }

  /**
   *Allows to handle custom errors
   *
   * @param {AbstractControl} c
   * @returns {(ValidationErrors | null)}
   * @memberof InputComponent
   */
  validate(c: AbstractControl): ValidationErrors | null {
    this.control = c;
    return null;
  }
}

/**
 *Define config fields to apply
 *for this control
 *
 * @export
 * @class InputConfig
 */
export class InputConfig {
  type: InputTypes = InputTypes.text; //default type
  label: string = "";
  placeholder: string = "Enter value...";
}

/**
 *Customize your input types
 *
 * @export
 * @enum {number}
 */
export enum InputTypes {
  text = "text",
  number = "number",
  calendar = "calendar",
  color = "color",
}
