import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Assurez-vous que HttpHeaders est importé
import { Observable } from 'rxjs';

export interface PredictionResult {
  label: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    // Assurez-vous que c'est bien votre URL ngrok actuelle, sans espace à la fin
    private apiUrl = 'https://nonantagonistic-nonexaggerative-jacki.ngrok-free.dev';

    constructor(private http: HttpClient) {}

    predictImage(file: File): Observable<PredictionResult> {
        const formData = new FormData();
        formData.append('file', file);

        // Créez l'en-tête pour contourner l'avertissement ngrok
        const headers = new HttpHeaders({
          'ngrok-skip-browser-warning': 'true'
        });

        console.log('📤 [API Service] Envoi de la requête avec en-tête spécial.');

        // Ajoutez { headers: headers } à votre requête POST
        return this.http.post<PredictionResult>(`${this.apiUrl}/predict`, formData, { headers: headers });
    }
}