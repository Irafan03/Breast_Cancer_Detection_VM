import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  showAuthModal = false;

  constructor(private router: Router) {}

  getStarted() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }
}

