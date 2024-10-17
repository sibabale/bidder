import React, { ChangeEvent } from 'react';
import './index.scss';

interface TextInputProps {
    id?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'time';
    name?: string;
    value?: string;
    label?: string;
    onFocus?: () => void;
    disabled?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
    placeholder?: string;
}

function TextInput({
    id,
    type,
    name,
    label,
    value,
    onFocus,
    disabled = false,
    required = false,
    onChange,
    className,
    placeholder,
}: TextInputProps) {
    return (
        <div className="text_input_container">
            {label && (
                <label className="text_input_label">
                    {label}
                    {required && <sup>*</sup>}
                </label>
            )}
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onFocus={onFocus}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
                className={`text_input p-2 ${className}`}
                required={required}
            />
        </div>
    );
}

export default React.memo(TextInput);
