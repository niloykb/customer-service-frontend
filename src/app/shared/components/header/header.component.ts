import { Router } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { MatDrawer } from '@angular/material/sidenav';
import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { LoaderService } from '../../services/loader.service';
import { SnackbarService } from '../../services/snackbar.service';

type ModeType = 'query' | 'indeterminate';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() drawer!: MatDrawer;

  loadingMode: ModeType = 'indeterminate';

  router = inject(Router);
  loader = inject(LoaderService);
  snackbar = inject(SnackbarService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.processLoader();
  }

  processLoader() {
    this.loader.requestType$.subscribe((type: string) => {
      this.loadingMode = type === 'GET' ? 'query' : 'indeterminate';
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.snackbar.openSnackBar({ message: 'Logged out successfully', class: 'submit-success' });
  }
}
