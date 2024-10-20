import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

interface ButtonProps {
    text: string;
    type?: 'button' | 'submit';
    isLink?: boolean;
    variant?: 'primary' | 'secondary' | 'outlined';
    onClick?: () => void;
    disabled?: boolean;
    linkRoute?: string;
    className?: string;
}

function Button({
    text,
    type = 'button',
    isLink = false,
    variant = 'primary',
    onClick,
    disabled = false,
    className = '',
    linkRoute = '/',
}: ButtonProps) {
    const buttonClass = `
    ${className} 
    ${variant === 'primary' ? 'btn_primary' : 'btn_secondary'}
    ${disabled ? 'btn_disabled' : ''}
  `.trim();

    if (isLink) {
        return (
            <Link to={linkRoute} onClick={onClick} className={`${buttonClass} link_button`}>
                <span>{text}</span>
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            className={buttonClass}
        >
            <span>{text}</span>
        </button>
    );
}

export default React.memo(Button);
