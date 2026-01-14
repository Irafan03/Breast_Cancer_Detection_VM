import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  isChatOpen: boolean = false;
  errorMessage: string = '';

  private messagesSubscription?: Subscription;

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // S'abonner aux messages du service
    this.messagesSubscription = this.chatbotService.messages$.subscribe(
      (message) => {
        this.messages.push(message);
        this.cdr.detectChanges(); // Forcer la détection des changements
        this.scrollToBottom();
      }
    );

    // Charger l'historique existant
    this.messages = this.chatbotService.getConversationHistory();
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  /**
   * Basculer l'affichage du chatbot
   */
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.focusInput();
        this.scrollToBottom();
      }, 100);
    }
  }

  /**
   * Envoyer un message
   */
  sendMessage(): void {
    const message = this.userInput.trim();
    
    if (!message || this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.userInput = '';

    this.chatbotService.sendMessage(message).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Forcer la mise à jour de l'affichage
        this.scrollToBottom();
        this.focusInput();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
        this.cdr.detectChanges(); // Forcer la mise à jour de l'affichage
        this.scrollToBottom();
      }
    });
  }

  /**
   * Gérer la touche Entrée
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Réinitialiser la conversation
   */
  clearChat(): void {
    if (confirm('Voulez-vous vraiment effacer la conversation ?')) {
      this.chatbotService.clearConversation();
      this.messages = [];
      this.errorMessage = '';
    }
  }

  /**
   * Faire défiler vers le bas
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  /**
   * Mettre le focus sur l'input
   */
  private focusInput(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  /**
   * Formater l'heure du message
   */
  formatTime(timestamp?: Date): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
}

