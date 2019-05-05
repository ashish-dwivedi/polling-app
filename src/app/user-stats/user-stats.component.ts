import { findIndex } from 'lodash';
import { MatTable } from "@angular/material";
import { ApiService } from "../shared/api.service";
import { CommonService } from "../shared/common.service";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

interface Participant {
  id: string;
  points: number;
  participant: any;
  position: number;
  winningAnswers?: string[];
}

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit, OnDestroy {

  api: any;
  interValRef: any;
  quizSubscription: any;
  winnerSubscription: any;
  allWinningToots: any[]= [];
  winners: Participant[] = [];
  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = [ 'position', 'participant', 'points', 'winning answers' ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.api = this.apiService.api;
    this.interValRef = setInterval(() => {
      this.getAllWinnerToots();
    }, 5000);
    this.getAllWinnerToots();
    this.initializeSubscriptions();
  }

  initializeSubscriptions(): void {
    this.quizSubscription = this.commonService.quizSubject.subscribe(
      value => {
        if (value) {
          this.getAllWinnerToots();
        }
      }
    );
    this.winnerSubscription = this.commonService.winners.subscribe(
      value => {
        if (value.length) {
          let responseIndex = 0;
          value.map(toot => {
            this.apiService.api.get(`statuses/${ toot.content.split(':')[3].replace('winnerId=', '') }`, data => {
              this.allWinningToots.push(data);
              responseIndex++;
              if (responseIndex === value.length) {
                this.extractAllWinners();
              }
            });
          });
        }
      }
    );
  }

  extractAllWinners(): void {
    this.allWinningToots.map(toot => {
      let userIndex = findIndex(this.winners, {id: toot.account.id});
      if (userIndex < 0 && toot.tags.length) {
        this.winners.push({
          points: 1,
          position: 1,
          id: toot.account.id,
          participant: toot.account,
          winningAnswers: toot.tags
        });
      } else {
        toot.tags.map(tag => {
          if (findIndex(this.winners[userIndex].winningAnswers, {name: tag['name']}) < 0) {
            this.winners[userIndex].points++;
            this.winners[userIndex].winningAnswers.push(tag);
          }
        })
      }
    });
    this.sortWinners();
    this.table.renderRows();
  }

  ngOnDestroy(): void {
    this.resetWinnerData();
    this.quizSubscription.unsubscribe();
    this.winnerSubscription.unsubscribe();
    window.clearInterval(this.interValRef);
  }

  getAllWinnerToots(): void {
    this.resetWinnerData();
    this.commonService.getAllBotToots(
      { tag: (this.commonService.quizSubject.value || '').trim(), isTag: false }
    );
  }

  resetWinnerData(): void {
    this.commonService.winners.next([]);
    this.commonService.allBotToots.next([]);
  }

  sortWinners(): void {
    this.winners = this.winners.sort((first, second) => {
      return second.points - first.points;
    });
    this.winners.map((winner, index) => {
      winner.position = index + 1;
    })
  }
}
