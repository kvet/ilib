import Vue from 'vue'
import { IlButton, IlToggleButton, IlButtonGroup, IlRadioGroup } from 'ilib-vue'
import './index.css'

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

            <h2>Native component</h2>

            <h2>Button component</h2>
            <IlButton @onClick="alert('clicked')">Hello world!</IlButton>
            <IlButton class="greenButton" @onClick="alert('green clicked')">Hello green world!</IlButton>

            <h2>ToggleButton component</h2>
            <IlButton :disabled="disabledButton" @onClick="alert('clicked')">
                Hello world!
            </IlButton>
            <IlToggleButton :active="disabledButton" @onClick="toggleHandler">
                {{'< ' + (disabledButton ? 'enable' : 'disable')}}
            </IlToggleButton>

            <h2>ButtonGroup component</h2>
            <IlButtonGroup>
                <IlButton :disabled="disabledButtonInGroup" @onClick="alert('clickedInGroup')">
                    Hello world!
                </IlButton>
                <IlToggleButton :active="disabledButtonInGroup" @onClick="toggleInGroupHandler">
                    {{'< ' + (disabledButtonInGroup ? 'enable' : 'disable')}}
                </IlToggleButton>
            </IlButtonGroup>

            <h2>RadioGroup component</h2>
            <IlRadioGroup :items="[1, 2, 3]" :active="activeItem" @onActivate="activateHandler"></IlRadioGroup>
            <IlRadioGroup :items="[1, 2, 3, 4, 5]" :active="activeItem" @onActivate="activateHandler"></IlRadioGroup>
        </div>`,
    components: { IlButton, IlToggleButton, IlButtonGroup, IlRadioGroup }
};

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});