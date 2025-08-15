import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule to imports
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AIChatComponent {
  userQuery: string = '';
  aiResponse: string = '';
  errorMessage: string = ''; // Add an error message property

  constructor(private http: HttpClient) {}

  askAI(): void {
    if (!this.userQuery.trim()) {
      alert('Por favor, escribe una pregunta.');
      return;
    }

    this.http.post<{ response: string }>('https://backend-reposteria-2r9n.onrender.com/ai/query', { query: this.userQuery }).subscribe({
      next: (response) => {
        this.aiResponse = response.response;
        this.errorMessage = ''; // Clear any previous error message
      },
      error: (error) => {
        console.error('Error al obtener la respuesta de la IA:', error);
        this.errorMessage = 'Hubo un problema al obtener la respuesta de la IA. Por favor, inténtalo más tarde.';
      }
    });
  }
}
