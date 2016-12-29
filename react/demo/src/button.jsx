import React from 'react';

export class MyButton extends React.Component {
    render() {
        let style = Object.assign({ 
            display: 'inline-block', 
            border: '1px solid red', 
            padding: '5px 10px'
        }, this.props.style);
        return (
            <div style={style}>{ this.props.children }</div>
        )
    }
}