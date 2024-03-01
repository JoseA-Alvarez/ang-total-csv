import {computed, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subject} from 'rxjs';
import {AuthService, UserUI} from "../../../shared/data-access/auth.service";
import {Credentials} from "../../../shared/interfaces/credentials";

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$;

  // state
  private state = signal<LoginState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    // reducers
    this.userAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({...state, status: 'success'}))
      );

    this.login$
      .pipe(takeUntilDestroyed())
      .subscribe((creds) => {
          this.authService.login(creds).subscribe((response) => {
            this.authService.setItemInLocalStorage(response as UserUI);
            this.state.update((state) => ({...state, status: 'success'}))
          });

        }
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({...state, status: 'error'}))
      );
  }
}
