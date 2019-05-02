import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TootComponent } from "./toot.component";
import { TootCardComponent } from './toot-card/toot-card.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    TootComponent,
    TootCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TootModule { }
