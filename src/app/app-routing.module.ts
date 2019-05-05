import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TootComponent } from './toot/toot.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

const routes: Routes = [
  { path: '', component: TootComponent },
  { path: 'user-stats', component: UserStatsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
