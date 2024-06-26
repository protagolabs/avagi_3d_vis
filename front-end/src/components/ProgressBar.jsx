// src/pages/HomePage.jsx
import React from 'react';
import './ProgressBar.css'

const ProgressBar = (props) => {

    let title = <text>{props.title}</text>
    let content = props.content.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
    ));
    const is_activated = props.is_activated ? 'activated' : 'deactivated';

    return (
        <div className='container'>
            <div className='row row-cols-1'>
                <div className={`col title ${is_activated}`}>{title}</div>
                <div className={`col explain ${is_activated}`}>{content}</div>
            </div>
        </div>
    );
}

export default ProgressBar;
