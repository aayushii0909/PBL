export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
