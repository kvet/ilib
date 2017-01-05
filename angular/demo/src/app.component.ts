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
    <button ilib-button class="green" (onClick)="clicked('g')"><b>Hello World Again!</b></button>
    <br/>
    <br/>
    <button ilib-button #btn [disabled]="false" (onClick)="clicked('g')">Hello World!</button>
    <button ilib-toggle_button [(active)]="btn.disabled">
        < {{btn.disabled ? 'enable' : 'disable'}}
    </button>
`
})
export class AppComponent {
    buttonDisabled = false

    constructor() { }

    clicked(type) {
        alert(`clicked: ${type}`)
    }
}
