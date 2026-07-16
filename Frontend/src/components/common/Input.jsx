import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Input({ label, id, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordField = type === 'password'
  const resolvedType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : type

  return (
    <div className="input-group">
      {label && <label htmlFor={id}>{label}</label>}

      {isPasswordField ? (
        <div className="password-input-wrapper">
          <input id={id} type={resolvedType} {...props} />

          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      ) : (
        <input id={id} type={resolvedType} {...props} />
      )}
    </div>
  )
}

export default Input

