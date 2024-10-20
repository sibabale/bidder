import React from 'react'

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
}) {
    return (
        <div className="flex flex-col">
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
                className="border-secondary-primary border px-2 h-[36px] focus:outline-none focus:border-bidder-primary"
                required={required}
            />
        </div>
    )
}

export default React.memo(TextInput)
