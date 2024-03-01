import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {rolesList} from "../types";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, MatLabel, MatInput, MatFormField, MatButton, MatOption, MatSelect, MatAnchor, MatIcon],
  template: `
    <form [formGroup]="userForm">
      <div class="actions">
        <a mat-button routerLink="/home/users">
          <mat-icon>keyboard_backspace</mat-icon>
        </a>
        <div>Edit User</div>
      </div>
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
        <mat-label>Roles</mat-label>
        <mat-select formControlName="roles" multiple>
          @for (role of rolesList; track rolesList) {
            <mat-option [value]="role">{{ role }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button [disabled]="!userForm.valid" mat-button mat-raised-button color="primary" type="submit"
              (click)="save()">Save
      </button>
    </form>
  `,
  styles: `
    .actions {
      display: flex;
      align-content: center;
      height: 64px;
      border-bottom: 1px solid #e0e0e0;

      > div {
        margin-left: auto;
        margin-right: auto;
      }
    }

    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    form {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      width: 50%;
      box-shadow: darkgrey 0px 16px 20px;
      padding: 40px;
      border-radius: 5px;
    }

    form > * {
      width: 100%;
    }
  `
})
export class UserEditComponent implements OnInit {
  @Input() id = '';
  snackBar = inject(MatSnackBar)
  httpClient = inject(HttpClient);
  formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  userForm = this.formBuilder.group({
    email: [{value: '', disabled: true}, [Validators.email, Validators.required]],
    surname: [''],
    name: [''],
    other: [''],
    id: [0],
    roles: new FormControl([], Validators.required)
  });
  rolesList = rolesList;

  ngOnInit(): void {
    this.httpClient.get(`http://localhost:8000/users/${this.id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.userForm.patchValue(res);
      }, (err) => {
        console.log(err);
      });
  }

  save() {
    this.httpClient.post(`http://localhost:8000/users/${this.id}`, this.userForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.snackBar.open('User saved', 'Close', {duration: 5000});
      }, (err) => {
        this.snackBar.open('Error ', 'Close', {duration: 5000});

      });
  }
}
