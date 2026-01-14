import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AnalysisHistory {
  id: string;
  userId: string;
  date: Date;
  fileName: string;
  imageData: string; // base64 ou URL
  imageDimensions: string;
  patientId: string;
  modelVersion: string;
  imageType: string;
  result: {
    label: string;
    confidence: number;
  };
  processingTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private historySubject = new BehaviorSubject<AnalysisHistory[]>([]);
  public history$: Observable<AnalysisHistory[]> = this.historySubject.asObservable();

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    const historyStr = localStorage.getItem('analysisHistory');
    if (historyStr) {
      try {
        const history = JSON.parse(historyStr);
        // Convertir les dates string en Date objects
        const parsedHistory = history.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        this.historySubject.next(parsedHistory);
      } catch (e) {
        console.error('Error loading history:', e);
        this.historySubject.next([]);
      }
    }
  }

  private saveHistory(history: AnalysisHistory[]): void {
    localStorage.setItem('analysisHistory', JSON.stringify(history));
    this.historySubject.next(history);
  }

  addAnalysis(analysis: Omit<AnalysisHistory, 'id' | 'userId' | 'date'>, userId: string): void {
    const history = this.historySubject.value;
    const newAnalysis: AnalysisHistory = {
      ...analysis,
      id: this.generateId(),
      userId,
      date: new Date()
    };
    
    const updatedHistory = [newAnalysis, ...history];
    this.saveHistory(updatedHistory);
  }

  getHistoryByUser(userId: string): AnalysisHistory[] {
    return this.historySubject.value
      .filter(analysis => analysis.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getAnalysisById(id: string): AnalysisHistory | undefined {
    return this.historySubject.value.find(analysis => analysis.id === id);
  }

  deleteAnalysis(id: string, userId: string): void {
    const history = this.historySubject.value.filter(
      analysis => !(analysis.id === id && analysis.userId === userId)
    );
    this.saveHistory(history);
  }

  clearUserHistory(userId: string): void {
    const history = this.historySubject.value.filter(
      analysis => analysis.userId !== userId
    );
    this.saveHistory(history);
  }

  private generateId(): string {
    return 'analysis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
}

