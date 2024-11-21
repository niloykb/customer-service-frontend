import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    imports: [SharedModule, RouterLink, RouterLinkActive],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
}
