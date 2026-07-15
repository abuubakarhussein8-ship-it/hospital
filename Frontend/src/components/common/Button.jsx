const Button = ({ children, variant = 'primary', type = 'button', ...props }) => {
  const classes = `btn btn-${variant}`

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
