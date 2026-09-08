/* ============================================================
   Shadowing English — lógica principal
   ============================================================ */

const els = {
  reverseBtn: document.getElementById('reverseBtn'),
  vocabBtn: document.getElementById('vocabBtn'),
  settingsBtn: document.getElementById('settingsBtn'),

  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),

  ttsModeRadios: document.querySelectorAll('input[name="ttsMode"]'),
  browserVoiceOptions: document.getElementById('browserVoiceOptions'),
  externalVoiceOptions: document.getElementById('externalVoiceOptions'),
  voiceSelect: document.getElementById('voiceSelect'),
  externalEndpoint: document.getElementById('externalEndpoint'),
  externalApiKey: document.getElementById('externalApiKey'),
  rateRange: document.getElementById('rateRange'),
  rateValue: document.getElementById('rateValue'),

  themeModeRadios: document.querySelectorAll('input[name="themeMode"]'),

  translateSourceDoc: document.getElementById('translateSourceDoc'),
  translateSourceMyMemory: document.getElementById('translateSourceMyMemory'),
  translateApiKey: document.getElementById('translateApiKey'),

  purgeLibraryBtn: document.getElementById('purgeLibraryBtn'),
  purgeVocabBtn: document.getElementById('purgeVocabBtn'),

  driveApiKey: document.getElementById('driveApiKey'),
  driveFolderId: document.getElementById('driveFolderId'),

  saveSettingsBtn: document.getElementById('saveSettingsBtn'),

  loadView: document.getElementById('loadView'),
  practiceView: document.getElementById('practiceView'),
  reverseView: document.getElementById('reverseView'),
  vocabView: document.getElementById('vocabView'),

  loadDriveBtn: document.getElementById('loadDriveBtn'),
  driveFileList: document.getElementById('driveFileList'),
  textInput: document.getElementById('textInput'),
  wordCountLabel: document.getElementById('wordCountLabel'),
  loadedTitleLabel: document.getElementById('loadedTitleLabel'),
  startShadowBtn: document.getElementById('startShadowBtn'),
  startTranslateBtn: document.getElementById('startTranslateBtn'),
  resumeBtn: document.getElementById('resumeBtn'),
  recentList: document.getElementById('recentList'),

  progressLabel: document.getElementById('progressLabel'),
  progressSlider: document.getElementById('progressSlider'),
  progressPercent: document.getElementById('progressPercent'),
  backToTextBtn: document.getElementById('backToTextBtn'),
  sentenceCard: document.getElementById('sentenceCard'),
  indexBadge: document.getElementById('indexBadge'),
  starBtn: document.getElementById('starBtn'),
  sentenceDisplay: document.getElementById('sentenceDisplay'),
  translationRow: document.getElementById('translationRow'),
  translationSourceIcon: document.getElementById('translationSourceIcon'),
  translationDisplay: document.getElementById('translationDisplay'),
  speedPresets: document.getElementById('speedPresets'),
  cardRateRange: document.getElementById('cardRateRange'),
  prevBtn: document.getElementById('prevBtn'),
  playBtn: document.getElementById('playBtn'),
  repeatBtn: document.getElementById('repeatBtn'),
  nextBtn: document.getElementById('nextBtn'),

  reverseSwapBtn: document.getElementById('reverseSwapBtn'),
  reverseDirectionLabel: document.getElementById('reverseDirectionLabel'),
  reverseProgressLabel: document.getElementById('reverseProgressLabel'),
  reverseProgressSlider: document.getElementById('reverseProgressSlider'),
  backFromReverseBtn: document.getElementById('backFromReverseBtn'),
  promptLangTag: document.getElementById('promptLangTag'),
  reversePromptText: document.getElementById('reversePromptText'),
  reverseAnswerBlock: document.getElementById('reverseAnswerBlock'),
  answerLangTag: document.getElementById('answerLangTag'),
  reverseAnswerText: document.getElementById('reverseAnswerText'),
  reverseShowBtn: document.getElementById('reverseShowBtn'),
  reversePrevBtn: document.getElementById('reversePrevBtn'),
  reverseNextBtn: document.getElementById('reverseNextBtn'),
  reversePlayBtn: document.getElementById('reversePlayBtn'),

  backFromVocabBtn: document.getElementById('backFromVocabBtn'),
  vocabList: document.getElementById('vocabList'),

  wordPopupOverlay: document.getElementById('wordPopupOverlay'),
  wordPopupWord: document.getElementById('wordPopupWord'),
  wordPopupTranslation: document.getElementById('wordPopupTranslation'),
  wordPopupAddBtn: document.getElementById('wordPopupAddBtn'),
  wordPopupCloseBtn: document.getElementById('wordPopupCloseBtn'),
};

