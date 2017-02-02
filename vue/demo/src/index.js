import Vue from 'vue'
import { IlButton, IlToggleButton, IlButtonGroup, IlToggleButtonGroup } from 'ilib-vue'
import './index.css'
import { Slotted, ScopedSlotted } from './slotted'

let App = {
    data: function() {
        return {
            alert: alert.bind(window),

            disabledButton: false,
            disabledButtonInGroup: false,

            activeItem: 1
        }
    },
    methods: {
        toggleHandler() {
            this.disabledButton = !this.disabledButton;
        },
        toggleInGroupHandler() {
            this.disabledButtonInGroup = !this.disabledButtonInGroup;
        },
        activateHandler(e) {
            this.activeItem = e.index
        }
    },
    template: `
        <div>
            <h1>ilib vue demo</h1>

            <h2>Slots example</h2>
            <Slotted></Slotted>
            <Slotted><span slot="fullName">c:fullName</span></Slotted>
            <Slotted><span slot="firstName">c:firstName</span></Slotted>
            <Slotted>
                <span slot="firstName">c:firstName</span>
                <span slot="lastName">c:lastName</span>
            </Slotted>
            
            <h2>ScopedSlots example</h2>
            <ScopedSlotted></ScopedSlotted>
            <ScopedSlotted><template slot="fullName" scope="scope">{{scope.data}}</template></ScopedSlotted>
            <ScopedSlotted><template slot="firstName" scope="scope">{{scope.data}}</template></ScopedSlotted>
            <ScopedSlotted>
                <template slot="firstName" scope="scope">{{scope.data}}</template>
                <template slot="lastName" scope="scope">{{scope.data}}</template>
            </ScopedSlotted>

            <h2>Button component</h2>
            <IlButton @onClick="alert('clicked')">Hello world!</IlButton>
            <IlButton class="greenButton" @onClick="alert('green clicked')">Hello green world!</IlButton>

            <h2>ToggleButton component</h2>
            <IlButton :disabled="disabledButton" @onClick="alert('clicked')">
                Hello world!
            </IlButton>
            <IlToggleButton :active="disabledButton" @onClick="toggleHandler">
                < {{disabledButton ? 'enable' : 'disable'}}
            </IlToggleButton>

            <h2>ButtonGroup component</h2>
            <IlButtonGroup>
                <IlButton :disabled="disabledButtonInGroup" @onClick="alert('clickedInGroup')">
                    Hello world!
                </IlButton>
                <IlToggleButton :active="disabledButtonInGroup" @onClick="toggleInGroupHandler">
                    < {{disabledButtonInGroup ? 'enable' : 'disable'}}
                </IlToggleButton>
            </IlButtonGroup>

            <h2>ToggleButtonGroup component</h2>
            <IlToggleButtonGroup :items="[1, 2, 3]" :active="activeItem" @onActivate="activateHandler"></IlToggleButtonGroup>
            <IlToggleButtonGroup :items="[1, 2, 3, 4, 5]" :active="activeItem" @onActivate="activateHandler">
                <template scope="props">
                    <IlToggleButton :class="{ greenButton: props.index === 2 }" :active="props.active" @onClick="props.activate">
                        <i>{{props.item}}</i>
                    </IlToggleButton>
                </template>
            </IlToggleButtonGroup>
        </div>`,
    components: { IlButton, IlToggleButton, IlButtonGroup, IlToggleButtonGroup, Slotted, ScopedSlotted }
};

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});