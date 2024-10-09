import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const hideWhenVisible = { display: isVisible ? 'none' : '' }
    const showWhenVisible = { display: isVisible ? '' : 'none' }

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    )
})

export default Togglable