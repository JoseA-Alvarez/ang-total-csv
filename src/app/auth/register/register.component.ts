import {Component} from '@angular/core';
import {UserCreateComponent} from "../../users/create/user-create.component";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        UserCreateComponent
    ],
    template: `
        <app-create></app-create>
    `,
    styles: ``
})
export class RegisterComponent {

}
