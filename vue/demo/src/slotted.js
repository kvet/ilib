export const Slotted = {
    template: (
        `<div>
            <slot name="fullName">
                <slot name="firstName">d:firstName</slot>
                <slot name="lastName">d:lastName</slot>
            </slot>
        </div>`)
};

export const ScopedSlotted = {
    template: (
        `<div>
            <slot name="fullName" data="a:fullName">
                <slot name="firstName" data="a:firstName">d:firstName</slot>
                <slot name="lastName" data="a:lastName">d:lastName</slot>
            </slot>
        </div>`)
};