# Plan: App de apoyo para TDAH

> Documento vivo. Lo iremos completando juntos a medida que me cuentes qué quieres.
> Última actualización: 2026-11-07

---

## 1. Objetivo
**Poder organizarme.** Las agendas tradicionales y los bullet journals no me funcionan: me cuesta mantenerlos, nunca los termino y no me gusta tener que dibujar o decorar. Quiero una app **minimalista pero aesthetic** que me dé la parte bonita de una agenda sin el trabajo de armarla.

**Regla de oro: 100% gratis.** Nada de pagos, suscripciones ni cuentas de desarrollador pagadas.

## 2. Mis dificultades del día a día
- No logro mantener una agenda: empiezo y dejo de rellenarla.
- Los bullet journals nunca los termino, y dibujar/decorar me frena.
- Si tengo demasiados pendientes en un día, no hago ninguno → **máximo 3 a 5 pendientes diarios**.
- **Ceguera temporal:** digo "voy a bañarme" y me doy mil vueltas; algo de 10 min termina tomando 1 hora o más.
- Organizar mi tiempo y no perder de vista las fechas límite.

**Implicancias para la app:**
- Anotar cosas tiene que ser rapidísimo (pocos campos, nada obligatorio salvo lo esencial).
- La app debería "venir a mí" (notificaciones) en vez de depender de que yo la abra.
- La parte visual la pone la app, no yo: cero esfuerzo para que se vea bonita.
- Hacer **visible el paso del tiempo** en las tareas del día a día.

## 3. Conceptos clave

| | **Rutinas (tareas diarias)** | **Pendientes** |
|---|---|---|
| Qué son | Cosas del día a día, cortas y repetitivas | Cosas importantes con fecha límite |
| Ejemplos | Bañarme, skincare, cocinar, lavarme los dientes | Estudiar, hacer ejercicio, algo X del trabajo |
| Fecha límite | No | **Sí** (fecha y opcionalmente hora) |
| Cuentan para el límite de 3–5 | No | **Sí** |
| Herramienta principal | **Temporizador** con duración esperada | Colores según cercanía al límite |
| Si no lo hago | Se repite igual mañana | **Pasa al día siguiente** |

> Nota: "hacer ejercicio" o "estudiar" también pueden ser **hábitos**. Idea: al completar un pendiente vinculado a un hábito, el hábito se marca solo. _(por confirmar)_

## 4. Módulos / funcionalidades

La app se navega como un **inicio visual con tarjetas grandes**: aprieto una y entro a ese módulo.

### 4.1 Calendario + Día
- Vista de **mes** con los días; cada día muestra un indicador de que tiene cosas.
- Al tocar un día entro a su **vista diaria**: rutinas del día, pendientes (máx. 3–5) y nota rápida.

### 4.2 Rutinas con temporizador
- Lista de rutinas guardadas con su duración esperada (ej. "Ducha – 10 min", "Skincare – 5 min").
- Las inicio con **un toque** → temporizador visual (círculo o barra que se va vaciando).
- Aviso cuando se acaba el tiempo (y quizás uno a mitad de camino: "te quedan 5 min").
- Registro de cuánto me tomó realmente, para ir viendo si mejoro (sin juzgar).
- Posibilidad de agrupar rutinas (ej. "Rutina de mañana": dientes → ducha → skincare).

### 4.3 Pendientes
- Cada pendiente tiene **fecha límite** (y opcionalmente **hora límite**).
- **Límite de 3–5 por día.** Si intento agregar más, la app me avisa con cariño y me sugiere moverlo a otro día.
- Si no lo marco como hecho, **pasa automáticamente al día siguiente**.
- **Colores según la cercanía al límite** (tonos pastel):
  - 🟢 Verde claro → voy a tiempo.
  - 🟡 Amarillo claro → queda poco.
  - 🔴 Rojo claro → muy cerca del límite (o vencido).
  - _(por definir: umbrales exactos)_

### 4.4 Tracker de hábitos
- Creo mis propios hábitos (ej. ejercicio, estudiar, leer) y los marco cada día con un toque.
- Rachas / historial visual.
- **Resumen semanal**: una vez por semana veo cómo avancé (en positivo, sin culpa).

### 4.5 Metas
- Crear una meta (ej. "Aprender X") y **dividirla en pasos pequeños repartidos en días**.
- Los pasos aparecen en la vista diaria del día que corresponda (¿cuentan como pendiente? _por definir_).
- Ver el progreso de cada meta.

