/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';

@Component({
    selector: 'my-app',
    styles: [`
    b { color: brown; }
    .greenButton { border: 1px solid green; }
`],
    template: `
    <h1>ilib angular demo</h1>

    <h2>Native component</h2>
    <my-button [disabled]="true"><template myTemplate let-data myTemplateOf="default">> {{data.text}} <</template></my-button>

    <h2>Button component</h2>
    <button ilib-button (onClick)="clicked('g')"><b>Hello World Again!</b></button>
    <button ilib-button class="greenButton" (onClick)="clicked('g1')"><b>Hello Green World!</b></button>

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
    
    <h2>ToggleButtonGroup component</h2>
    <div ilib-toggle_button_group [items]="[1, 2, 3]" [(active)]="activeItem"></div>
    <div ilib-toggle_button_group [items]="[1, 2, 3, 4, 5]" [(active)]="activeItem">
        <button ilib-toggle_button [_reactiveMode]="true" *ilTemplate="let data" [active]="data.active" (onClick)="data.activate($event)" [class.greenButton]="data.index === 2">
            <i>{{data.item}}</i>
        </button>
    </div>
`
})
export class AppComponent {
    activeItem = 1

    constructor() { }

    clicked(type) {
        alert(`clicked: ${type}`)
    }
}
