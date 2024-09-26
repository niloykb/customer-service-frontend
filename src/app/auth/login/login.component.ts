import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedModule } from '../../shared/shared.module';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

interface Credentials {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  submitted = false;
  router = inject(Router);
  authService = inject(AuthService);
  snackbar = inject(SnackbarService);
  formBuilder = inject(FormBuilder);

  ngOnInit(): void { }

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const credentials: Credentials = this.loginForm.value as unknown as Credentials;
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          if (response.token) {
            this.snackbar.openSnackBar({
              message: 'Logged in successfully',
              class: 'submit-success'
            });
            this.submitted = false;
            this.router.navigate(['/admin/dashboard']);
          }
        },
        error: (error) => {
          this.submitted = false;
          console.error('Error logging in:', error);
          this.snackbar.openSnackBar({
            message: 'Login failed!',
            class: 'submit-error'
          });
        },
      })
    }
  }
}
