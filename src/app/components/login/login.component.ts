import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/services/snackbar.service';
interface Credentials {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);
  snackbar = inject(SnackbarService);

  ngOnInit(): void { }

  credentials = {
    email: '',
    password: '',
  };

  LoginForm(credentials: Credentials) {
    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        if (response.token) {
          this.snackbar.openSnackBar({ message: 'Logged in successfully', class: 'submit-success' });
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => console.error('Error logging in:', error),
    })
  }
}
