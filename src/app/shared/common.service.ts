import { BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loading: boolean;
  allBotToots = new BehaviorSubject([]);
  winners = new BehaviorSubject([]);
  quizSubject = new BehaviorSubject(undefined);
  timerRunning = new BehaviorSubject(undefined);

  constructor(
    private apiService: ApiService
  ) {}

  getPrevAndNextLinks(headers: any): any {
    let arr = headers.getAllResponseHeaders().split('\r\n');
    let responseHeaders = arr.reduce(function (acc, current, i){
      var parts = current.split(': ');
      acc[parts[0]] = parts[1];
      return acc;
    }, {});
    let links = {
      next: '',
      prev: ''
    };
    if (responseHeaders.link) {
      responseHeaders.link.split(', ').map(
        link => {
          if (link.indexOf('rel="next"') >= 0) {
            links.next = link.replace('>; rel="next"', '').replace('<', '');
          } else {
            links.prev = link.replace('>; rel="prev"', '').replace('<', '');
          }
        }
      );
    }
    return links;
  }

  getAllBotToots(tagData: any, url?: string): any {
    let statusUrl = url ?
      url.replace(`${ environment.mastodonInstance }/api/v1`, '') : `/timelines/home`;
    this.apiService.api.get(statusUrl, { limit: 40 },
        (data, headers) => {
      this.allBotToots.next([].concat(this.allBotToots.value, data));
      let links = this.getPrevAndNextLinks(headers);
      if (links.next) {
        this.getAllBotToots(tagData, links.next);
      } else {
        this.extractWinners(tagData);
        return this.allBotToots;
      }
    });
  }

  extractWinners(tagData: any): void {
    this.winners.next(this.allBotToots.value.filter(toot => {
      toot.content = toot.content.replace(/<[^>]*>/g, '');
      if (tagData && tagData.tag) {
        let searchTerm = tagData.isTag ? `tag=${ tagData.tag }` : `quiz=${ tagData.tag }`;
        return ((toot.content.indexOf('#quizwinner') >= 0) && (toot.content.indexOf(searchTerm) >= 0));
      } else {
        return (toot.content.indexOf('#quizwinner') >= 0);
      }
    }));
  }
}
