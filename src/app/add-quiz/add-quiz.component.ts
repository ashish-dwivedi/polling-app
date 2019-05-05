import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { CommonService } from '../shared/common.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {

  api: any;
  quizSubject: FormControl;
  quizSubjects: any[] = [];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<AddQuizComponent>
  ) { }

  ngOnInit() {
    this.api = this.apiService.api;
    this.quizSubject = new FormControl('');
    this.getAllSubjects();
  }

  addNewQuiz(): void {
    this.api.post(`statuses`, {
      status: `#akbotquizsubject ${ this.quizSubject.value.trim() }`,
      visibility: 'unlisted'
    }, () => {
      this.getAllSubjects();
      this.onSubjectSelectClick(this.quizSubject.value);
      this.quizSubject.setValue('');
    });
  }

  getAllSubjects(): void {
    this.api.get(`timelines/home`,
      { limit: 40 },
      data => {
        this.quizSubjects = data;
        this.extractContent();
      });
  }

  extractContent(): void {
    this.quizSubjects = this.quizSubjects.filter(status => (status.content.indexOf('akbotquizsubject') >= 0));
    this.quizSubjects.map(status => {
      status.content = status.content.toLowerCase().replace(/<[^>]*>/g, '')
        .replace('#akbotquizsubject', '');
    });
  }

  onSubjectSelectClick(subject: string): void {
    this.commonService.quizSubject.next(subject);
    this.onCloseDialogClick();
  }

  onCloseDialogClick(): void {
    this.dialogRef.close();
  }

}