### 4.6 Lo personal: libros, series y películas
- **Estante de libros** visual con portadas, puntuación (estrellas) y reseña corta.
- Series y películas (vistas / por ver) con puntuación.
- Portadas automáticas con APIs gratuitas (ej. Open Library para libros). _(por confirmar)_

### 4.7 Notificaciones
- Avisos de pendientes que se acercan al límite, recordatorio de rutinas y fin de temporizador.
- En iPhone, las notificaciones de una PWA funcionan **solo si la app está agregada a la pantalla de inicio** (iOS 16.4+; el iPhone 16 Pro cumple).
- ~~Widget~~ → descartado (no es importante y no es posible gratis en iPhone).

### Prioridades

| Módulo | Prioridad | Fase |
|---|---|---|
| Inicio visual (navegación) | Alta | 1 |
| Calendario + vista diaria | Alta | 1 |
| Pendientes con límite, colores y arrastre al día siguiente | Alta | 1 |
| Rutinas con temporizador | Alta | 1 |
| Sincronización celular ↔ tablet | Alta | 1 |
| Notificaciones | Media | 2 |
| Tracker de hábitos + resumen semanal | Media | 2 |
| Metas divididas en días | Media | 2 |
| Trackers de ánimo / sueño / estudio | Media | 2 |
| Mini journal (cosas buenas / pensamientos random) + sticker del día | Media | 2 |
| Estante de libros / series / películas | Baja | 3 |

## 5. Plataforma y tecnología (todo gratis)
- **Dispositivos:** iPhone 16 Pro (iOS) y Samsung Galaxy Tab S9 FE (Android).
- **Tipo de app:** ✅ **PWA** (app web instalable). Se instala desde el navegador en ambos dispositivos. Gratis.
- **Código:** repositorio en **GitHub** (gratis).
- **Hosting:** **GitHub Pages** (gratis) → la app vive en una dirección tipo `https://<usuario>.github.io/<repo>/`.
- **Sincronización:** **Supabase** plan gratis (base de datos + inicio de sesión). Ojo: el plan gratis pausa el proyecto tras ~1 semana sin uso; usándola a diario no debería pasar.
- **Sin internet:** ✅ sí, pero no es crítico (casi siempre tengo internet). La app abre y deja anotar sin conexión, y sincroniza al volver.
- **Stack propuesto:** React + Vite + TypeScript, como PWA. _(a confirmar al empezar a programar)_

### Pendiente técnico en mi PC
- [x] Instalar **Git** (2.56).
- [x] Instalar **GitHub CLI** (`gh` 2.103).
- [x] Instalar **Node.js** (v26 LTS).
- [x] Iniciar sesión en GitHub con `gh` (usuario: **mgallardogaray**).
- [x] Repositorio creado: https://github.com/mgallardogaray/bujo-digital
- [ ] Crear cuenta gratis en Supabase (para sincronizar celular ↔ tablet).

## 6. Diseño y experiencia
- **Estilo:** minimalista + aesthetic. La app se ve bonita sola, sin que yo decore nada.
- Referencias (Pinterest): https://cl.pinterest.com/pin/322711129563002043/ · https://cl.pinterest.com/pin/470555861090527834/ · y 9 imágenes en `C:\users\mgall\app\imagenes\` (solo en mi PC, no se suben a GitHub).

### Lo que tienen en común mis referencias → "bullet journal digital"
Estilo agenda japonesa (tipo Hobonichi) / journal, pero **hecho automáticamente por la app**:
- **Fondo crema/papel** con **cuadrícula o puntos** suaves.
- **Títulos con "cinta washi" o subrayado de destacador** detrás (barras de color pastel).
- **Paleta pastel tipo destacador:** amarillo mantequilla, verde salvia, lavanda, menta, durazno/rosado, celeste.
- **Tipografía mixta:** títulos en letra "a mano" redondeada + texto limpio y legible.
- **Stickers lindos** (frutas, animalitos, cafés, estrellitas, solcitos) → la app ofrece stickers digitales para decorar días con un toque (sin dibujar nada).
- **Calendario mensual en cuadrícula** donde cada día puede tener un sticker o color.
- **Trackers visuales:** cuadrícula de hábitos con ✓, gráficos de línea con puntos de colores (ánimo, sueño), barras horizontales pastel (horas de estudio, pasos).
- **Estante de libros** con lomos de colores y portadas; **página de reseña** con portada, estrellas, fecha de término y notas.

### Ideas nuevas sacadas de las referencias ✅ (aprobadas)
- Tracker de **ánimo** y de **sueño** (gráfico de línea con puntos pastel).
- Tracker de **horas de estudio** (barras horizontales por día).
- **Mini journal** en el día: **"cosas buenas que pasaron"** y **"pensamientos random"**.
- Elegir un **sticker** para representar cada día en el calendario.

