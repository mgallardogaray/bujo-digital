# Plan: App de apoyo para TDAH

> Documento vivo. Lo iremos completando juntos a medida que me cuentes quÃ© quieres.
> Ãšltima actualizaciÃ³n: 2026-11-07

---

## 1. Objetivo
**Poder organizarme.** Las agendas tradicionales y los bullet journals no me funcionan: me cuesta mantenerlos, nunca los termino y no me gusta tener que dibujar o decorar. Quiero una app **minimalista pero aesthetic** que me dÃ© la parte bonita de una agenda sin el trabajo de armarla.

**Regla de oro: 100% gratis.** Nada de pagos, suscripciones ni cuentas de desarrollador pagadas.

## 2. Mis dificultades del dÃ­a a dÃ­a
- No logro mantener una agenda: empiezo y dejo de rellenarla.
- Los bullet journals nunca los termino, y dibujar/decorar me frena.
- Si tengo demasiados pendientes en un dÃ­a, no hago ninguno â†’ **mÃ¡ximo 3 a 5 pendientes diarios**.
- **Ceguera temporal:** digo "voy a baÃ±arme" y me doy mil vueltas; algo de 10 min termina tomando 1 hora o mÃ¡s.
- Organizar mi tiempo y no perder de vista las fechas lÃ­mite.

**Implicancias para la app:**
- Anotar cosas tiene que ser rapidÃ­simo (pocos campos, nada obligatorio salvo lo esencial).
- La app deberÃ­a "venir a mÃ­" (notificaciones) en vez de depender de que yo la abra.
- La parte visual la pone la app, no yo: cero esfuerzo para que se vea bonita.
- Hacer **visible el paso del tiempo** en las tareas del dÃ­a a dÃ­a.

## 3. Conceptos clave

| | **Rutinas (tareas diarias)** | **Pendientes** |
|---|---|---|
| QuÃ© son | Cosas del dÃ­a a dÃ­a, cortas y repetitivas | Cosas importantes con fecha lÃ­mite |
| Ejemplos | BaÃ±arme, skincare, cocinar, lavarme los dientes | Estudiar, hacer ejercicio, algo X del trabajo |
| Fecha lÃ­mite | No | **SÃ­** (fecha y opcionalmente hora) |
| Cuentan para el lÃ­mite de 3â€“5 | No | **SÃ­** |
| Herramienta principal | **Temporizador** con duraciÃ³n esperada | Colores segÃºn cercanÃ­a al lÃ­mite |
| Si no lo hago | Se repite igual maÃ±ana | **Pasa al dÃ­a siguiente** |

> Nota: "hacer ejercicio" o "estudiar" tambiÃ©n pueden ser **hÃ¡bitos**. Idea: al completar un pendiente vinculado a un hÃ¡bito, el hÃ¡bito se marca solo. _(por confirmar)_

## 4. MÃ³dulos / funcionalidades

La app se navega como un **inicio visual con tarjetas grandes**: aprieto una y entro a ese mÃ³dulo.

### 4.1 Calendario + DÃ­a
- Vista de **mes** con los dÃ­as; cada dÃ­a muestra un indicador de que tiene cosas.
- Al tocar un dÃ­a entro a su **vista diaria**: rutinas del dÃ­a, pendientes (mÃ¡x. 3â€“5) y nota rÃ¡pida.

### 4.2 Rutinas con temporizador
- Lista de rutinas guardadas con su duraciÃ³n esperada (ej. "Ducha â€“ 10 min", "Skincare â€“ 5 min").
- Las inicio con **un toque** â†’ temporizador visual (cÃ­rculo o barra que se va vaciando).
- Aviso cuando se acaba el tiempo (y quizÃ¡s uno a mitad de camino: "te quedan 5 min").
- Registro de cuÃ¡nto me tomÃ³ realmente, para ir viendo si mejoro (sin juzgar).
- Posibilidad de agrupar rutinas (ej. "Rutina de maÃ±ana": dientes â†’ ducha â†’ skincare).