/* ============================================================
   Configuración persistente (localStorage)
   ============================================================ */

const Settings = {
  KEY: 'shadowing_settings_v1',
  data: {
    ttsMode: 'browser',
    voiceName: null,
    externalEndpoint: '',
    externalApiKey: '',
    rate: 1,
    driveApiKey: '',
    driveFolderId: '',
    translateSourceDoc: true,
    translateSourceMyMemory: true,
    translateApiKey: '',
    theme: 'system',
  },
  load() {
    const raw = localStorage.getItem(this.KEY);
    if (raw) {
      try { this.data = { ...this.data, ...JSON.parse(raw) }; } catch (e) {}
    }
  },
  save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.data));
  },
};
Settings.load();

function applySettingsToUI() {
  document.querySelector(`input[name="ttsMode"][value="${Settings.data.ttsMode}"]`).checked = true;
  toggleTtsModeUI(Settings.data.ttsMode);
  els.externalEndpoint.value = Settings.data.externalEndpoint || '';
  els.externalApiKey.value = Settings.data.externalApiKey || '';
  els.rateRange.value = Settings.data.rate;
  els.rateValue.textContent = `${Settings.data.rate}x`;
  els.driveApiKey.value = Settings.data.driveApiKey || '';
  els.driveFolderId.value = Settings.data.driveFolderId || '';
  els.translateSourceDoc.checked = !!Settings.data.translateSourceDoc;
  els.translateSourceMyMemory.checked = !!Settings.data.translateSourceMyMemory;
  els.translateApiKey.value = Settings.data.translateApiKey || '';
  document.querySelector(`input[name="themeMode"][value="${Settings.data.theme}"]`).checked = true;
  applyTheme();
  syncSpeedUI(Settings.data.rate);
}

function toggleTtsModeUI(mode) {
  els.browserVoiceOptions.classList.toggle('hidden', mode !== 'browser');
  els.externalVoiceOptions.classList.toggle('hidden', mode !== 'external');
}

els.ttsModeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => toggleTtsModeUI(e.target.value));
});

els.rateRange.addEventListener('input', () => {
  els.rateValue.textContent = `${els.rateRange.value}x`;
});

/* ---------- Overlay de ajustes ---------- */

function openSettings() {
  els.settingsOverlay.classList.remove('hidden');
}
function closeSettings() {
  els.settingsOverlay.classList.add('hidden');
}
els.settingsBtn.addEventListener('click', openSettings);
els.closeSettingsBtn.addEventListener('click', closeSettings);
els.settingsOverlay.addEventListener('click', (e) => {
  if (e.target === els.settingsOverlay) closeSettings();
});

els.saveSettingsBtn.addEventListener('click', () => {
  Settings.data.ttsMode = document.querySelector('input[name="ttsMode"]:checked').value;
  Settings.data.voiceName = els.voiceSelect.value || null;
  Settings.data.externalEndpoint = els.externalEndpoint.value.trim();
  Settings.data.externalApiKey = els.externalApiKey.value.trim();
  Settings.data.rate = parseFloat(els.rateRange.value);
  Settings.data.driveApiKey = els.driveApiKey.value.trim();
  Settings.data.driveFolderId = els.driveFolderId.value.trim();
  Settings.data.translateSourceDoc = els.translateSourceDoc.checked;
  Settings.data.translateSourceMyMemory = els.translateSourceMyMemory.checked;
  Settings.data.translateApiKey = els.translateApiKey.value.trim();
  Settings.data.theme = document.querySelector('input[name="themeMode"]:checked').value;
  Settings.save();
  syncSpeedUI(Settings.data.rate);
  applyTheme();
  els.translationRow.classList.toggle('hidden', !(Settings.data.translateSourceDoc || Settings.data.translateSourceMyMemory));
  closeSettings();
});

els.purgeLibraryBtn.addEventListener('click', () => {
  if (!confirm('¿Borrar todos los textos guardados en "Tu biblioteca de práctica" de este dispositivo? Esto no afecta tus documentos de Drive, solo lo cargado en caché local.')) return;
  localStorage.removeItem(RecentTexts.KEY);
  renderRecentList();
});

els.purgeVocabBtn.addEventListener('click', () => {
  if (!confirm('¿Vaciar por completo "Mi vocabulario"? Esta acción no se puede deshacer.')) return;
  localStorage.removeItem(VocabList.KEY);
  renderVocabList();
});

/* ---------- Tema: Claro / Oscuro / Sistema ---------- */

const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function applyTheme() {
  const mode = Settings.data.theme;
  const resolved = mode === 'system'
    ? (systemThemeQuery && systemThemeQuery.matches ? 'dark' : 'light')
    : mode;
  document.documentElement.setAttribute('data-theme', resolved);
}

