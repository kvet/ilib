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

    <h2>Slots example</h2>
    <slotted></slotted>
    <slotted><span full-name>c:fullName</span></slotted>
    <slotted><span first-name>c:firstName</span></slotted>
    <slotted>
        <span first-name>c:firstName</span>
        <span last-name>c:lastName</span>
    </slotted>
            
    <h2>ScopedSlots example</h2>
    <scoped-slotted></scoped-slotted>
    <scoped-slotted><template scopedSlotted let-scope scopedSlottedOf="firstName">{{scope.data}}</template></scoped-slotted>
    <scoped-slotted><template scopedSlotted let-scope scopedSlottedOf="fullName">{{scope.data}}</template></scoped-slotted>
    <scoped-slotted>
        <template scopedSlotted let-scope scopedSlottedOf="firstName">{{scope.data}}</template>
        <template scopedSlotted let-scope scopedSlottedOf="lastName">{{scope.data}}</template>
    </scoped-slotted>

    <h2>Button component</h2>
    <button ilib-button (onClick)="clicked('g')"><b>Hello World Again!</b></button>
    <button ilib-button class="greenButton" (onClick)="clicked('g1')"><b>Hello Green World!</b></button>

    <h2>ToggleButton component</h2>
    <button ilib-button [disabled]="tbtn.active" (onClick)="clicked('btn')">Hello World!</button>
    <button ilib-toggle-button #tbtn [active]="false">
        < {{tbtn.active ? 'enable' : 'disable'}}
    </button>
    
    <h2>ButtonGroup component</h2>
    <div ilib-button-group>
        <button ilib-button #btnInGroup [disabled]="false" (onClick)="clicked('btnInGroup')">Hello World!</button>
        <button ilib-toggle-button [(active)]="btnInGroup.disabled">
            < {{btnInGroup.disabled ? 'enable' : 'disable'}}
        </button>
    </div>
    
    <h2>ToggleButtonGroup component</h2>
    <div ilib-toggle-button-group [items]="[1, 2, 3]" [(active)]="activeItem"></div>
    <div ilib-toggle-button-group [items]="[1, 2, 3, 4, 5]" [(active)]="activeItem">
        <button ilib-toggle-button [_reactiveMode]="true" *ilTemplate="let data" [active]="data.active" (onClick)="data.activate($event)" [class.greenButton]="data.index === 2">
            <i>{{data.item}}</i>
        </button>
    </div>

    <h2>Sizer</h2>
    <div ilib-sizer>
        <div *ilTemplate="let data" [style.border]="'1px solid black'">
            <span>Caclulated Size: {{data.width}}x{{data.height}}</span>
        </div>
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
