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

Ajustes ⚙️ → elige tu voz → Guardar. Pega o carga tu texto → **✨ Practicar Shadowing** o **⇄ Practicar Traducción**.

## Shadowing

Escucha (▶/⏸), repite (↻), navega con ⏮/⏭, desliza la tarjeta, o arrastra la barra de progreso. Toca una palabra para escucharla; mantenla presionada para traducirla y guardarla. ☆ marca la frase como difícil.

## Práctica de traducción (⇄)

Ves la frase en un idioma, intentas decirla en el otro, y tocas "Mostrar respuesta" — ambas quedan visibles a la vez. El botón **⇄ Invertir** cambia la dirección (Español→Inglés o Inglés→Español) en cualquier momento.

## Google Drive

Habilita **Google Drive API** en [Google Cloud Console](https://console.cloud.google.com/), crea una API key restringida a esa API, comparte tu carpeta como "Cualquiera con el enlace", y pega la API key + el ID de la carpeta en Ajustes.

## Traducción al español

Automática por defecto (MyMemory, gratis). Para mayor precisión, sube a Drive un doc con el mismo nombre + `(ES)` traducido por Gemini (misma cantidad de frases) — la app lo usa en vez de MyMemory.

## Mi vocabulario (🔖)

Palabras guardadas — escúchalas (▶) o quítalas (🗑).

## Tema

Ajustes → Claro / Oscuro / Sistema.

## Voz externa (opcional)

Ajustes → "API de voz externa" (pensado para ElevenLabs). Adapta `speakExternal` en `app.js` para otro proveedor.