els.themeModeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    Settings.data.theme = e.target.value;
    Settings.save();
    applyTheme();
  });
});

if (systemThemeQuery) {
  systemThemeQuery.addEventListener('change', () => {
    if (Settings.data.theme === 'system') applyTheme();
  });
}

/* ---------- Vibración táctil ---------- */

function haptic(ms = 15) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* ============================================================
   Voces del navegador (Web Speech API)
   ============================================================ */

function populateVoiceList() {
  const voices = window.speechSynthesis.getVoices()
    .filter(v => v.lang.toLowerCase().startsWith('en'));

  els.voiceSelect.innerHTML = '';
  voices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name;
    const tag = v.localService ? '🟢 sin conexión' : '🟡 requiere internet';
    opt.textContent = `${v.name} (${v.lang}) · ${tag}`;
    els.voiceSelect.appendChild(opt);
  });

  if (Settings.data.voiceName) {
    els.voiceSelect.value = Settings.data.voiceName;
  }
}

if ('speechSynthesis' in window) {
  populateVoiceList();
  window.speechSynthesis.onvoiceschanged = populateVoiceList;
}

/* ============================================================
   Proveedor de TTS
   ============================================================ */

function preprocessAcronymsForSpeech(text) {
  return text.replace(/\b[A-Z]{2,5}\b/g, (match) => match.split('').join('.') + '.');
}

const TTS = {
  async speak(text) {
    text = preprocessAcronymsForSpeech(text);
    if (Settings.data.ttsMode === 'external' && Settings.data.externalEndpoint && Settings.data.externalApiKey) {
      try {
        await this.speakExternal(text);
        return;
      } catch (err) {
        console.error('Fallo la API externa, usando voz del navegador como respaldo:', err);
      }
    }
    await this.speakBrowser(text);
  },

  speakBrowser(text) {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === Settings.data.voiceName);
      if (chosen) utter.voice = chosen;
      utter.lang = 'en-US';
      utter.rate = Settings.data.rate || 1;
      utter.onend = resolve;
      utter.onerror = resolve;
      window.speechSynthesis.speak(utter);
    });
  },

  async speakExternal(text) {
    const resp = await fetch(Settings.data.externalEndpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': Settings.data.externalApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
    });
    if (!resp.ok) throw new Error(`API externa respondió ${resp.status}`);
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = Settings.data.rate || 1;
    await new Promise((resolve, reject) => {
      audio.onended = resolve;
      audio.onerror = reject;
      audio.play();
    });
    URL.revokeObjectURL(url);
  },
};

/* ============================================================
   Velocidad: presets + slider de la tarjeta
   ============================================================ */

function syncSpeedUI(rate) {
  els.cardRateRange.value = rate;
  els.rateRange.value = rate;
  els.rateValue.textContent = `${rate}x`;
  const pct = ((parseFloat(rate) - 0.5) / (1.5 - 0.5)) * 100;
  els.cardRateRange.style.setProperty('--fill', `${pct}%`);
  els.speedPresets.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.rate) === parseFloat(rate));
  });
}

function setRate(rate) {
  Settings.data.rate = parseFloat(rate);
  Settings.save();
  syncSpeedUI(Settings.data.rate);
}

els.speedPresets.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => setRate(btn.dataset.rate));
});

els.cardRateRange.addEventListener('input', () => setRate(els.cardRateRange.value));

/* ============================================================
   Segmentación de texto en frases cortas
   ============================================================ */

const MIN_WORDS_PER_CARD = 4;

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function splitIntoSentences(text) {
  // Primero por líneas: así un título sin punto final (ej. un encabezado)
  // no se pega con el párrafo siguiente solo por no tener puntuación.
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const rawPieces = [];
  lines.forEach(line => {
    const cleaned = line.replace(/\s+/g, ' ').trim();
    const matches = cleaned.match(/[^.,;:!?]+[.,;:!?]+/g) || [];
    matches.forEach(m => rawPieces.push(m.trim()));

    const joined = matches.join('');
    const remainder = cleaned.slice(joined.length).trim();
    if (remainder) rawPieces.push(remainder);
  });

  const pieces = [];
  let buffer = '';
  rawPieces.forEach((piece, idx) => {
    buffer = buffer ? `${buffer} ${piece}` : piece;
    const isLast = idx === rawPieces.length - 1;
    if (countWords(buffer) >= MIN_WORDS_PER_CARD || isLast) {
      pieces.push(buffer);
      buffer = '';
    }
  });

  return pieces;
}

/* ============================================================
   Estado del texto actual (título, origen, traducción emparejada)
   ============================================================ */

