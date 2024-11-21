import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';

@Component({
    selector: 'app-root',
    imports: [
        SharedModule,
        RouterOutlet,
        SidenavComponent,
        HeaderComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService);

}
