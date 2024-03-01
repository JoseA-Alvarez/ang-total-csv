import {computed, inject, Injectable, signal} from '@angular/core';
import {Credentials} from '../interfaces/credentials';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // sources
  http = inject(HttpClient)
  router = inject(Router);

  // state
  private state = signal<any>({
    user: null,
  });

  // selectors
  user = computed(() => this.state().user);


  renewToken() {
    return (this.http.post('http://localhost:8000/refresh',
      {refresh_token: localStorage.getItem('refresh_token')}) as Observable<UserUI>)
      .pipe(tap((response: UserUI) => {
        this.setItemInLocalStorage(response);
      })) as Observable<{ access_token: string, refresh_token: string }>;
  }

  setItemInLocalStorage(userUI: UserUI) {
    localStorage.setItem('access_token', userUI.access_token);
    localStorage.setItem('refresh_token', userUI.refresh_token);
    localStorage.setItem('user', JSON.stringify(userUI));
    this.state.set({user: userUI});
  }

  login(credentials: Credentials) {
    const form = new FormData();
    form.append('username', credentials.username);
    form.append('password', credentials.password);
    form.append('grant_type', 'password');

    return this.http.post('http://localhost:8000/login', form)
      .pipe(tap((response: any) => {
        this.state.set({user: credentials.username});
      })) as Observable<{ access_token: string, refresh_token: string }>;
  }

  logout() {
    this.state.set({user: null});

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    this.router.navigate(['/auth/login']);

  }
}

export interface AuthState {
  user: unknown;
}

export interface UserUI {
  email: string;
  name: string;
  roles: string[];
  access_token: string;
  refresh_token: string;
}
