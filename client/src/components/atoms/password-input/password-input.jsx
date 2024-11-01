import React from 'react'
import VisibilityIcon from '../../atoms/icons/visibility'
import VisibilityOffIcon from '../../atoms/icons/visibilityOff'

function PasswordInput({
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
    const [btnClass, setBtnClass] = React.useState('')
    const [isPasswordVisible, setPasswordVisible] = React.useState(false)

    const handleFocus = (event) => {
        setBtnClass('border-bidder-primary')
        if (onFocus) onFocus(event)
    }

    const handleBlur = (event) => {
        setBtnClass('')
    }

    const RenderPasswordVisibilityIcon = () => (
        <button
            type="button"
            onClick={() => setPasswordVisible((prev) => !prev)}
            className={`pr-2 border border-secondary-primary border-l-0 w-1/5 md:w-1/12 ${btnClass}
            flex items-center justify-end focus:outline-none
            `}
        >
            {isPasswordVisible ? (
                <VisibilityOffIcon fill={isPasswordVisible && '#ff4500'} />
            ) : (
                <VisibilityIcon />
            )}
        </button>
    )

    return (
        <div className={className}>
            {label && (
                <label className="text_input_label">
                    {label}
                    {required && <sup>*</sup>}
                </label>
            )}
            <div className="flex w-full justify-between">
                <input
                    id={id}
                    type={isPasswordVisible ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`border-secondary-primary w-10/12 md:w-11/12 border-r-0 border pl-2 h-[36px] focus:outline-none ${btnClass}`}
                    required={required}
                />
                <RenderPasswordVisibilityIcon />
            </div>
        </div>
    )
}

export default PasswordInput
