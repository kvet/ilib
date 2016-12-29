import React from 'react';
import { MyButton } from './button';
import { Button } from 'ilib-react';

export default class App extends React.Component {
    render() {
        var clickHandler = () => alert(`clicked`)

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
                <Button disabled="true" onClick={clickHandler}>Hello world!</Button>
            </div>
        )
    }
}