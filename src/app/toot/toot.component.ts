import { findIndex } from "lodash";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { debounceTime } from "rxjs/operators";
import { ApiService } from "../shared/api.service";
import { CommonService } from "../shared/common.service";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartsModalComponent } from "../charts-modal/charts-modal.component";

let allToots: any[] = [];
let intervalRef: any = {};

@Component({
  selector: 'app-toot',
  templateUrl: './toot.component.html',
  styleUrls: ['./toot.component.scss']
})
export class TootComponent implements OnInit, OnDestroy {
  api: any;
  modalRef: any;
  toots: any[] = [];
  winners: any[] = [];
  lastId: string = '';
  subscriptions: any = {};
  tagSearch = new FormControl({value: '', disabled: true});
  correctAnswer = new FormControl({value: '', disabled: true});

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.api = this.apiService.api;
    this.getTimeLines();
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.resetWinnerData();
    Object.keys(this.subscriptions).map(key => {
      this.subscriptions[key].unsubscribe();
    })
  }

  initializeSubscriptions(): void {
    this.subscriptions['quiz'] = this.commonService.quizSubject.subscribe(
      value => {
        if (value) {
          this.tagSearch.enable({
            onlySelf: true,
            emitEvent: false
          })
        }
      }
    );
    this.subscriptions['tagSearch'] = this.tagSearch.valueChanges
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
    this.subscriptions['correctAnswer'] = this.correctAnswer.valueChanges
      .pipe(
        debounceTime(400)
      )
      .subscribe(
        value => {
          if (value !== '') {
            this.toots = [].concat(allToots).filter(toot => {
              return toot.content.toLowerCase().replace(/<[^>]*>/g, '')
                .indexOf(value.toLowerCase()) >= 0
            });
          } else {
            this.onClearCorrectAnswer();
          }
        }
      );
    this.subscriptions['timer'] = this.commonService.timerRunning.subscribe(
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
    this.subscriptions['winner'] = this.commonService.winners.subscribe(
      value => {
        value.map(toot => {
          this.api.get('statuses/' + toot.content.substr(toot.content.indexOf('winnerId=') + 9), data => {
            this.winners.push(data);
          })
        });
      }
    );
  }

  getStatusesWithTag(): void {
    this.api.get(`timelines/tag/${ this.tagSearch.value }`,
      { limit: 40 },
      data => {
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
        this.api.post('statuses', {
          status: `#quizwinner:quiz=${this.commonService.quizSubject.value.trim()}:` +
            `tag=${this.tagSearch.value}:winnerId=${toot.id}`,
          visibility: 'unlisted'
        }, () => {
          this.winners.push(toot);
        });
      } else {
        const existingToot = this.commonService.winners.value[
            findIndex(this.commonService.winners.value, winnerToot => {
              return (winnerToot.content.indexOf(`winnerId=${ toot.id }`) >= 0);
            })
          ];
        this.api.delete(`statuses/${ existingToot.id }`, () => {
          this.winners.splice(findIndex(this.winners, { id: toot.id }, 1));
          this.resetWinnerData();
          this.commonService.getAllBotToots({ tag: `${ this.tagSearch.value }`, isTag: true });
        })
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
    this.resetWinnerData();
    this.commonService.getAllBotToots({ tag: `${ this.tagSearch.value }`, isTag: true });
  }

  resetWinnerData(): void {
    this.commonService.winners.next([]);
    this.commonService.allBotToots.next([]);
  }
}
