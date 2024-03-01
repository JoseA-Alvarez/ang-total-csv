import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <form [formGroup]="userForm">
      <h2>Profile</h2>
      <mat-form-field>
        <mat-label for="email">Email:</mat-label>
        <input matInput id="email" type="text" formControlName="email">
      </mat-form-field>

      <mat-form-field>
        <mat-label for="name">Name:</mat-label>
        <input matInput id="name" type="text" formControlName="name">
      </mat-form-field>

      <mat-form-field>
        <mat-label for="surname">SurName:</mat-label>
        <input matInput id="surname" type="text" formControlName="surname">
      </mat-form-field>

      <mat-form-field>
        <mat-label for="other">Other:</mat-label>
        <input matInput id="other" type="text" formControlName="other">
      </mat-form-field>

      <mat-form-field>
        <mat-label for="other">********</mat-label>
        <input matInput id="password" type="password" formControlName="password">
      </mat-form-field>


      <button [disabled]="!userForm.valid" mat-button mat-raised-button color="primary" type="submit"
              (click)="save()">Save
      </button>
    </form>
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    form > * {
      width: 50%;
    }
  `
})
export class ProfileComponent implements OnInit {
  snackBar = inject(MatSnackBar)
  httpClient = inject(HttpClient);
  formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  userForm = this.formBuilder.group({
    email: [{value: '', disabled: true}, [Validators.email, Validators.required]],
    surname: [''],
    name: [''],
    other: [''],
    password: ['']
  });

  ngOnInit(): void {
    this.httpClient.get(`http://localhost:8000/users/profile`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.userForm.patchValue(res);
      }, (err) => {
        console.log(err);
      });
  }

  save() {
    this.httpClient.post(`http://localhost:8000/users/profile/2`, {user: this.userForm.value})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.snackBar.open('User saved', 'Close', {duration: 5000});
      }, (err) => {
        this.snackBar.open('Error ', 'Close', {duration: 5000});
      });
  }
}
