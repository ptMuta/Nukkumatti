import {Component, OnInit} from '@angular/core';
import {HubConnectionBuilder, HubConnection} from '@aspnet/signalr';

const STORAGE_EXIT_DIRECTION = 'STORAGE_EXIT_DIRECTION';

function debounce(func, wait, immediate = false) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

enum ExitDirection {
  right,
  left
}

enum EventType {
  exit,
  entry
}

interface Event {
  type: EventType;
  amount: number;
  time: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private connection: HubConnection;
  private applyChange: () => void;

  loading: boolean;
  exitDirection: ExitDirection = ExitDirection.right;
  changeValue: number;
  currentCount = 0;
  history: Event[] = [];

  constructor() {
    const storedExitDirection = localStorage.getItem(STORAGE_EXIT_DIRECTION);
    this.exitDirection = storedExitDirection !== null ? parseInt(storedExitDirection, 10) : ExitDirection.right;

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

    this.applyChange = debounce(() => {
      this.sendChange();
    }, 1000);
  }

  private async sendChange() {
    if (isNaN(this.changeValue)) {
      return;
    }

    await this.connection.send('change', this.changeValue);
    this.currentCount = this.currentCount + this.changeValue;
    if (this.currentCount < 0) {
      this.changeValue = this.changeValue - this.currentCount;
    }
    this.history.unshift({
      type: this.changeValue > 0 ? EventType.entry : EventType.exit,
      amount: Math.abs(this.changeValue),
      time: new Date()
    });
    this.changeValue = undefined;
  }

  public async increment() {
    this.changeValue = this.changeValue ? this.changeValue + 1 : 1;
    await this.sendChange();
  }

  public async decrement() {
    this.changeValue = this.changeValue ? this.changeValue - 1 : -1;
    await this.sendChange();
  }

  public async onInputKeyUp(event) {
    if (event.keyCode === 13) {
      await this.increment();
    }
  }

  public setExitDirection(direction: ExitDirection) {
    if (confirm('Haluatko varmasti vaihtaa ulosmeno suuntaa?')) {
      this.exitDirection = direction;
      localStorage.setItem(STORAGE_EXIT_DIRECTION, this.exitDirection.toString());
    }
  }

  ngOnInit() {
    const increaseChangeValue = () => this.changeValue = this.changeValue !== undefined ? this.changeValue + 1 : 1;
    const decreateChangeValue = () => this.changeValue = this.changeValue !== undefined ? this.changeValue - 1 : -1;

    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case 39: // Right Arrow
          if (this.exitDirection === ExitDirection.right) {
            decreateChangeValue();
          } else {
            increaseChangeValue();
          }
          break;
        case 37: // Left Arrow
          if (this.exitDirection === ExitDirection.left) {
            decreateChangeValue();
          } else {
            increaseChangeValue();
          }
          break;
        case 38: // Up Arrow
          increaseChangeValue();
          break;
        case 40: // Down Arrow
          decreateChangeValue();
          break;
      }
      this.applyChange();
    });
  }
}


// Vasen/Oikea inc/dec defaul vasemmalle = ulos
// Debounce inc value
