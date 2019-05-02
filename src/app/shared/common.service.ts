import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loading: boolean;
  timerRunning = new BehaviorSubject(undefined);

  constructor() { }

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
    }
    responseHeaders.link.split(', ').map(
      link => {
          if (link.indexOf('rel="next"') >= 0) {
          links.next = link.replace('>; rel="next"', '').replace('<', '');
        } else {
          links.prev = link.replace('>; rel="prev"', '').replace('<', '');
        }
      }
    );
    return links;
  }
}
