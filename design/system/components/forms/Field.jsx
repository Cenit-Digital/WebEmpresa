import React from 'react'

/**
 * Campo de formulario de Cénit Digital: etiqueta + control (input/textarea/select).
 * Marca el asterisco de obligatorio en color primary. Colores desde tokens.
 */
export function Field({ label, as = 'input', type = 'text', required = false, placeholder, options = [], style, ...rest }) {
  const control = {
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    color: 'var(--color-text)',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '11px',
    padding: '13px 14px',
    outline: 'none',
  }
  return (
    <label style={{ display: 'block', ...style }}>
      {label && (
        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '7px' }}>
          {label}
          {required && <span style={{ color: 'var(--color-primary)' }}> *</span>}
        </span>
      )}
      {as === 'textarea' ? (
        <textarea placeholder={placeholder} required={required} style={{ ...control, minHeight: '120px', resize: 'vertical' }} {...rest} />
      ) : as === 'select' ? (
        <select required={required} style={{ ...control, cursor: 'pointer', color: 'var(--color-text-soft)' }} {...rest}>
          {options.map((o, i) => (
            <option key={i}>{o}</option>
          ))}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} required={required} style={control} {...rest} />
      )}
    </label>
  )
}
