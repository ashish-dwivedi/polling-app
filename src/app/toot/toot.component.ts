import { findIndex } from "lodash";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { debounceTime } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { ApiService } from "../shared/api.service";
import { CommonService } from "../shared/common.service";
import { ChartsModalComponent } from "../charts-modal/charts-modal.component";

let allToots: any[] = [];
let intervalRef: any = {};

@Component({
  selector: 'app-toot',
  templateUrl: './toot.component.html',
  styleUrls: ['./toot.component.scss']
})
export class TootComponent implements OnInit {
  api: any;
  modalRef: any;
  toots: any[] = [];
  winners: any[] = [];
  lastId: string = '';
  tagSearch = new FormControl('');
  correctAnswer = new FormControl({value: '', disabled: true});

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.api = this.apiService.api;
    this.getTimeLines();
    this.tagSearch.valueChanges
      .pipe(
        debounceTime(400)
      )
      .subscribe(
        value => {
          if (value !== '') {
            this.toots = [];
            this.lastId = '';
            this.correctAnswer.enable({
              onlySelf: true,
              emitEvent: false
            });
            this.getStatusesWithTag();
            this.winners = [];
          } else {
            this.onCloseClick();
          }
        }
      );
    this.correctAnswer.valueChanges
      .pipe(
        debounceTime(400)
      )
      .subscribe(
        value => {
          console.log(value);
          if (value !== '') {
            this.toots = [].concat(allToots).filter(toot => {
              console.log(toot.content.toLowerCase().replace(/<[^>]*>/g, ''), value);
              return toot.content.toLowerCase().replace(/<[^>]*>/g, '')
                .indexOf(value.toLowerCase()) >= 0
            });
          } else {
            this.onClearCorrectAnswer();
          }
        }
      );
    this.commonService.timerRunning.subscribe(
      value => {
        if (value === true && this.tagSearch.value) {
          if (value === true) {
            intervalRef = setInterval(() => {
              this.getStatusesWithTag();
            }, 500)
          }
        } else if (value === false) {
          window.clearInterval(intervalRef);
          this.toots = this.toots.reverse();
        }
      }
    );
  }

  getStatusesWithTag(): void {
    this.api.get(`timelines/tag/${ this.tagSearch.value }`,
      { limit: 40 },
      (data) => {
        let tempArray = [];
        data = data.reverse();
        data.map(toot => {
          if (findIndex(this.toots, {id: toot.id}) < 0) {
            tempArray.push(toot);
          }
        });
        this.toots.unshift(...tempArray);
        allToots = this.toots;
        this.extractWinners();
      })
  }

  getTimeLines(id?: string): void {
    this.api.get('timelines/public', { id, limit: 40, only_media: false }, data => {
      this.toots = data;
    });
  }

  onTootCardClick(toot): void {
    if(this.tagSearch.value) {
      if (findIndex(this.winners, { id: toot.id}) < 0) {
        this.api.post(`statuses/${toot.id}/favourite`, () => {
          this.winners.push(toot);
        });
      } else {
        this.api.post(`statuses/${toot.id}/unfavourite`, () => {
          this.winners.splice(findIndex(this.winners, {id: toot.id}), 1);
        });
      }
    }
  }

  onCloseClick(): void {
    this.tagSearch.setValue('', {
      onlySelf: true,
      emitEvent: false
    });
    this.winners = [];
    this.onClearCorrectAnswer();
    this.correctAnswer.disable({
      onlySelf: true,
      emitEvent: false
    });
    this.getTimeLines();
    allToots = [];
  }

  onClearCorrectAnswer(): void {
    this.correctAnswer.setValue('', {
      onlySelf: true,
      emitEvent: false
    });
    this.lastId = '';
    this.toots = allToots;
  }

  onChartsClick(): void {
    this.modalRef = this.dialog.open(ChartsModalComponent, {
      width: '90vw',
      data: this.toots
    });
  }

  extractWinners(): void {
    this.winners = this.toots.filter(toot => toot.favourited === true);
  }
}
