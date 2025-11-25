import React from 'react';
import styles from './PadElement.module.css';

export default function PadElement(props) {
    const [on, setOn] = React.useState(props.on);
    function handleClick() {
        setOn(prevOn => !prevOn);
    }
    return (
        <button 
        className={styles.toggleButton}
        style={{ backgroundColor: props.pads.color, opacity: on ? 1 : 0.1 }}
        onClick={handleClick}>
        </button>
    );
}