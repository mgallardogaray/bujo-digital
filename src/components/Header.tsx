type Props = {
  title: string
  /** Ruta a la que vuelve la flecha. null = sin flecha (inicio). */
  back?: string | null
  tape?: 'butter' | 'sage' | 'lav' | 'mint' | 'peach' | 'sky'
}

export function Header({ title, back = '', tape = 'butter' }: Props) {
  return (
    <header className="top">
      {back !== null && (
        <a className="back" href={'#/' + back} aria-label="Volver">
          ‹
        </a>
      )}
      <h1 className={`washi tape-${tape}`}>{title}</h1>
    </header>
  )
}
