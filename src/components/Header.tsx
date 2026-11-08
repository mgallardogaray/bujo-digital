type Props = {
  title: string
  /** Ruta a la que vuelve la flecha. null = sin flecha (inicio). */
  back?: string | null
  /** (ya no se usa; se mantiene por compatibilidad) */
  tape?: string
}

export function Header({ title, back = '' }: Props) {
  return (
    <header className="top">
      {back !== null && (
        <a className="back" href={'#/' + back} aria-label="Volver">
          ‹
        </a>
      )}
      <h1 className="title">{title}</h1>
    </header>
  )
}
