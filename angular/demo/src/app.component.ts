/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';

@Component({
    selector: 'my-app',
    styles: [`
    b { color: brown; }
    il-button.green, my-button.green { border: 1px solid green; padding: 20px; }
    il-button.green.disabled, my-button.green.disabled { border: 1px solid gray; }
`],
    template: `
    <h1>Hello world!</h1>
    <br/>
    <br/>
    <my-button #myBtn [disabled]="false" (onClick)="clicked('my')" class="green">Opapa!</my-button>
    <input type="checkbox" [(ngModel)]="myBtn.disabled"/>
    <br/>
    <br/>
    <il-button class="green" (onClick)="clicked('g')"><b>Hello World Again!</b></il-button>
    <br/>
    <br/>
    <il-button #btn [disabled]="false" (onClick)="clicked('g')">Hello World Again!</il-button>
    <input type="checkbox" [(ngModel)]="btn.disabled"/>
`
})
export class AppComponent {
    constructor() { }

    clicked(type) {
        alert(`clicked: ${type}`)
    }
}