let currentTitle = null;   // nombre del doc de Drive, o null si fue pegado a mano
let currentSource = 'pasted'; // 'drive' | 'pasted'
let driveFilesCache = [];
let pairedTranslationSentences = null;

function updateWordCount() {
  const n = countWords(els.textInput.value);
  els.wordCountLabel.textContent = `${n} palabra${n === 1 ? '' : 's'}`;
}

function setLoadedTitle(title) {
  currentTitle = title;
  if (title) {
    els.loadedTitleLabel.textContent = `📄 ${title}`;
    els.loadedTitleLabel.classList.remove('hidden');
  } else {
    els.loadedTitleLabel.classList.add('hidden');
  }
}

els.textInput.addEventListener('input', () => {
  updateWordCount();
  pairedTranslationSentences = null;
  currentSource = 'pasted';
  setLoadedTitle(null);
});

/* ============================================================
   Biblioteca de práctica (textos recientes, guardados por dispositivo)
   ============================================================ */

const RecentTexts = {
  KEY: 'shadowing_recent_texts_v1',
  MAX: 12,
  list() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch (e) { return []; }
  },
  save(entry) {
    let items = this.list().filter(i => i.title !== entry.title || i.source !== entry.source);
    items.unshift(entry);
    items = items.slice(0, this.MAX);
    localStorage.setItem(this.KEY, JSON.stringify(items));
    renderRecentList();
  },
};

function relativeDays(ts) {
  const days = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Practicado hoy';
  if (days === 1) return 'Practicado ayer';
  return `Practicado hace ${days} días`;
}

function renderRecentList() {
  const items = RecentTexts.list();
  els.recentList.innerHTML = '';
  if (items.length === 0) {
    els.recentList.innerHTML = '<p class="hint">Todavía no hay textos guardados en este dispositivo.</p>';
    return;
  }
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'lib-item';

    const icon = document.createElement('div');
    icon.className = 'lib-icon';
    icon.textContent = '📄';

    const info = document.createElement('div');
    info.className = 'lib-info';
    const title = document.createElement('p');
    title.className = 'lib-title';
    title.textContent = item.title;
    const sub = document.createElement('p');
    sub.className = 'lib-sub';
    sub.textContent = `${item.wordCount} palabras · ${item.phraseCount} frases`;
    info.appendChild(title);
    info.appendChild(sub);

    const meta = document.createElement('div');
    meta.className = 'lib-meta';
    meta.textContent = relativeDays(item.savedAt);

    const playBtn = document.createElement('button');
    playBtn.className = 'lib-play';
    playBtn.textContent = '▶';
    playBtn.title = 'Practicar shadowing';
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadEntryAndStart(item, 'shadow');
    });

    row.appendChild(icon);
    row.appendChild(info);
    row.appendChild(meta);
    row.appendChild(playBtn);

    row.addEventListener('click', () => {
      els.textInput.value = item.text;
      updateWordCount();
      currentSource = item.source;
      pairedTranslationSentences = null;
      setLoadedTitle(item.source === 'drive' ? item.title : null);
    });

    els.recentList.appendChild(row);
  });
}

function loadEntryAndStart(item, mode) {
  els.textInput.value = item.text;
  updateWordCount();
  currentSource = item.source;
  pairedTranslationSentences = null;
  setLoadedTitle(item.source === 'drive' ? item.title : null);
  if (mode === 'shadow') beginShadowing(); else beginTranslationPractice();
}

/* ============================================================
   Traducción al español (MyMemory, gratis sin API key)
   ============================================================ */

const Translator = {
  CACHE_KEY: 'shadowing_translate_cache_v1',
  cache: {},

  loadCache() {
    try { this.cache = JSON.parse(localStorage.getItem(this.CACHE_KEY)) || {}; }
    catch (e) { this.cache = {}; }
  },
  saveCache() {
    try { localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache)); }
    catch (e) { /* si se llena el storage, simplemente no persistimos */ }
  },

  async fetchOnce(text) {
    const email = Settings.data.translateApiKey ? `&de=${encodeURIComponent(Settings.data.translateApiKey)}` : '';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es${email}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const resp = await fetch(url, { signal: controller.signal });
      const data = await resp.json();
      if (!data.responseData || !data.responseData.translatedText) {
        throw new Error('respuesta inesperada del servicio de traducción');
      }
      return data.responseData.translatedText;
    } finally {
      clearTimeout(timeoutId);
    }
  },

  async translate(text) {
    if (this.cache[text]) return this.cache[text];
    try {
      const translated = await this.fetchOnce(text);
      this.cache[text] = translated;
      this.saveCache();
      return translated;
    } catch (err) {
      // Un reintento antes de rendirnos (el servicio gratuito a veces da timeout).
      const translated = await this.fetchOnce(text);
      this.cache[text] = translated;
      this.saveCache();
      return translated;
    }
  },
};
Translator.loadCache();

