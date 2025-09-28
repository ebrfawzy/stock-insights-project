import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GlobalHeaderComponent } from './components/global-header/global-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, GlobalHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('StockInsights');
}
