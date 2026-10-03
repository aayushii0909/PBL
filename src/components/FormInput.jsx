export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  as = 'input',
  options = [],
  rows = 3,
  accept,
  className = '',
  ...rest
}) {
  const id = `field-${name}`;

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      {as === 'select' ? (
        <select id={id} name={name} value={value} onChange={onChange} required={required} {...rest}>
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={type === 'file' ? undefined : value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          accept={accept}
          {...rest}
        />
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