### 4.3 Pendientes
- Cada pendiente tiene **fecha lÃ­mite** (y opcionalmente **hora lÃ­mite**).
- **LÃ­mite de 3â€“5 por dÃ­a.** Si intento agregar mÃ¡s, la app me avisa con cariÃ±o y me sugiere moverlo a otro dÃ­a.
- Si no lo marco como hecho, **pasa automÃ¡ticamente al dÃ­a siguiente**.
- **Colores segÃºn la cercanÃ­a al lÃ­mite** (tonos pastel):
  - ðŸŸ¢ Verde claro â†’ voy a tiempo.
  - ðŸŸ¡ Amarillo claro â†’ queda poco.
  - ðŸ”´ Rojo claro â†’ muy cerca del lÃ­mite (o vencido).
  - _(por definir: umbrales exactos)_

### 4.4 Tracker de hÃ¡bitos
- Creo mis propios hÃ¡bitos (ej. ejercicio, estudiar, leer) y los marco cada dÃ­a con un toque.
- Rachas / historial visual.
- **Resumen semanal**: una vez por semana veo cÃ³mo avancÃ© (en positivo, sin culpa).

### 4.5 Metas
- Crear una meta (ej. "Aprender X") y **dividirla en pasos pequeÃ±os repartidos en dÃ­as**.
- Los pasos aparecen en la vista diaria del dÃ­a que corresponda (Â¿cuentan como pendiente? _por definir_).
- Ver el progreso de cada meta.

### 4.6 Lo personal: libros, series y pelÃ­culas
- **Estante de libros** visual con portadas, puntuaciÃ³n (estrellas) y reseÃ±a corta.
- Series y pelÃ­culas (vistas / por ver) con puntuaciÃ³n.
- Portadas automÃ¡ticas con APIs gratuitas (ej. Open Library para libros). _(por confirmar)_

### 4.7 Notificaciones
- Avisos de pendientes que se acercan al lÃ­mite, recordatorio de rutinas y fin de temporizador.
- En iPhone, las notificaciones de una PWA funcionan **solo si la app estÃ¡ agregada a la pantalla de inicio** (iOS 16.4+; el iPhone 16 Pro cumple).
- ~~Widget~~ â†’ descartado (no es importante y no es posible gratis en iPhone).

### Prioridades

| MÃ³dulo | Prioridad | Fase |
|---|---|---|
| Inicio visual (navegaciÃ³n) | Alta | 1 |
| Calendario + vista diaria | Alta | 1 |
| Pendientes con lÃ­mite, colores y arrastre al dÃ­a siguiente | Alta | 1 |
| Rutinas con temporizador | Alta | 1 |
| SincronizaciÃ³n celular â†” tablet | Alta | 1 |
| Notificaciones | Media | 2 |
| Tracker de hÃ¡bitos + resumen semanal | Media | 2 |
| Metas divididas en dÃ­as | Media | 2 |
| Trackers de Ã¡nimo / sueÃ±o / estudio | Media | 2 |
| Mini journal (cosas buenas / pensamientos random) + sticker del dÃ­a | Media | 2 |
| Estante de libros / series / pelÃ­culas | Baja | 3 |

## 5. Plataforma y tecnologÃ­a (todo gratis)
- **Dispositivos:** iPhone 16 Pro (iOS) y Samsung Galaxy Tab S9 FE (Android).
- **Tipo de app:** âœ… **PWA** (app web instalable). Se instala desde el navegador en ambos dispositivos. Gratis.
- **CÃ³digo:** repositorio en **GitHub** (gratis).
- **Hosting:** **GitHub Pages** (gratis) â†’ la app vive en una direcciÃ³n tipo `https://<usuario>.github.io/<repo>/`.
- **SincronizaciÃ³n:** **Supabase** plan gratis (base de datos + inicio de sesiÃ³n). Ojo: el plan gratis pausa el proyecto tras ~1 semana sin uso; usÃ¡ndola a diario no deberÃ­a pasar.
- **Sin internet:** âœ… sÃ­, pero no es crÃ­tico (casi siempre tengo internet). La app abre y deja anotar sin conexiÃ³n, y sincroniza al volver.
- **Stack propuesto:** React + Vite + TypeScript, como PWA. _(a confirmar al empezar a programar)_

