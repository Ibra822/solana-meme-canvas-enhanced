import { PixelData } from '../components/grid/types';

type WebSocketMessage = {
  type: 'pixelUpdate';
  data: {
    index: number;
    pixelData: PixelData;
  };
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];

  connect() {
    this.ws = new WebSocket('wss://your-websocket-server.com');

    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.type === 'pixelUpdate') {
        this.messageHandlers.forEach(handler => handler(message));
      }
    };

    this.ws.onclose = () => {
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  updatePixel(index: number, pixelData: PixelData) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'pixelUpdate',
        data: { index, pixelData }
      }));
    }
  }
}

export const websocketService = new WebSocketService();