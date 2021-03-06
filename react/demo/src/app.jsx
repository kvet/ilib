import React from 'react';
import { MyButton } from './button';
import { Slotted } from './slotted';
import { Button, ToggleButton, ButtonGroup, ToggleButtonGroup, Sizer } from 'ilib-react';
import './app.css'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            disabledButton: false,
            disabledButtonInGroup: false,

            activeItem: 1
        };
    }
    render() {
        var toggleHandler = () => this.setState({ disabledButton: !this.state.disabledButton })
        var toggleInGroupHandler = () => this.setState({ disabledButtonInGroup: !this.state.disabledButtonInGroup })

        var activateHandler = (e) => this.setState({ activeItem: e.index })

        return (
            <div>
                <h1>ilib react demo</h1>

                <h2>Native component</h2>
                <MyButton style={{ background: 'red' }}>Hello World!</MyButton>
                
                <h2>Slots example</h2>
                <Slotted/>
                <Slotted fullNameSlot={<span>c:fullName</span>}/>
                <Slotted firstNameSlot={<span>c:firstName</span>}/>
                <Slotted firstNameSlot={<span>c:firstName</span>} lastNameSlot={<span>c:lastName</span>}/>

                <h2>Button component</h2>
                <Button onClick={alert.bind(null, 'green clicked')}>Hello world!</Button>
                &nbsp;
                <Button className={"greenButton"} onClick={alert.bind(null, 'clicked')}>Hello green world!</Button>

                <h2>ToggleButton component</h2>
                <Button disabled={this.state.disabledButton} onClick={alert.bind(null, 'clicked')}>
                    Hello world!
                </Button>
                &nbsp;
                <ToggleButton active={this.state.disabledButton} onClick={toggleHandler}>
                    {'< ' + (this.state.disabledButton ? 'enable' : 'disable')}
                </ToggleButton>

                <h2>ButtonGroup component</h2>
                <ButtonGroup>
                    <Button disabled={this.state.disabledButtonInGroup} onClick={alert.bind(null, 'clickedInGroup')}>
                        Hello world!
                    </Button>
                    <ToggleButton active={this.state.disabledButtonInGroup} onClick={toggleInGroupHandler}>
                        {'< ' + (this.state.disabledButtonInGroup ? 'enable' : 'disable')}
                    </ToggleButton>
                </ButtonGroup>

                <h2>ToggleButtonGroup component</h2>
                <ToggleButtonGroup items={[1, 2, 3]} active={this.state.activeItem} onActivate={activateHandler}></ToggleButtonGroup>
                <ToggleButtonGroup items={[1, 2, 3, 4, 5]} active={this.state.activeItem} onActivate={activateHandler}>{{
                    default: (data) => 
                        <ToggleButton className={data.index === 2 ? 'greenButton' : ''} active={data.active} onClick={data.activate}>
                            <i>{data.item}</i>
                        </ToggleButton>
                }}</ToggleButtonGroup>

                <h2>Sizer component</h2>
                <Sizer>{{
                    default: (data) => 
                        <div style={{ border: '1px solid black' }}>
                            <span>Caclulated Size: {data.width}x{data.height}</span>
                        </div>
                }}</Sizer>
            </div>
        )
    }
}