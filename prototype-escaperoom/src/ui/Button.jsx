import React from "../jsx-dom-shim"

const primaryButton = (text = 'Play') => {
    return(
        <button class="button is-primary is-medium">
            { text }
	    </button>
    )
}

const defaultButton = (text = 'Play') => {
    return (
        <button class="button is-medium">
            { text }
	    </button>
    )
}

export {
    defaultButton,
    primaryButton
}