import React from 'react'

function TextArea({
    id,
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
            <textarea
                id={id}
                name={name}
                value={value}
                onFocus={onFocus}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
                className={`border-secondary-primary border p-2 focus:outline-none focus:border-bidder-primary ${className}`}
                required={required}
                rows={4}
            />
        </div>
    )
}

export default React.memo(TextArea)
