import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  modeType!: any;

  router = inject(Router);
  loader = inject(LoaderService);
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  processLoader() {
    this.loader.requestType$.subscribe((type: string) => {
      this.modeType = type === 'GET'? 'query' : 'indeterminate';
    });
  }
}
