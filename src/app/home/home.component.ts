import {Component, effect, inject} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../shared/data-access/auth.service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";


@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div>
      <mat-toolbar color="primary" class="top-bar">
        <button mat-icon-button (click)="snav.toggle()">
          <mat-icon>lunch_dining</mat-icon>
        </button>
        <span class="spacer"></span>


        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">

          <button mat-menu-item (click)="gotoProfile()">
            <mat-icon>account_circle</mat-icon>
            <span>Perfil</span>
          </button>
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>logout</mat-icon>
            <span>Salir</span>
          </button>

        </mat-menu>


      </mat-toolbar>


      <mat-sidenav-container class="example-sidenav-container">
        <mat-sidenav #snav>
          <mat-nav-list>
            <a mat-list-item routerLink="/home/users">Users</a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="mat-container">

          <router-outlet></router-outlet>


        </mat-sidenav-content>
      </mat-sidenav-container>


      <!--      -->
      <!--      <a [routerLink]="['/home/users']">Users</a>-->
      <!--      <div class="container">-->
      <!--      </div>-->


    </div>
  `,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterOutlet,
    MatListItem,
    MatSidenavContainer,
    MatNavList,
    MatSidenavModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      mat-toolbar {
        box-shadow: 0px -7px 11px 0px var(--accent-color);
      }

      mat-sidenav-content {
        height: calc(100vh - 64px);
      }

      mat-nav-list {
        width: 200px;
      }
    `,
  ],
})
export default class HomeComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      // if (!this.authService.user-edit()) {
      //   this.router.navigate(['auth', 'login']);
      // }
    });
  }

  gotoProfile() {
    this.router.navigate(['home', 'profile']);
  }
}