/**
 * Traducción al español de sentences[index].
 * Prioridad: el doc emparejado "(ES)" por índice (offline, sin llamadas de red)
 * — aunque no tenga exactamente el mismo número de frases, se usa si existe
 * una frase en esa posición. Solo si no hay nada ahí, se recurre a MyMemory.
 */
/**
 * Traducción al español de sentences[index], respetando las casillas de Ajustes:
 * - Ambas activas: prioridad al archivo (ES) por índice; si no hay nada ahí, MyMemory.
 * - Solo (ES) activo: solo usa el archivo, por índice, aunque esté desfasado o falte
 *   (nunca recurre a MyMemory) — así se puede detectar un desfase de puntuación.
 * - Solo MyMemory activo: siempre traduce en automático, ignora cualquier archivo (ES).
 * Deja registrado en `lastTranslationSource` de dónde salió ('doc' | 'mymemory'),
 * para que la tarjeta muestre el ícono correspondiente.
 */
let lastTranslationSource = null;

async function getSpanishFor(index) {
  const useDoc = Settings.data.translateSourceDoc;
  const useMyMemory = Settings.data.translateSourceMyMemory;

  if (useDoc && pairedTranslationSentences && pairedTranslationSentences.sentences[index] !== undefined) {
    lastTranslationSource = 'doc';
    return pairedTranslationSentences.sentences[index];
  }

  if (useMyMemory) {
    lastTranslationSource = 'mymemory';
    return Translator.translate(sentences[index]);
  }

  lastTranslationSource = null;
  if (useDoc) {
    throw new Error('el archivo (ES) no tiene nada en esta posición');
  }
  throw new Error('activa al menos un método de traducción en Ajustes');
}

function renderTranslationSourceIcon(source) {
  if (source === 'doc') {
    els.translationSourceIcon.innerHTML = '<img src="icons/google-drive.png" alt="Drive" title="Traducción desde el archivo (ES) de Drive">';
  } else if (source === 'mymemory') {
    els.translationSourceIcon.innerHTML = '<span class="mymemory-icon" title="Traducción automática (MyMemory)">🌐</span>';
  } else {
    els.translationSourceIcon.innerHTML = '';
  }
}

async function showTranslationFor(index) {
  const anyEnabled = Settings.data.translateSourceDoc || Settings.data.translateSourceMyMemory;
  if (!anyEnabled) {
    els.translationRow.classList.add('hidden');
    return;
  }
  els.translationRow.classList.remove('hidden');
  els.translationDisplay.textContent = 'Traduciendo...';
  renderTranslationSourceIcon(null);
  try {
    const text = await getSpanishFor(index);
    els.translationDisplay.textContent = text;
    renderTranslationSourceIcon(lastTranslationSource);
  } catch (err) {
    els.translationDisplay.textContent = `(sin traducción: ${err.message})`;
    renderTranslationSourceIcon(null);
  }
}

/* ============================================================
   Google Drive
   ============================================================ */

els.loadDriveBtn.addEventListener('click', async () => {
  if (!Settings.data.driveApiKey || !Settings.data.driveFolderId) {
    alert('Primero configura tu API key de Google y el ID de la carpeta en Ajustes ⚙️');
    openSettings();
    return;
  }

  els.driveFileList.classList.remove('hidden');
  els.driveFileList.innerHTML = '<p class="hint">Cargando archivos de Drive...</p>';

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${Settings.data.driveFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.document'&fields=files(id,name)&key=${Settings.data.driveApiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);

    driveFilesCache = data.files || [];
    els.driveFileList.innerHTML = '';
    if (driveFilesCache.length === 0) {
      els.driveFileList.innerHTML = '<p class="hint">No se encontraron Google Docs en esa carpeta (revisa que sea pública).</p>';
      return;
    }

    driveFilesCache
      .filter(file => !/\(ES\)\s*$/i.test(file.name.trim()))
      .forEach(file => {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML = `<span>📄 ${file.name}</span>`;
        div.addEventListener('click', () => loadDriveDoc(file));
        els.driveFileList.appendChild(div);
      });
  } catch (err) {
    els.driveFileList.innerHTML = `<p class="hint">Error al conectar con Drive: ${err.message}</p>`;
  }
});

