import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SharedModule, 
    RouterOutlet, 
    SidenavComponent, 
    HeaderComponent, 
    FooterComponent,
    MatProgressSpinnerModule, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService);

}
