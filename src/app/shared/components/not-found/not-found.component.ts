import { SharedModule } from '../../shared.module';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, SharedModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit  {
  currentPath: string = '';
  suggestedRoutes: string[] = [];

  router = inject(Router);
  location = inject(Location);

  ngOnInit() {
    this.currentPath = this.router.url;
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

}
