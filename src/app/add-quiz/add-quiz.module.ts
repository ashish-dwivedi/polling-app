import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AddQuizComponent } from './add-quiz.component';

@NgModule({
  declarations: [ AddQuizComponent ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AddQuizModule { }
