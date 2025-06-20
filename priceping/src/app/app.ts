import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Needed for NgIf, NgFor etc.
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Needed for ngModel

@Component({
  selector: 'app-root',
  standalone: true, // This makes it a standalone component
  imports: [CommonModule, FormsModule, HttpClientModule], // Import modules directly here
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  url: string = '';
  threshold_price: number | null = null;
  phone: string = '';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient) {}

  async trackProduct() {
    this.message = '';
    this.messageType = '';

    if (!this.url || !this.threshold_price || !this.phone) {
      this.message = 'Please fill in all fields.';
      this.messageType = 'error';
      return;
    }

    try {
      let body = new HttpParams()
        .set('url', this.url)
        .set('threshold_price', this.threshold_price.toString())
        .set('phone', this.phone);

      // Using .toPromise() is deprecated in newer Angular versions.
      // A better practice is to subscribe or use rxjs operators like firstValueFrom.
      // For simplicity and quick migration, I'm keeping .toPromise() for now,
      // but be aware it might show a warning in your console.
      const response = await this.http
        .post<any>('http://127.0.0.1:8000/track/', body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .toPromise(); // Keep for quick migration, consider firstValueFrom in production

      if (response && response.message) {
        this.message = `✅ ${response.message}`;
        this.messageType = 'success';
      } else if (response && response.error) {
        this.message = `❌ ${response.error}`;
        this.messageType = 'error';
      }
    } catch (error: any) {
      this.message = `❌ Failed to track. Try again! ${error.message || ''}`;
      this.messageType = 'error';
      console.error('Tracking error:', error);
    }
  }
}