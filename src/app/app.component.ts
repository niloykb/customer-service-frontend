import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';
import { SnackbarService } from './shared/services/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  modeType!: any;
  router = inject(Router);
  loader = inject(LoaderService);
  snackbar = inject(SnackbarService);
  authService = inject(AuthService);
  ngOnInit(): void {
    this.processLoader();
  }

  processLoader() {
    this.loader.requestType$.subscribe((type: string) => {
      this.modeType = type === 'GET' ? 'query' : 'indeterminate';
    });
  }

  logout() {
    this.authService.logout();
    this.snackbar.openSnackBar({ message: 'Logged Out successfully', class: 'submit-success' });
    this.router.navigateByUrl('/login');
  }

}