### Pendiente tÃ©cnico en mi PC
- [x] Instalar **Git** (2.56).
- [x] Instalar **GitHub CLI** (`gh` 2.103).
- [x] Instalar **Node.js** (v26 LTS).
- [x] Iniciar sesiÃ³n en GitHub con `gh` (usuario: **mgallardogaray**).
- [x] Repositorio creado: https://github.com/mgallardogaray/bujo-digital
- [ ] Crear cuenta gratis en Supabase (para sincronizar celular â†” tablet).

## 6. DiseÃ±o y experiencia
- **Estilo:** minimalista + aesthetic. La app se ve bonita sola, sin que yo decore nada.
- Referencias (Pinterest): https://cl.pinterest.com/pin/322711129563002043/ Â· https://cl.pinterest.com/pin/470555861090527834/ Â· y 9 imÃ¡genes en `C:\users\mgall\app\imagenes\` (solo en mi PC, no se suben a GitHub).

### Lo que tienen en comÃºn mis referencias â†’ "bullet journal digital"
Estilo agenda japonesa (tipo Hobonichi) / journal, pero **hecho automÃ¡ticamente por la app**:
- **Fondo crema/papel** con **cuadrÃ­cula o puntos** suaves.
- **TÃ­tulos con "cinta washi" o subrayado de destacador** detrÃ¡s (barras de color pastel).
- **Paleta pastel tipo destacador:** amarillo mantequilla, verde salvia, lavanda, menta, durazno/rosado, celeste.
- **TipografÃ­a mixta:** tÃ­tulos en letra "a mano" redondeada + texto limpio y legible.
- **Stickers lindos** (frutas, animalitos, cafÃ©s, estrellitas, solcitos) â†’ la app ofrece stickers digitales para decorar dÃ­as con un toque (sin dibujar nada).
- **Calendario mensual en cuadrÃ­cula** donde cada dÃ­a puede tener un sticker o color.
- **Trackers visuales:** cuadrÃ­cula de hÃ¡bitos con âœ“, grÃ¡ficos de lÃ­nea con puntos de colores (Ã¡nimo, sueÃ±o), barras horizontales pastel (horas de estudio, pasos).
- **Estante de libros** con lomos de colores y portadas; **pÃ¡gina de reseÃ±a** con portada, estrellas, fecha de tÃ©rmino y notas.

### Ideas nuevas sacadas de las referencias âœ… (aprobadas)
- Tracker de **Ã¡nimo** y de **sueÃ±o** (grÃ¡fico de lÃ­nea con puntos pastel).
- Tracker de **horas de estudio** (barras horizontales por dÃ­a).
- **Mini journal** en el dÃ­a: **"cosas buenas que pasaron"** y **"pensamientos random"**.
- Elegir un **sticker** para representar cada dÃ­a en el calendario.

- Los colores de los pendientes (verde/amarillo/rojo claro) usan la misma paleta pastel.
- Pantalla de inicio con tarjetas grandes y claras; pocas opciones por pantalla; acciones en 1â€“2 toques.
- Mensajes amables, nunca de culpa (ej. "Lo movimos a maÃ±ana ðŸ’›" en vez de "Tarea vencida").

