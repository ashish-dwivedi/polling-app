import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { CommonService } from './shared/common.service';
import { AddQuizComponent } from './add-quiz/add-quiz.component';

let timer = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  time = timer;
  quizSubject: string;

  constructor(
    private dialog: MatDialog,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.quizSubject.subscribe(
      value => this.quizSubject = value
    );
  }

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
    }, 1000);
  }

  onAddTimeClick(addTime: boolean): void {
    if (addTime) {
      this.time += 5;
    } else if (this.time !== 5) {
      this.time -= 5;
    }
    timer = this.time;
  }

  onSelectQuizClick(): void {
    this.dialog.open(AddQuizComponent, {
      width: '400px'
    });
  }
}
