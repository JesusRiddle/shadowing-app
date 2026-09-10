# Shadowing English

App para practicar pronunciación en inglés por shadowing y traducción, con vocabulario personal.

## Archivos

`index.html` · `styles.css` · `app.js` · `manifest.json` · `service-worker.js` · `icons/`

## Hospedar (gratis, GitHub Pages)

Sube todos los archivos y carpetas a un repo → **Settings → Pages** → rama `main`, carpeta `/root`.

## Instalar como app (PWA)

Chrome → menú → "Instalar app" / "Agregar a pantalla de inicio".

## Uso sin conexión

Los textos ya cargados y el "shell" de la app funcionan sin internet. En Ajustes, cada voz está etiquetada 🟢 *sin conexión* o 🟡 *requiere internet* — elige una 🟢 para practicar sin señal. En Android, para tener más voces 🟢: Ajustes del sistema → Accesibilidad → Salida de texto a voz → motor Google → "Instalar datos de voz".

## Primer uso

Ajustes ⚙️ → elige tu voz (se reproduce una muestra al seleccionarla) → Guardar. Pega o carga tu texto → **✨ Practicar Shadowing** o **⇄ Practicar Traducción**.

## Shadowing

- **▶/⏸** reproduce o detiene, **↻** repite, **⏮/⏭** o deslizar la tarjeta cambia de frase, o arrastra la barra de progreso.
- **Toca una palabra**: se detiene el audio de la tarjeta, se abre su ventana emergente y empieza a sonar la pronunciación de inmediato. Incluye traducción, pronunciación en alfabeto fonético (IPA, si está disponible), botón ▶/⏸ (con sus propios presets de velocidad) y opción de guardarla en tu vocabulario.
- **☆** marca la frase como difícil.
- **🔊/🔇** debajo del número de la tarjeta actual silencia las tarjetas (útil si vas saltando de frase en frase sin querer escuchar cada una). El play del popup de palabra siempre suena, aunque estés en silencio — ahí la intención es justo estudiar la pronunciación.
- Velocidad: 0.4x a 1x (sin opciones más rápidas), en botones fijos — no hay slider.

## Práctica de traducción (⇄)

Ves la frase en un idioma, intentas decirla en el otro, y tocas "Mostrar respuesta" — ambas quedan visibles a la vez. El botón **⇄ Invertir** cambia la dirección (Español→Inglés o Inglés→Español) en cualquier momento.

## Google Drive

Habilita **Google Drive API** en [Google Cloud Console](https://console.cloud.google.com/), crea una API key restringida a esa API, comparte tu carpeta como "Cualquiera con el enlace", y pega la API key + el ID de la carpeta en Ajustes.

## Traducción al español

Dos fuentes, activables por separado en Ajustes:

- **📄 Archivo gemelo (ES) en Drive** — prioridad. Sube a la misma carpeta un doc con el mismo nombre + `(ES)`, traducido por Gemini, respetando la misma puntuación (comas, puntos, signos de interrogación) del original para que ambos textos se dividan en frases exactamente igual.
- **🌐 MyMemory** — automática, gratis, respaldo.

Con ambas activas: primero intenta el archivo (ES); si no hay nada en esa frase, usa MyMemory. Con solo (ES) activo: nunca cae a MyMemory — si el archivo no existe o está desfasado, muestra igual lo que haya en esa posición (para detectar el desfase). Junto a la traducción aparece un ícono discreto y fijo a la izquierda (Drive o 🌐) según de dónde salió.

En Ajustes también puedes **purgar la caché de textos** o **vaciar Mi vocabulario**, por separado.

## Mi vocabulario (🔖)

Palabras guardadas — escúchalas (▶) o quítalas (🗑).

## Tema

Ajustes → Claro / Oscuro / Sistema.

## Voz externa (opcional)

Ajustes → "API de voz externa" (pensado para ElevenLabs). Adapta `speakExternal` en `app.js` para otro proveedor.
