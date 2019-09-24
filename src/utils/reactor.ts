class Event {

  private callbacks: Array<Function> = [];

  constructor(public name: string) {}

  public registerCallback(callback: Function) {
    this.callbacks.push(callback);
  }

  public unregisterCallback(callback: Function) {
    const index = this.callbacks.findIndex((cb) => cb === callback);
    if (index != -1)
      this.callbacks.splice(index, 1);
  }

  public dispatch(...eventArgs: any[]) {
    this.callbacks.forEach(function(cb) { cb(...eventArgs); });
  }

}

export class Reactor {

  private events: object = {};

  private getOrCreateEvent(eventName: string): Event {
    let event: Event = this.events[eventName];
    if (event === undefined) {
      event = new Event(eventName);
      this.events[eventName] = event;
    }
    return event;
  }

  public dispatchEvent(eventName: string, ...eventArgs: any[]) {
    this.getOrCreateEvent(eventName).dispatch(...eventArgs);
  }

  public addEventListener(eventName: string, callback: Function) {
    this.getOrCreateEvent(eventName).registerCallback(callback);
  }

  public removeEventListener(eventName: string, callback: Function) {
    this.getOrCreateEvent(eventName).unregisterCallback(callback);
  }

}
