import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { TootModule } from "./toot/toot.module";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { ChartsModalComponent } from './charts-modal/charts-modal.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    UserStatsComponent,
    ChartsModalComponent
  ],
  imports: [
    TootModule,
    ChartsModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [ AppComponent ],
  entryComponents: [ ChartsModalComponent ]
})
export class AppModule { }
