import { Credentials } from '../types';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedModule } from '../../shared/shared.module';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  submitted = false;
  router = inject(Router);
  authService = inject(AuthService);
  snackbar = inject(SnackbarService);
  formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value as Credentials;;
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          if (response.token) {
            this.snackbar.openSnackBar({
              message: response.message,
              class: 'submit-success'
            });
            this.submitted = false;
            this.router.navigateByUrl('/admin/dashboard');
          }
        },
        error: (error) => {
          this.submitted = false;
          this.snackbar.openSnackBar({
            message: error.error.message,
            class: 'submit-error'
          });
        },
      })
    }
  }
}
