import { Component } from '@angular/core';
import { menuItems } from '../menu-items';
import { SharedModule } from '../../shared.module';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SharedModule, RouterLink, RouterLinkActive, MenuItemComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  menuItems = menuItems;
}
