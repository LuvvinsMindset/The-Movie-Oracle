interface MessageEvent {
  type: 'new' | 'read' | 'delete';
  count?: number;
}

type MessageEventCallback = (event: MessageEvent) => void;

class MessageEventEmitter {
  private listeners: MessageEventCallback[] = [];

  subscribe(callback: MessageEventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  emit(event: MessageEvent) {
    this.listeners.forEach(callback => callback(event));
  }
}

export const messageEvents = new MessageEventEmitter(); 