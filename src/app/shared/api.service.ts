import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import MastodonAPI from '../../mastodon';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api: any = {};
  authCode: string;

  constructor(private route: ActivatedRoute) {
    this.api = new MastodonAPI({
      instance: environment.mastodonInstance,
      api_user_token: environment.auth.accessToken
    });
    this.checkForAuthCode();
  }

  checkForAuthCode(): void {
    if (!this.route.snapshot.queryParams.code && !localStorage.getItem('authCode')) {
      this.registerApplication();
    } else {
      this.authCode = this.route.snapshot.queryParams.code;
      localStorage.setItem('authCode', this.authCode);
    }
  }

  registerApplication(): void {
    this.api.registerApplication('polling-bot',
      environment.siteRoot,
      ['read', 'write', 'follow'],
      environment.mastodonInstance,
      function(data) {
        localStorage.setItem('mastodon_client_id', data['client_id']);
        localStorage.setItem('mastodon_client_secret', data['client_secret']);
        localStorage.setItem('mastodon_client_redirect_uri', data['redirect_uri']);
        window.location.href = this.api.generateAuthLink(data['client_id'],
          data['redirect_uri'],
          'code',
          ['read', 'write', 'follow']
        );
      }
    );
  }

  setCode(authCode: string): void {
    this.api.getAccessTokenFromAuthCode(
      environment.auth.clientId,
      environment.auth.clientSecret,
      environment.auth.redirectUri,
      authCode,
      function(data) {
        // this.api.setConfig('api_user_token', tokenvar);
      }
    )
  }
}
