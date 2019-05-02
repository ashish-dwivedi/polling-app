import { Component } from '@angular/core';
import { CommonService } from "./shared/common.service";

let timer = 10;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  time = timer;

  constructor(public commonService: CommonService) {}

  onStartTimerClick(): void {
    if (this.commonService.timerRunning.getValue()) {
      return;
    }
    this.commonService.timerRunning.next(true);
    const intervalRef = setInterval(() => {
      this.time--;
      if (this.time === 0) {
        this.time = timer;
        this.commonService.timerRunning.next(false);
        clearInterval(intervalRef);
      }
    }, 1000)
  }

  onAddTimeClick(addTime: boolean): void {
    if (addTime) {
      this.time += 5;
    } else if (this.time !== 5) {
      this.time -= 5;
    }
    timer = this.time;
  }
}
