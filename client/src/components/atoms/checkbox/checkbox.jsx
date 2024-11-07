import React from 'react'

function CheckBox({
    id,
    name,
    label,
    onFocus,
    checked,
    disabled = false,
    required = false,
    onChange,
    className,
}) {
    return (
        <div className="flex flex-col items-start">
            {label && (
                <label className="text_input_label">
                    {label}
                    {required && <sup>*</sup>}
                </label>
            )}
            <input
                id={id}
                type="checkbox"
                name={name}
                checked={checked}
                onFocus={onFocus}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className={`focus:outline-none accent-bidder-primary ${className}`}
                required={required}
            />
        </div>
    )
}

export default React.memo(CheckBox)
