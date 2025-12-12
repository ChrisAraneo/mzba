import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, FormsModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected title = 'WebSocket Client';
  protected messages: string[] = [];
  protected inputMessage = '';
  protected isConnected = false;
  private ws?: WebSocket;
  private lastSendTimestamp?: number;

  ngOnInit(): void {
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
  }

  private connectWebSocket(): void {
    try {
      this.ws = new WebSocket('ws://localhost:8080/ws');

      this.ws.onopen = () => {
        this.isConnected = true;
        this.messages.push('Connected to server');
      };

      this.ws.onmessage = (event) => {
        const latency = this.lastSendTimestamp ? performance.now() - this.lastSendTimestamp : null;
        const latencyInfo = latency !== null ? ` (${latency.toFixed(6)}ms)` : '';
        this.messages.push(`Server: ${event.data}${latencyInfo}`);
        this.lastSendTimestamp = undefined;
      };

      this.ws.onerror = (error) => {
        this.messages.push('WebSocket error occurred');
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.messages.push('Disconnected from server');
      };
    } catch (error) {
      this.messages.push('Failed to connect');
      console.error('Connection error:', error);
    }
  }

  private disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  protected sendMessage(): void {
    if (this.ws && this.isConnected && this.inputMessage.trim()) {
      this.messages.push(`You: ${this.inputMessage}`);
      this.lastSendTimestamp = performance.now();
      this.ws.send(this.inputMessage);
      this.inputMessage = '';
    }
  }

  protected reconnect(): void {
    this.disconnectWebSocket();
    this.messages.push('Reconnecting...');
    setTimeout(() => this.connectWebSocket(), 500);
  }

  protected clearMessages(): void {
    this.messages = [];
  }
}