async function exportDocText(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain&key=${Settings.data.driveApiKey}`;
  const resp = await fetch(url);
  return await resp.text();
}

async function loadDriveDoc(file) {
  els.driveFileList.innerHTML = '<p class="hint">Cargando texto...</p>';
  pairedTranslationSentences = null;
  try {
    const text = await exportDocText(file.id);
    els.textInput.value = text;
    updateWordCount();
    currentSource = 'drive';
    setLoadedTitle(file.name.trim());

    const pairedName = `${file.name.trim()} (ES)`.toLowerCase();
    const pairedFile = driveFilesCache.find(f => f.name.trim().toLowerCase() === pairedName);
    if (pairedFile) {
      const translationText = await exportDocText(pairedFile.id);
      pairedTranslationSentences = { raw: translationText, sentences: splitIntoSentences(translationText) };
    }

    els.driveFileList.classList.add('hidden');
  } catch (err) {
    alert('No se pudo cargar el documento: ' + err.message);
  }
}

/* ============================================================
   Preparar y guardar el texto actual en la biblioteca
   ============================================================ */

let sentences = [];
let currentIndex = 0;
let hasActiveSession = false;
let lastMode = 'shadow'; // 'shadow' | 'reverse'
let starredSet = new Set();

function updateResumeButton() {
  els.resumeBtn.classList.toggle('hidden', !hasActiveSession);
}

function prepareSentences() {
  const text = els.textInput.value.trim();
  if (!text) {
    alert('Pega o carga un texto primero.');
    return false;
  }
  sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    alert('No se pudo dividir el texto en frases.');
    return false;
  }

  const title = currentSource === 'drive' && currentTitle
    ? currentTitle
    : (text.slice(0, 40).trim() + (text.length > 40 ? '...' : ''));

  RecentTexts.save({
    title,
    text,
    source: currentSource,
    wordCount: countWords(text),
    phraseCount: sentences.length,
    savedAt: Date.now(),
  });

  currentIndex = 0;
  starredSet = new Set();
  hasActiveSession = true;
  return true;
}

function showOnly(view) {
  [els.loadView, els.practiceView, els.reverseView, els.vocabView].forEach(v => v.classList.add('hidden'));
  view.classList.remove('hidden');
}

function beginShadowing() {
  if (!prepareSentences()) return;
  lastMode = 'shadow';
  showOnly(els.practiceView);
  renderSentence();
}

function beginTranslationPractice() {
  if (!prepareSentences()) return;
  lastMode = 'reverse';
  showOnly(els.reverseView);
  renderReverseSentence();
}

els.startShadowBtn.addEventListener('click', beginShadowing);
els.startTranslateBtn.addEventListener('click', beginTranslationPractice);

els.resumeBtn.addEventListener('click', () => {
  if (lastMode === 'reverse') {
    showOnly(els.reverseView);
    renderReverseSentence();
  } else {
    showOnly(els.practiceView);
    renderSentence();
  }
});

/* ============================================================
   Práctica de Shadowing
   ============================================================ */

els.backToTextBtn.addEventListener('click', () => {
  stopSpeaking();
  showOnly(els.loadView);
  updateResumeButton();
});

function updateProgressUI(slider, label, percentEl) {
  slider.max = sentences.length - 1;
  slider.value = currentIndex;
  const pct = sentences.length > 1 ? Math.round((currentIndex / (sentences.length - 1)) * 100) : 100;
  slider.style.setProperty('--fill', `${pct}%`);
  label.textContent = `${currentIndex + 1} / ${sentences.length}`;
  if (percentEl) percentEl.textContent = `${pct}% completado`;
}

function renderSentence() {
  const text = sentences[currentIndex];
  updateProgressUI(els.progressSlider, els.progressLabel, els.progressPercent);
  els.indexBadge.textContent = currentIndex + 1;

  els.starBtn.textContent = starredSet.has(currentIndex) ? '⭐' : '☆';
  els.starBtn.classList.toggle('active', starredSet.has(currentIndex));

  els.sentenceDisplay.innerHTML = '';
  const words = text.split(/(\s+)/);
  words.forEach(chunk => {
    if (chunk.trim() === '') {
      els.sentenceDisplay.appendChild(document.createTextNode(chunk));
      return;
    }
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = chunk;
    span.title = 'Toca para escuchar · mantén presionado para traducir y guardar';
    attachWordGestures(span, chunk.replace(/[.,;:!?]+$/, ''));
    els.sentenceDisplay.appendChild(span);
  });

  setPlayIcon(false);
  showTranslationFor(currentIndex);
}

els.progressSlider.addEventListener('input', () => {
  stopSpeaking();
  currentIndex = parseInt(els.progressSlider.value, 10);
  renderSentence();
});

const LONG_PRESS_MS = 500;

function attachWordGestures(span, word) {
  let pressTimer = null;
  let longPressFired = false;

  const start = () => {
    longPressFired = false;
    pressTimer = setTimeout(() => {
      longPressFired = true;
      openWordPopup(word);
    }, LONG_PRESS_MS);
  };
  const cancelPress = () => clearTimeout(pressTimer);
  const end = () => {
    clearTimeout(pressTimer);
    if (longPressFired) return;
    TTS.speak(word);
  };

  span.addEventListener('mousedown', start);
  span.addEventListener('mouseup', end);
  span.addEventListener('mouseleave', cancelPress);
  span.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
  span.addEventListener('touchend', (e) => { e.preventDefault(); end(); });
  span.addEventListener('touchcancel', cancelPress);
}

els.starBtn.addEventListener('click', () => {
  if (starredSet.has(currentIndex)) {
    starredSet.delete(currentIndex);
  } else {
    starredSet.add(currentIndex);
    haptic(15);
  }
  els.starBtn.textContent = starredSet.has(currentIndex) ? '⭐' : '☆';
  els.starBtn.classList.toggle('active', starredSet.has(currentIndex));
});

function setPlayIcon(playing) {
  isSpeaking = playing;
  els.playBtn.textContent = playing ? '⏸' : '▶';
  els.sentenceCard.classList.toggle('speaking', playing);
}
let isSpeaking = false;

function stopSpeaking() {
  window.speechSynthesis.cancel();
  setPlayIcon(false);
}

async function playCurrent() {
  setPlayIcon(true);
  await TTS.speak(sentences[currentIndex]);
  setPlayIcon(false);
}

els.playBtn.addEventListener('click', () => {
  if (isSpeaking) stopSpeaking(); else playCurrent();
});

els.repeatBtn.addEventListener('click', () => {
  stopSpeaking();
  playCurrent();
});

function goToNext(withHaptic) {
  if (currentIndex < sentences.length - 1) {
    stopSpeaking();
    currentIndex++;
    renderSentence();
    playCurrent();
    if (withHaptic) haptic(12);
  }
}
function goToPrev(withHaptic) {
  if (currentIndex > 0) {
    stopSpeaking();
    currentIndex--;
    renderSentence();
    playCurrent();
    if (withHaptic) haptic(12);
  }
}
els.nextBtn.addEventListener('click', () => goToNext(true));
els.prevBtn.addEventListener('click', () => goToPrev(true));

/* Swipe en la tarjeta */
(function setupSwipe() {
  let startX = 0, startY = 0, tracking = false;
  const THRESHOLD = 50;

  els.sentenceCard.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    startX = t.clientX; startY = t.clientY; tracking = true;
  }, { passive: true });

  els.sentenceCard.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goToNext(false); else goToPrev(false);
    }
  }, { passive: true });
})();

/* ============================================================
   Práctica de traducción (modo inverso, con dirección invertible)
   ============================================================ */

let reverseDirection = 'es-en'; // 'es-en' | 'en-es'
let reverseRevealed = false;

function updateReverseLabels() {
  if (reverseDirection === 'es-en') {
    els.reverseDirectionLabel.textContent = 'Español → Inglés';
    els.promptLangTag.textContent = '🇪🇸 Español';
    els.answerLangTag.textContent = '🇬🇧 English';
  } else {
    els.reverseDirectionLabel.textContent = 'Inglés → Español';
    els.promptLangTag.textContent = '🇬🇧 English';
    els.answerLangTag.textContent = '🇪🇸 Español';
  }
}

els.reverseSwapBtn.addEventListener('click', () => {
  reverseDirection = reverseDirection === 'es-en' ? 'en-es' : 'es-en';
  updateReverseLabels();
  renderReverseSentence();
});

async function renderReverseSentence() {
  updateProgressUI(els.reverseProgressSlider, els.reverseProgressLabel, null);
  updateReverseLabels();
  setReverseRevealed(false);

  const en = sentences[currentIndex];
  els.reversePromptText.textContent = reverseDirection === 'en-es' ? en : 'Traduciendo...';
  els.reverseAnswerText.textContent = reverseDirection === 'en-es' ? '...' : en;

  try {
    const es = await getSpanishFor(currentIndex);
    if (reverseDirection === 'es-en') {
      els.reversePromptText.textContent = es;
      els.reverseAnswerText.textContent = en;
    } else {
      els.reverseAnswerText.textContent = es;
    }
  } catch (err) {
    const msg = `(error al traducir: ${err.message})`;
    if (reverseDirection === 'es-en') els.reversePromptText.textContent = msg;
    else els.reverseAnswerText.textContent = msg;
  }
}

function setReverseRevealed(value) {
  reverseRevealed = value;
  els.reverseAnswerBlock.classList.toggle('revealed', value);
  els.reverseShowBtn.textContent = value ? '🙈 Ocultar respuesta' : '👁 Mostrar respuesta';
  els.reverseShowBtn.classList.toggle('shown', value);
}

els.reverseShowBtn.addEventListener('click', () => setReverseRevealed(!reverseRevealed));

els.reversePlayBtn.addEventListener('click', () => {
  TTS.speak(sentences[currentIndex]); // siempre se escucha en inglés
});

els.reverseProgressSlider.addEventListener('input', () => {
  currentIndex = parseInt(els.reverseProgressSlider.value, 10);
  renderReverseSentence();
});

els.reverseNextBtn.addEventListener('click', () => {
  if (currentIndex < sentences.length - 1) { currentIndex++; renderReverseSentence(); }
});
els.reversePrevBtn.addEventListener('click', () => {
  if (currentIndex > 0) { currentIndex--; renderReverseSentence(); }
});

els.backFromReverseBtn.addEventListener('click', () => {
  showOnly(els.loadView);
  updateResumeButton();
});

els.reverseBtn.addEventListener('click', () => {
  closeSettings();
  if (!hasActiveSession) {
    alert('Primero carga y empieza a practicar un texto.');
    return;
  }
  lastMode = 'reverse';
  showOnly(els.reverseView);
  renderReverseSentence();
});

/* ============================================================
   Popup de palabra: traducción + agregar a vocabulario
   ============================================================ */

let popupCurrentWord = null;

async function openWordPopup(word) {
  popupCurrentWord = word;
  els.wordPopupWord.textContent = word;
  els.wordPopupTranslation.textContent = 'Traduciendo...';
  els.wordPopupOverlay.classList.remove('hidden');
  try {
    els.wordPopupTranslation.textContent = await Translator.translate(word);
  } catch (err) {
    els.wordPopupTranslation.textContent = '(no se pudo traducir)';
  }
}
function closeWordPopup() {
  els.wordPopupOverlay.classList.add('hidden');
  popupCurrentWord = null;
}
els.wordPopupCloseBtn.addEventListener('click', closeWordPopup);
els.wordPopupOverlay.addEventListener('click', (e) => {
  if (e.target === els.wordPopupOverlay) closeWordPopup();
});
els.wordPopupAddBtn.addEventListener('click', () => {
  if (!popupCurrentWord) return;
  VocabList.add(popupCurrentWord, els.wordPopupTranslation.textContent);
  haptic(20);
  closeWordPopup();
});

/* ============================================================
   Mi vocabulario
   ============================================================ */

const VocabList = {
  KEY: 'shadowing_vocab_v1',
  list() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch (e) { return []; }
  },
  add(word, translation) {
    const items = this.list().filter(i => i.word.toLowerCase() !== word.toLowerCase());
    items.unshift({ word, translation, addedAt: Date.now() });
    localStorage.setItem(this.KEY, JSON.stringify(items));
    renderVocabList();
  },
  remove(word) {
    const items = this.list().filter(i => i.word.toLowerCase() !== word.toLowerCase());
    localStorage.setItem(this.KEY, JSON.stringify(items));
    renderVocabList();
  },
};

function renderVocabList() {
  const items = VocabList.list();
  els.vocabList.innerHTML = '';
  if (items.length === 0) {
    els.vocabList.innerHTML = '<p class="hint">Todavía no has guardado palabras. Mantén presionada una palabra durante la práctica para agregarla aquí.</p>';
    return;
  }
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'file-item';

    const info = document.createElement('span');
    info.innerHTML = `<strong>${item.word}</strong> — <em>${item.translation}</em>`;

    const actions = document.createElement('div');
    actions.className = 'vocab-item-actions';

    const playBtn = document.createElement('button');
    playBtn.textContent = '▶';
    playBtn.addEventListener('click', (e) => { e.stopPropagation(); TTS.speak(item.word); });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '🗑';
    removeBtn.className = 'remove';
    removeBtn.addEventListener('click', (e) => { e.stopPropagation(); VocabList.remove(item.word); });

    actions.appendChild(playBtn);
    actions.appendChild(removeBtn);
    div.appendChild(info);
    div.appendChild(actions);
    els.vocabList.appendChild(div);
  });
}

els.vocabBtn.addEventListener('click', () => {
  closeSettings();
  renderVocabList();
  showOnly(els.vocabView);
});

els.backFromVocabBtn.addEventListener('click', () => {
  if (hasActiveSession) {
    showOnly(lastMode === 'reverse' ? els.reverseView : els.practiceView);
  } else {
    showOnly(els.loadView);
  }
});

/* ============================================================
   Inicialización
   ============================================================ */

applySettingsToUI();
renderRecentList();
updateWordCount();
updateResumeButton();
els.translationRow.classList.toggle('hidden', !(Settings.data.translateSourceDoc || Settings.data.translateSourceMyMemory));
