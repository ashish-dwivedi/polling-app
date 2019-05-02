import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "../shared/api.service";
import { findIndex } from 'lodash';
import { MatTable } from "@angular/material";
import { CommonService } from "../shared/common.service";
import {environment} from "../../environments/environment";

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
  @ViewChild(MatTable) table: MatTable<any>;
  winners: Participant[] = [];
  displayedColumns: string[] = [ 'position', 'participant', 'points', 'winning answers' ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.api = this.apiService.api;
    this.getFavouriteToots();
    this.interValRef = setInterval(() => {
      this.getFavouriteToots();
    }, 5000);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interValRef);
  }

  getFavouriteToots(url?: string): void {
    let favouriteUrl = url ?
      url.replace(`${ environment.mastodonInstance }/api/v1`, '') : `/favourites`;
    this.api.get(favouriteUrl, { limit: 40 }, (data, headers) => {
      let links = this.commonService.getPrevAndNextLinks(headers);
      data.map(toot => {
        let userIndex = findIndex(this.winners, { id: toot.account.id });
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
            if (findIndex(this.winners[userIndex].winningAnswers, { name: tag['name'] }) < 0) {
              this.winners[userIndex].points++;
              this.winners[userIndex].winningAnswers.push(tag);
            }
          })
        }
        this.sortWinners();
        this.table.renderRows();
      })
      if (links.next) {
        this.getFavouriteToots(links.next);
      }
    });
  }

  sortWinners(): void {
    this.winners = this.winners.sort((first, second) => {
      return second.points - first.points;
    })
    this.winners.map((winner, index) => {
      winner.position = index + 1;
    })
  }
}
