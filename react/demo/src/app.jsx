import React from 'react';
import { MyButton } from './button';
import { Button, ToggleButton, ButtonGroup } from 'ilib-react';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            disabledButton: false,
            disabledButtonInGroup: false
        };
    }
    render() {
        var toggleHandler = () => this.setState({ disabledButton: !this.state.disabledButton })
        var toggleInGroupHandler = () => this.setState({ disabledButtonInGroup: !this.state.disabledButtonInGroup })

        return (
            <div>
                <h1>ilib react demo</h1>

                <h2>Native component</h2>
                <MyButton style={{ background: 'red' }}>Hello World!</MyButton>

                <h2>Button component</h2>
                <Button onClick={alert.bind(null, 'clicked')}>Hello world!</Button>

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
            </div>
        )
    }
}