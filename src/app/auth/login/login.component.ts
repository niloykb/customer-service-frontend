import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedModule } from '../../shared/shared.module';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  isSubmitting = signal(false);
  router = inject(Router);
  authService = inject(AuthService);
  snackbar = inject(SnackbarService);
  formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.isSubmitting.set(true);
    const credentials = this.loginForm.getRawValue();
    this.authService.login(credentials).subscribe({
      next: ({ message }: any) => {
        this.snackbar.openSnackBar({
          message: message,
          class: 'submit-success'
        });
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.snackbar.openSnackBar({
          message: error.error.message,
          class: 'submit-error'
        });
      }
    })
  }
}
