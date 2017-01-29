/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';

@Component({
    selector: 'my-app',
    styles: [`
    b { color: brown; }
    .green[ilib-button] { border: 1px solid green; padding: 4px; }
    .green[ilib-radio_group] { border: 1px solid green; }
`],
    template: `
    <h1>ilib angular demo</h1>

    <h2>Native component</h2>
    <my-button-group>
        <my-button [disabled]="true">Opapa</my-button>
        <my-button>Ololo</my-button>
    </my-button-group>

    <h2>Button component</h2>
    <button ilib-button (onClick)="clicked('g')"><b>Hello World Again!</b></button>
    <button ilib-button class="green" (onClick)="clicked('g1')"><b>Hello Green World!</b></button>

    <h2>ToggleButton component</h2>
    <button ilib-button #btn [disabled]="false" (onClick)="clicked('btn')">Hello World!</button>
    <button ilib-toggle_button [(active)]="btn.disabled">
        < {{btn.disabled ? 'enable' : 'disable'}}
    </button>
    
    <h2>ButtonGroup component</h2>
    <div ilib-button_group>
        <button ilib-button #btnInGroup [disabled]="false" (onClick)="clicked('btnInGroup')">Hello World!</button>
        <button ilib-toggle_button [(active)]="btnInGroup.disabled">
            < {{btnInGroup.disabled ? 'enable' : 'disable'}}
        </button>
    </div>
    
    <h2>RadioGroup component</h2>
    <div ilib-toggle_button_group #rg [items]="[1, 2, 3]" [active]="1"></div>
    <div ilib-toggle_button_group class="green" [items]="[1, 2, 3, 4, 5]" [(active)]="rg.active"></div>
`
})
export class AppComponent {
    buttonDisabled = false

    constructor() { }

    clicked(type) {
        alert(`clicked: ${type}`)
    }
}
