// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const siteRoot = 'https://mastodon-bot.akelius.io';
const mastodonInstance = 'https://mastodon.akelius.io';

export const environment: any = {
  production: false,
  auth: {
    clientId: '15f8126ea25479ac9d2e7535594b364a630cba6a6703a1f8ad4677159a31837e',
    clientSecret: '7962135318fe34020600621b974685a7e520d1a8832ff6e5d0b13b82424d6fe6',
    accessToken: 'e434590a5fe744cfbfa97f4059a00e437f7515f1776308bd57c85d89fa05bc44',
    redirectUri: 'https://mastodon-bot.akelius.io'
  },
  siteRoot,
  mastodonInstance
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
