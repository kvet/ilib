import React from 'react';

export class Slotted extends React.Component {
    constructor(props) {
        super(props); 
    }

    render() {
        this.getSlotContent = (name, initial) => {
            if(this.props[name]) return this.props[name];
            return initial;
        };

        return (
            <div>
                {this.getSlotContent('fullNameSlot', (
                    <span>{[
                        this.getSlotContent('firstNameSlot', <span>d:firstName</span>),
                        ' ',
                        this.getSlotContent('lastNameSlot', <span>d:lastName</span>)
                    ]}</span>
                ))}
            </div>
        )
    }
}