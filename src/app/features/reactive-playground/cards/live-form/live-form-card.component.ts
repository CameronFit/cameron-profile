import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL } from '../../../../shared/material/material';
import { TextInputComponent } from '../../../../shared/ui/form-controls/text-input/text-input.component';

// Custom email validator with proper regex
function emailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(control.value);
  return valid ? null : { invalidEmail: true };
}

@Component({
  selector: 'app-live-form-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MATERIAL,
    TextInputComponent,
  ],
  templateUrl: './live-form-card.component.html',
  styleUrls: ['./live-form-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveFormCardComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get nameValid(): boolean {
    const control = this.form.controls.name;
    return control.valid && (control.dirty || control.touched);
  }

  get emailValid(): boolean {
    const control = this.form.controls.email;
    return control.valid && (control.dirty || control.touched);
  }

  get passwordMinValid(): boolean {
    return this.form.controls.password.value.length >= 8;
  }

  get passwordSpecialCharValid(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.form.controls.password.value);
  }

  get canSubmit(): boolean {
    return this.form.valid;
  }

  submitDemo(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}
