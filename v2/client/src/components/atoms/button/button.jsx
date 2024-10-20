import React from 'react'

function Button({
    text,
    onClick,
    disabled,
    isLoading, 
    className,
}) {
 

    return (
        <button
            type={type}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            className={className}
        >
            {text && <span>{text}</span>}
            {isLoading && <span>Loading...</span>}
        </button>
    );
}

export default React.memo(Button);
