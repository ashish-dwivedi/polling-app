import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule, MatProgressSpinnerModule, MatTableModule,
  MatToolbarModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";

const MAT_MODULES = [
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatToolbarModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MAT_MODULES,
    ReactiveFormsModule
  ],
  exports: [
    ...MAT_MODULES,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
