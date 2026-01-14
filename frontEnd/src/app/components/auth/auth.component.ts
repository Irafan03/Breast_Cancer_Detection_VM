import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  @Output() close = new EventEmitter<void>();
  
  isLoginMode = true; // true = login, false = signup
  email = '';
  password = '';
  name = '';
  confirmPassword = '';
  error = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.name = '';
    this.confirmPassword = '';
  }

  async onSubmit() {
    this.error = '';
    this.successMessage = '';
    this.isLoading = true;

    // Validation
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      this.isLoading = false;
      return;
    }

    if (!this.isLoginMode) {
      // Mode signup
      if (!this.name) {
        this.error = 'Veuillez entrer votre nom';
        this.isLoading = false;
        return;
      }
      
      if (this.password !== this.confirmPassword) {
        this.error = 'Les mots de passe ne correspondent pas';
        this.isLoading = false;
        return;
      }
      
      if (this.password.length < 6) {
        this.error = 'Le mot de passe doit contenir au moins 6 caractères';
        this.isLoading = false;
        return;
      }

      // Signup
      const success = await this.authService.signup(this.email, this.password, this.name);
      if (success) {
        // Afficher un message de succès et basculer vers le mode login
        this.successMessage = 'Compte créé avec succès ! Connectez-vous maintenant.';
        this.isLoginMode = true;
        // Conserver l'email mais réinitialiser les autres champs
        const savedEmail = this.email;
        this.email = savedEmail;
        this.password = '';
        this.name = '';
        this.confirmPassword = '';
      } else {
        this.error = 'Cet email est déjà utilisé';
      }
    } else {
      // Mode login
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/upload']);
        this.closeModal();
      } else {
        this.error = 'Email ou mot de passe incorrect';
      }
    }

    this.isLoading = false;
  }

  closeModal() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if ((event.target as HTMLElement).classList.contains('auth-modal-overlay')) {
      this.closeModal();
    }
  }
}

