import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Vérifier si l'utilisateur est déjà authentifié (localStorage)
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Pour l'instant, authentification simple (vous pouvez connecter avec un backend plus tard)
      // Vérifier si l'utilisateur existe dans localStorage
      const users = this.getStoredUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Créer un token simple
        const token = this.generateToken();
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify({ email: user.email, name: user.name }));
        
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next({ email: user.email, name: user.name });
        
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  signup(email: string, password: string, name: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Vérifier si l'email existe déjà
      const users = this.getStoredUsers();
      const exists = users.some(u => u.email === email);
      
      if (exists) {
        resolve(false); // Email déjà utilisé
        return;
      }
      
      // Créer le nouvel utilisateur (sans connexion automatique)
      const newUser = { email, password, name };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Ne pas connecter automatiquement - l'utilisateur doit se connecter
      resolve(true);
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUsers(): Array<{email: string, password: string, name: string}> {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

