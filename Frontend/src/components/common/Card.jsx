const Card = ({ title, subtitle, children, className = '' }) => (
  <section className={`card ${className}`.trim()}>
    {(title || subtitle) && (
      <div className="card-header">
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    )}
    <div className="card-body">{children}</div>
  </section>
)

export default Card
