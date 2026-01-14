import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ChatbotLocalService } from './chatbot-local.service';

// Interfaces pour le chatbot
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // Option 1: GitHub Models (nécessite un token valide)
  private readonly ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';
  private readonly MODEL = 'gpt-4o-mini';
  private readonly GITHUB_TOKEN = 'VOTRE_NOUVEAU_TOKEN_ICI'; // Remplacez par un token complet
  
  // Option 2: Alternative - Hugging Face (gratuit, sans token)
  // private readonly ENDPOINT = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
  // private readonly HF_TOKEN = 'hf_...'; // Token Hugging Face (gratuit)
  
  private useLocalFallback = true; // Utiliser le système local par défaut (pas besoin de token)

  // Historique de conversation (en mémoire, non stocké localement)
  private conversationHistory: ChatMessage[] = [];
  
  // Subject pour diffuser les réponses en streaming
  private messageSubject = new Subject<ChatMessage>();
  public messages$ = this.messageSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localService: ChatbotLocalService,
    private ngZone: NgZone
  ) {
    // Message système pour définir le comportement du chatbot
    this.conversationHistory.push({
      role: 'system',
      content: `Tu es un assistant médical intelligent spécialisé dans la détection du cancer du sein. 
      Tu dois fournir des réponses rapides, précises et empathiques. 
      Tu peux aider avec :
      - Des informations sur la détection du cancer du sein
      - L'interprétation des résultats
      - Des conseils généraux de santé
      - Répondre aux questions des patients
      
      Reste professionnel, bienveillant et concis dans tes réponses.`
    });
  }

  /**
   * Envoie un message au chatbot et reçoit une réponse
   */
  sendMessage(userMessage: string): Observable<string> {
    return new Observable(observer => {
      // Ajouter le message de l'utilisateur à l'historique
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      
      this.conversationHistory.push(userMsg);
      this.messageSubject.next(userMsg);

      // Utiliser le système local (pas besoin d'API externe)
      if (this.useLocalFallback) {
        this.ngZone.run(() => {
          setTimeout(() => {
            const assistantMessage = this.localService.generateResponse(userMessage);
            
            const assistantMsg: ChatMessage = {
              role: 'assistant',
              content: assistantMessage,
              timestamp: new Date()
            };
            
            this.conversationHistory.push(assistantMsg);
            this.messageSubject.next(assistantMsg);
            
            observer.next(assistantMessage);
            observer.complete();
          }, 500); // Petit délai pour simuler un appel API
        });
        
        return;
      }

      // Fallback: Utiliser l'API externe (nécessite un token valide)
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      });

      const body = {
        model: this.MODEL,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.95
      };

      this.http.post<ChatResponse>(this.ENDPOINT, body, { headers })
        .subscribe({
          next: (response) => {
            if (response.choices && response.choices.length > 0) {
              const assistantMessage = response.choices[0].message.content;
              
              const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: assistantMessage,
                timestamp: new Date()
              };
              
              this.conversationHistory.push(assistantMsg);
              this.messageSubject.next(assistantMsg);
              
              observer.next(assistantMessage);
              observer.complete();
            } else {
              observer.error('Aucune réponse reçue du chatbot');
            }
          },
          error: (error) => {
            console.error('Erreur API Chatbot, utilisation du mode local');
            
            this.ngZone.run(() => {
              // Utiliser le service local comme fallback
              const assistantMessage = this.localService.generateResponse(userMessage);
              
              const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: assistantMessage,
                timestamp: new Date()
              };
              
              this.conversationHistory.push(assistantMsg);
              this.messageSubject.next(assistantMsg);
              
              observer.next(assistantMessage);
              observer.complete();
            });
          }
        });
    });
  }

  /**
   * Réinitialise la conversation (garde uniquement le message système)
   */
  clearConversation(): void {
    const systemMessage = this.conversationHistory[0];
    this.conversationHistory = [systemMessage];
  }

  /**
   * Retourne l'historique de conversation actuel
   */
  getConversationHistory(): ChatMessage[] {
    // Retourner une copie pour éviter les modifications externes
    return [...this.conversationHistory].filter(msg => msg.role !== 'system');
  }

  /**
   * Configuration personnalisée du comportement du chatbot
   */
  setSystemPrompt(prompt: string): void {
    this.conversationHistory[0] = {
      role: 'system',
      content: prompt
    };
  }
}