- Los colores de los pendientes (verde/amarillo/rojo claro) usan la misma paleta pastel.
- Pantalla de inicio con tarjetas grandes y claras; pocas opciones por pantalla; acciones en 1–2 toques.
- Mensajes amables, nunca de culpa (ej. "Lo movimos a mañana 💛" en vez de "Tarea vencida").

## 7. Inspiración en GitHub (proyectos open source para mirar ideas)
- [Duqit/adhd.lk](https://github.com/Duqit/adhd.lk): herramientas TDAH gratis: temporizador de foco, planificador diario, rutinas, hábitos (PWA).
- [Stayuptildawn/routine-tracker](https://github.com/Stayuptildawn/routine-tracker): tracker de rutinas pensado para TDAH, React + Supabase, PWA con sincronización entre dispositivos.
- [SwayamMandhani06/Habit-Tracker](https://github.com/SwayamMandhani06/Habit-Tracker): tracker de hábitos minimalista, Next.js + Supabase, PWA.
- [Jinjinov/OpenHabitTracker](https://github.com/Jinjinov/OpenHabitTracker): tareas con fecha/hora, duración, checklist y temporizador.
- [Topic adhd-tools](https://github.com/topics/adhd-tools): más proyectos.

> Usamos estos proyectos solo como inspiración de ideas; el código y diseño de nuestra app serán propios.

## 8. Fases
- **Fase 1 – MVP:** inicio visual, calendario, vista diaria, pendientes (límite 3–5, colores, arrastre automático), rutinas con temporizador, sincronización.
- **Fase 2:** notificaciones, hábitos + resumen semanal, metas, trackers de ánimo/sueño/estudio, mini journal y sticker del día.
- **Fase 3:** estante de libros/series/películas, extras.

## 8b. Avance de la Fase 1 (2026-11-07)
- [x] Inicio visual con tarjetas (Hoy, Calendario, Rutinas; Hábitos/Metas/Estante marcados "pronto")
- [x] Calendario mensual con puntitos de color por día
- [x] Vista del día: pendientes (máx. 5), fecha y hora límite, colores, pasar a mañana, nota del día
- [x] Pendientes no hechos pasan solos al día siguiente
- [x] Rutinas con temporizador (guarda cuánto tardé de verdad, avisa a la mitad y al final)
- [x] Instalable como app (PWA) con ícono
- [x] Guarda los datos en el propio dispositivo
- [ ] Publicar en GitHub Pages para instalarla en iPhone y tablet
- [ ] Sincronización celular ↔ tablet (Supabase)
- Umbrales de color actuales: rojo ≤ 24 h (o vencido), amarillo ≤ 72 h, verde más de 72 h.

## 9. Preguntas abiertas
- [x] ~~¿PWA o nativa?~~ → PWA, todo gratis.
- [x] ~~¿Diferencia tarea vs pendiente?~~ → Rutinas (con temporizador) vs Pendientes (con fecha límite).
- [x] ~~¿Debe funcionar sin internet?~~ → Sí, como extra (no crítico).
- [x] ~~¿Trackers de ánimo / sueño / estudio y mini journal?~~ → Sí, me gustan (Fase 2–3).
- [ ] Umbrales de los colores (¿cuándo pasa de verde a amarillo y de amarillo a rojo?).
- [ ] ¿Los pasos de las metas cuentan para el límite diario?
- [ ] ¿Vincular pendientes con hábitos (ej. completar "estudiar" marca el hábito)?
- [ ] Nombre de la app.

## 10. Notas y decisiones
- 2026-11-07: Se crea el plan.
- 2026-11-07: Objetivo: organizarme sin depender de rellenar una agenda. Dispositivos: iPhone 16 Pro + Galaxy Tab S9 FE.
- 2026-11-07: Módulos definidos. Máx. 3–5 pendientes diarios. Estilo minimalista aesthetic.
- 2026-11-07: **Todo gratis.** PWA + GitHub Pages + Supabase. Widget descartado. Rutinas (temporizador) ≠ Pendientes (fecha límite). Proyecto irá en GitHub.
- 2026-11-07: Estilo definido: "bullet journal digital" (papel crema, washi tape, pastel, stickers). Offline: sí, como extra. Instalados Git, GitHub CLI y Node.js.
- 2026-11-07: Aprobados trackers de ánimo/sueño/estudio, mini journal y sticker del día.
