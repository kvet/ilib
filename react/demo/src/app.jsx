import React from 'react';
import { MyButton } from './button';
import { Button, ToggleButton } from 'ilib-react';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            disabledButton: false
        };
    }
    render() {
        var clickHandler = () => alert(`clicked`)
        var toggleHandler = () => this.setState({ disabledButton: !this.state.disabledButton })

        return (
            <div>
                <h1>It Works!</h1>
                <br/>
                <br/>
                <MyButton style={{ background: 'red' }}>Hello World!</MyButton>
                <br/>
                <br/>
                <Button onClick={clickHandler}>Hello world!</Button>
                <br/>
                <br/>
                <Button disabled={this.state.disabledButton} onClick={clickHandler}>
                    Hello world!
                </Button>
                <ToggleButton active={this.state.disabledButton} onClick={toggleHandler}>
                    {'< ' + (this.state.disabledButton ? 'enable' : 'disable')}
                </ToggleButton>
            </div>
        )
    }
}