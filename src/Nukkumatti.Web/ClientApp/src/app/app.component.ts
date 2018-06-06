import { Component } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private connection: HubConnection;

  loading: boolean;
  changeValue: number;
  currentCount = 0;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/counter')
      .build();

    this.connection.on('update', newCount => {
      this.currentCount = newCount;
    });

    this.loading = true;
    this.connection.start().then(() => {
      this.loading = false;
    });
  }

  public async increment() {
    if (!this.changeValue) {
      this.changeValue = 1;
    }
    await this.connection.send('increment', this.changeValue);
    this.currentCount = this.currentCount + 1;
    this.changeValue = undefined;
  }

  public async decrement() {
    if (!this.changeValue) {
      this.changeValue = 1;
    }
    await this.connection.send('decrement', this.changeValue);
    this.currentCount = this.currentCount - 1;
    this.changeValue = undefined;
  }

  async onKeyUp(event) {
    if (event.keyCode === 13) {
      await this.increment();
    }
  }
}