## 7. InspiraciÃ³n en GitHub (proyectos open source para mirar ideas)
- [Duqit/adhd.lk](https://github.com/Duqit/adhd.lk): herramientas TDAH gratis: temporizador de foco, planificador diario, rutinas, hÃ¡bitos (PWA).
- [Stayuptildawn/routine-tracker](https://github.com/Stayuptildawn/routine-tracker): tracker de rutinas pensado para TDAH, React + Supabase, PWA con sincronizaciÃ³n entre dispositivos.
- [SwayamMandhani06/Habit-Tracker](https://github.com/SwayamMandhani06/Habit-Tracker): tracker de hÃ¡bitos minimalista, Next.js + Supabase, PWA.
- [Jinjinov/OpenHabitTracker](https://github.com/Jinjinov/OpenHabitTracker): tareas con fecha/hora, duraciÃ³n, checklist y temporizador.
- [Topic adhd-tools](https://github.com/topics/adhd-tools): mÃ¡s proyectos.

> Usamos estos proyectos solo como inspiraciÃ³n de ideas; el cÃ³digo y diseÃ±o de nuestra app serÃ¡n propios.

## 8. Fases
- **Fase 1 â€“ MVP:** inicio visual, calendario, vista diaria, pendientes (lÃ­mite 3â€“5, colores, arrastre automÃ¡tico), rutinas con temporizador, sincronizaciÃ³n.
- **Fase 2:** notificaciones, hÃ¡bitos + resumen semanal, metas, trackers de Ã¡nimo/sueÃ±o/estudio, mini journal y sticker del dÃ­a.
- **Fase 3:** estante de libros/series/pelÃ­culas, extras.

## 8b. Avance de la Fase 1 (2026-11-07)
- [x] Inicio visual con tarjetas (Hoy, Calendario, Rutinas; HÃ¡bitos/Metas/Estante marcados "pronto")
- [x] Calendario mensual con puntitos de color por dÃ­a
- [x] Vista del dÃ­a: pendientes (mÃ¡x. 5), fecha y hora lÃ­mite, colores, pasar a maÃ±ana, nota del dÃ­a
- [x] Pendientes no hechos pasan solos al dÃ­a siguiente
- [x] Rutinas con temporizador (guarda cuÃ¡nto tardÃ© de verdad, avisa a la mitad y al final)
- [x] Instalable como app (PWA) con Ã­cono
- [x] Guarda los datos en el propio dispositivo
- [ ] Publicar en GitHub Pages para instalarla en iPhone y tablet
- [ ] SincronizaciÃ³n celular â†” tablet (Supabase)
- Umbrales de color actuales: rojo â‰¤ 24 h (o vencido), amarillo â‰¤ 72 h, verde mÃ¡s de 72 h.

## 9. Preguntas abiertas
- [x] ~~Â¿PWA o nativa?~~ â†’ PWA, todo gratis.
- [x] ~~Â¿Diferencia tarea vs pendiente?~~ â†’ Rutinas (con temporizador) vs Pendientes (con fecha lÃ­mite).
- [x] ~~Â¿Debe funcionar sin internet?~~ â†’ SÃ­, como extra (no crÃ­tico).
- [x] ~~Â¿Trackers de Ã¡nimo / sueÃ±o / estudio y mini journal?~~ â†’ SÃ­, me gustan (Fase 2â€“3).
- [ ] Umbrales de los colores (Â¿cuÃ¡ndo pasa de verde a amarillo y de amarillo a rojo?).
- [ ] Â¿Los pasos de las metas cuentan para el lÃ­mite diario?
- [ ] Â¿Vincular pendientes con hÃ¡bitos (ej. completar "estudiar" marca el hÃ¡bito)?
- [ ] Nombre de la app.

## 10. Notas y decisiones
- 2026-11-07: Se crea el plan.
- 2026-11-07: Objetivo: organizarme sin depender de rellenar una agenda. Dispositivos: iPhone 16 Pro + Galaxy Tab S9 FE.
- 2026-11-07: MÃ³dulos definidos. MÃ¡x. 3â€“5 pendientes diarios. Estilo minimalista aesthetic.
- 2026-11-07: **Todo gratis.** PWA + GitHub Pages + Supabase. Widget descartado. Rutinas (temporizador) â‰  Pendientes (fecha lÃ­mite). Proyecto irÃ¡ en GitHub.
- 2026-11-07: Estilo definido: "bullet journal digital" (papel crema, washi tape, pastel, stickers). Offline: sÃ­, como extra. Instalados Git, GitHub CLI y Node.js.
- 2026-11-07: Aprobados trackers de Ã¡nimo/sueÃ±o/estudio, mini journal y sticker del dÃ­a.
