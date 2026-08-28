/* Todo List Life Dashboard - Application Logic */

/* ============================================================
   StorageManager
   Abstraksi localStorage dengan error handling terpusat.
   Semua akses localStorage dilakukan melalui modul ini.
   ============================================================ */
const StorageManager = {
  KEYS: {
    TASKS: 'todo_dashboard_tasks',
    LINKS: 'todo_dashboard_links',
  },

  /**
   * Cek apakah localStorage tersedia dan dapat ditulis.
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (_e) {
      return false;
    }
  },

  /**
   * Baca dan parse nilai JSON dari localStorage.
   * @param {string} key
   * @returns {*} Parsed value, atau null jika tidak ada / parse gagal
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (_e) {
      return null;
    }
  },

  /**
   * Serialisasi dan simpan nilai ke localStorage.
   * @param {string} key
   * @param {*} value
   * @returns {boolean} true jika berhasil, false jika gagal (kuota penuh, private mode, dll.)
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_e) {
      return false;
    }
  },
};

/* ============================================================
   Validator
   Fungsi validasi input yang digunakan bersama oleh
   TodoController dan QuickLinksController.
   ============================================================ */
const Validator = {
  /**
   * Validasi teks task.
   * Ditolak jika: kosong, hanya whitespace, atau > 255 karakter.
   * @param {string} text
   * @returns {{ valid: boolean, reason?: string }}
   */
  isValidTaskText(text) {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return { valid: false, reason: 'Teks task tidak boleh kosong atau hanya spasi.' };
    }
    if (text.length > 255) {
      return { valid: false, reason: 'Teks task tidak boleh melebihi 255 karakter.' };
    }
    return { valid: true };
  },

  /**
   * Validasi label quick link.
   * Ditolak jika: kosong, hanya whitespace, atau > 50 karakter.
   * @param {string} text
   * @returns {{ valid: boolean, reason?: string }}
   */
  isValidLinkLabel(text) {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return { valid: false, reason: 'Label tidak boleh kosong atau hanya spasi.' };
    }
    if (text.length > 50) {
      return { valid: false, reason: 'Label tidak boleh melebihi 50 karakter.' };
    }
    return { valid: true };
  },

  /**
   * Validasi URL quick link.
   * Ditolak jika: > 2048 karakter, bukan http/https, host kosong, atau format tidak valid.
   * @param {string} url
   * @returns {{ valid: boolean, reason?: string }}
   */
  isValidUrl(url) {
    if (typeof url !== 'string' || url.trim().length === 0) {
      return { valid: false, reason: 'URL tidak boleh kosong.' };
    }
    if (url.length > 2048) {
      return { valid: false, reason: 'URL tidak boleh melebihi 2048 karakter.' };
    }
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { valid: false, reason: 'URL harus diawali dengan http:// atau https://.' };
      }
      if (!parsed.hostname) {
        return { valid: false, reason: 'URL harus memiliki hostname yang valid.' };
      }
      return { valid: true };
    } catch (_e) {
      return { valid: false, reason: 'Format URL tidak valid.' };
    }
  },
};

/* ============================================================
   Greeting Helper Functions
   Fungsi-fungsi pembantu untuk GreetingController.
   ============================================================ */

/**
 * Format Date object ke string HH:MM (24-jam, selalu dua digit).
 * @param {Date} date
 * @returns {string} mis. "09:05", "23:59"
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format Date object ke string tanggal lengkap Bahasa Indonesia.
 * @param {Date} date
 * @returns {string} mis. "Senin, 26 Agustus 2024"
 */
function formatDate(date) {
  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const hari = HARI[date.getDay()];
  const tanggal = date.getDate();
  const bulan = BULAN[date.getMonth()];
  const tahun = date.getFullYear();
  return `${hari}, ${tanggal} ${bulan} ${tahun}`;
}

/**
 * Kembalikan sapaan berdasarkan jam (0–23).
 * @param {number} hour - integer jam dalam rentang 0–23
 * @returns {string} "Selamat Pagi" | "Selamat Siang" | "Selamat Sore" | "Selamat Malam"
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Selamat Pagi';
  if (hour >= 12 && hour <= 14) return 'Selamat Siang';
  if (hour >= 15 && hour <= 17) return 'Selamat Sore';
  return 'Selamat Malam';
}

/* ============================================================
   Utility: generateId
   Menghasilkan unique identifier dengan prefix, timestamp, dan
   4-digit hex acak. Probabilitas collision sangat rendah untuk
   aplikasi single-user client-side.
   ============================================================ */
function generateId(prefix) {
  const random = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
  return `${prefix}_${Date.now()}_${random}`;
}

/* ============================================================
   formatTimer
   Mengkonversi total detik (0–1500) ke string MM:SS.
   Contoh: formatTimer(1500) → "25:00"
           formatTimer(65)   → "01:05"
           formatTimer(0)    → "00:00"
   ============================================================ */
function formatTimer(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/* ============================================================
   FocusTimerController
   State machine untuk countdown timer 25 menit.

   States: IDLE | RUNNING | PAUSED | FINISHED
   Transitions:
     IDLE     → RUNNING  : start()
     RUNNING  → PAUSED   : stop()
     PAUSED   → RUNNING  : start()
     RUNNING  → FINISHED : countdown reaches 00:00
     FINISHED → IDLE     : reset()
     PAUSED   → IDLE     : reset()
     RUNNING  → IDLE     : reset()
     IDLE     → IDLE     : reset() (no-op)

   State ini TIDAK disimpan ke localStorage — bersifat ephemeral
   per sesi halaman, konsisten dengan penggunaan Pomodoro.
   ============================================================ */

// In-memory state — tidak di-export, hanya diakses via FocusTimerController
const timerState = {
  status: 'IDLE',           // 'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED'
  durationMs: 25 * 60 * 1000, // Durasi yang dipilih user
  remainingMs: 25 * 60 * 1000, // Sisa waktu
  startEpoch: null,         // Date.now() saat transisi ke RUNNING
  remainingAtStart: null,   // remainingMs saat transisi ke RUNNING (snapshot)
  intervalId: null,         // ID dari setInterval yang aktif
};

const FocusTimerController = {
  /**
   * Inisialisasi controller: set state IDLE dan render tampilan awal ke DOM.
   */
  init() {
    // Load durasi dari localStorage jika ada
    const savedDuration = StorageManager.get('todo_dashboard_timer_duration');
    const duration = savedDuration || 25;

    timerState.status = 'IDLE';
    timerState.durationMs = duration * 60 * 1000;
    timerState.remainingMs = timerState.durationMs;
    timerState.startEpoch = null;
    timerState.remainingAtStart = null;
    timerState.intervalId = null;

    // Set select value
    const select = document.getElementById('timer-duration-select');
    if (select) select.value = duration;

    this._updateDisplay();
    this._bindDurationPicker();
  },

  /**
   * Bind event listener untuk duration picker.
   */
  _bindDurationPicker() {
    const select = document.getElementById('timer-duration-select');
    if (!select || typeof select.addEventListener !== 'function') return;

    select.addEventListener('change', (e) => {
      const minutes = parseInt(e.target.value, 10);
      timerState.durationMs = minutes * 60 * 1000;

      // Simpan ke localStorage
      StorageManager.set('todo_dashboard_timer_duration', minutes);

      // Reset timer jika sedang IDLE
      if (timerState.status === 'IDLE') {
        timerState.remainingMs = timerState.durationMs;
        this._updateDisplay();
      }
    });
  },

  /**
   * Transisi IDLE/PAUSED → RUNNING.
   */
  start() {
    if (timerState.status !== 'IDLE' && timerState.status !== 'PAUSED') return;

    timerState.status = 'RUNNING';
    timerState.startEpoch = Date.now();
    timerState.remainingAtStart = timerState.remainingMs;

    timerState.intervalId = setInterval(() => {
      const elapsed = Date.now() - timerState.startEpoch;
      const remaining = timerState.remainingAtStart - elapsed;

      if (remaining <= 0) {
        timerState.remainingMs = 0;
        timerState.status = 'FINISHED';
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
        FocusTimerController._updateDisplay();
        return;
      }

      timerState.remainingMs = remaining;
      FocusTimerController._updateDisplay();
    }, 1000);

    FocusTimerController._updateDisplay();
  },

  /**
   * Transisi RUNNING → PAUSED.
   */
  stop() {
    if (timerState.status !== 'RUNNING') return;

    const elapsed = Date.now() - timerState.startEpoch;
    const remaining = timerState.remainingAtStart - elapsed;
    timerState.remainingMs = Math.max(0, remaining);

    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    timerState.startEpoch = null;
    timerState.remainingAtStart = null;
    timerState.status = 'PAUSED';

    FocusTimerController._updateDisplay();
  },

  /**
   * Transisi any state → IDLE.
   */
  reset() {
    if (timerState.intervalId !== null) {
      clearInterval(timerState.intervalId);
      timerState.intervalId = null;
    }
    timerState.status = 'IDLE';
    timerState.remainingMs = timerState.durationMs;
    timerState.startEpoch = null;
    timerState.remainingAtStart = null;

    FocusTimerController._updateDisplay();
  },

  /**
   * Perbarui tampilan: timer display, tombol, progress circle, indikator.
   */
  _updateDisplay() {
    const display = document.getElementById('timer-display');
    const startBtn = document.getElementById('timer-start-btn');
    const stopBtn = document.getElementById('timer-stop-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const finishedIndicator = document.getElementById('timer-finished-indicator');
    const fillCircle = document.getElementById('timer-fill-circle');
    const status = timerState.status;

    // Update timer display
    if (display) {
      const totalSeconds = Math.ceil(timerState.remainingMs / 1000);
      display.textContent = formatTimer(totalSeconds);

      // Update display class
      display.classList.remove('running', 'paused', 'timer-finished');
      if (status === 'RUNNING') display.classList.add('running');
      else if (status === 'PAUSED') display.classList.add('paused');
      else if (status === 'FINISHED') display.classList.add('timer-finished');
    }

    // Update circular progress
    if (fillCircle && fillCircle.style) {
      const circumference = 2 * Math.PI * 54; // r=54
      const progress = timerState.remainingMs / timerState.durationMs;
      const offset = circumference * (1 - progress);
      fillCircle.style.strokeDasharray = circumference;
      fillCircle.style.strokeDashoffset = offset;

      // Update circle class
      fillCircle.classList.remove('running', 'paused', 'finished');
      if (status === 'RUNNING') fillCircle.classList.add('running');
      else if (status === 'PAUSED') fillCircle.classList.add('paused');
      else if (status === 'FINISHED') fillCircle.classList.add('finished');
    }

    // Update button states
    if (startBtn) startBtn.disabled = (status === 'RUNNING' || status === 'FINISHED');
    if (stopBtn) stopBtn.disabled = (status !== 'RUNNING');
    if (resetBtn) resetBtn.disabled = false;

    // Update FINISHED indicator
    if (finishedIndicator) {
      finishedIndicator.hidden = (status !== 'FINISHED');
    }
  },

  /**
   * Getter untuk state saat ini.
   */
  getState() {
    return {
      status: timerState.status,
      remainingMs: timerState.remainingMs,
      durationMs: timerState.durationMs,
    };
  },
};

/* ============================================================
   NavbarController
   Menampilkan jam (HH:MM) dan tanggal lengkap di navbar.
   Diperbarui setiap detik via setInterval.

   DOM elements yang dikelola:
     #nav-date  – Tanggal lengkap (Hari, DD MMMM YYYY)
     #nav-time  – Waktu HH:MM
   ============================================================ */
const NavbarController = {
  /**
   * Inisialisasi controller: render awal sekali lalu mulai interval 1 detik.
   */
  init() {
    this._render();
    setInterval(() => this._render(), 1000);
  },

  /**
   * Render waktu dan tanggal ke navbar.
   */
  _render() {
    const elDate = document.getElementById('nav-date');
    const elTime = document.getElementById('nav-time');

    try {
      const now = new Date();

      if (isNaN(now.getTime())) {
        throw new Error('Invalid date');
      }

      if (elTime) elTime.textContent = formatTime(now);
      if (elDate) elDate.textContent = formatDate(now);
    } catch (_e) {
      if (elTime) elTime.textContent = '--:--';
      if (elDate) elDate.textContent = 'Tanggal tidak tersedia';
    }
  },
};

/* ============================================================
   GreetingController
   Menampilkan sapaan berdasarkan Time_Of_Day.
   Diperbarui setiap detik via setInterval.

   DOM elements yang dikelola:
     #greeting-message – Sapaan (Selamat Pagi/Siang/Sore/Malam)
     #greeting-error   – Indikator error (hidden by default)
   ============================================================ */
const GreetingController = {
  _nameKey: 'todo_dashboard_username',
  _currentText: '',
  _typedText: '',
  _typeIndex: 0,
  _typeInterval: null,
  _lastGreeting: '',
  _loopTimeout: null,

  /**
   * Inisialisasi controller: render awal sekali lalu mulai interval 1 detik.
   */
  init() {
    this._loadName();
    this._render();
    this._bindEvents();
    setInterval(() => this._render(), 1000);
  },

  /**
   * Load nama dari localStorage ke input.
   */
  _loadName() {
    const name = StorageManager.get(this._nameKey) || '';
    const input = document.getElementById('name-input');
    if (input) input.value = name;
  },

  /**
   * Render sapaan ke DOM.
   */
  _render() {
    const elMessage = document.getElementById('greeting-message');
    const elError = document.getElementById('greeting-error');

    try {
      const now = new Date();

      if (isNaN(now.getTime())) {
        throw new Error('Invalid date');
      }

      let greeting = getGreeting(now.getHours());
      const name = StorageManager.get(this._nameKey);
      if (name) {
        greeting += ', ' + name;
      }

      // Jika greeting berubah, restart typing loop
      if (greeting !== this._lastGreeting) {
        this._lastGreeting = greeting;
        this._startTypingLoop(elMessage, greeting);
      }

      if (elError) elError.hidden = true;
      if (elMessage) elMessage.hidden = false;
    } catch (_e) {
      if (elMessage) elMessage.hidden = true;
      if (elError) {
        elError.hidden = false;
        if (!elError.textContent) {
          elError.textContent = 'Informasi waktu tidak tersedia.';
        }
      }
    }
  },

  /**
   * Start typing loop - type, pause, clear, repeat.
   * @param {HTMLElement} element
   * @param {string} text
   */
  _startTypingLoop(element, text) {
    // Clear previous intervals
    this._stopTyping();

    this._currentText = text;
    this._typeIndex = 0;
    this._typedText = '';
    if (element) element.textContent = '';

    // Mulai typing pertama kali
    this._type(element);
  },

  /**
   * Type one character at a time, then schedule next loop.
   * @param {HTMLElement} element
   */
  _type(element) {
    if (!element) return;

    this._typeInterval = setInterval(() => {
      if (this._typeIndex < this._currentText.length) {
        this._typedText += this._currentText[this._typeIndex];
        element.textContent = this._typedText;
        this._typeIndex++;
      } else {
        // Selesai type, pause lalu clear dan ulang
        clearInterval(this._typeInterval);
        this._typeInterval = null;

        this._loopTimeout = setTimeout(() => {
          // Clear text
          this._typedText = '';
          this._typeIndex = 0;
          element.textContent = '';

          // Mulai type ulang
          this._type(element);
        }, 3000); // Pause 3 detik sebelum ulang
      }
    }, 50); // 50ms per character
  },

  /**
   * Stop typing intervals.
   */
  _stopTyping() {
    if (this._typeInterval) {
      clearInterval(this._typeInterval);
      this._typeInterval = null;
    }
    if (this._loopTimeout) {
      clearTimeout(this._loopTimeout);
      this._loopTimeout = null;
    }
  },

  /**
   * Bind events untuk input nama.
   */
  _bindEvents() {
    const input = document.getElementById('name-input');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      StorageManager.set(this._nameKey, name);
      this._render();
    });
  },
};

/* ============================================================
   DogMascotController
   Mengelola karakter anjing mascot.
   Berubah ekspresi sesuai waktu dan berinteraksi dengan user.

   DOM elements yang dikelola:
     #dog-mascot   – Container mascot anjing
     #dog-speech   – Speech bubble anjing
     #dog-tongue   – Lidah anjing
   ============================================================ */
const DogMascotController = {
  _messages: {
    morning: ['Selamat pagi, Boss!', 'Semangat pagi!', 'Jangan lupa sarapan!'],
    afternoon: ['Istirahat dulu, yuk!', 'Semangat siang!', 'Minum air putih!'],
    evening: ['Selamat sore!', 'Waktunya refresh!', 'Hampir selesai!'],
    night: ['Selamat malam!', 'Jangan begadang ya!', 'Istirahat yang cukup!'],
  },

  _lastMessageTime: 0,

  /**
   * Inisialisasi mascot.
   */
  init() {
    this._render();
    setInterval(() => this._render(), 60000); // Update setiap menit
    this._bindEvents();
  },

  /**
   * Render ekspresi anjing berdasarkan waktu.
   * Sync dengan getGreeting():
   *   Pagi:  05:00 – 11:59
   *   Siang: 12:00 – 14:59
   *   Sore:  15:00 – 17:59
   *   Malam: 18:00 – 04:59
   */
  _render() {
    const mascot = document.getElementById('dog-mascot');
    if (!mascot) return;

    const hour = new Date().getHours();

    // Hapus semua state
    mascot.classList.remove('sleeping', 'awake', 'happy', 'morning', 'afternoon', 'evening', 'night');

    // Set state berdasarkan waktu (sinkron dengan getGreeting)
    if (hour >= 18 || hour < 5) {
      // Malam: sleeping
      mascot.classList.add('sleeping', 'night');
    } else if (hour >= 5 && hour < 12) {
      // Pagi: awake + stretch
      mascot.classList.add('awake', 'morning');
    } else if (hour >= 12 && hour < 15) {
      // Siang: awake + happy + wag tail cepat
      mascot.classList.add('awake', 'happy', 'afternoon');
    } else {
      // Sore (15-17): awake + calm
      mascot.classList.add('awake', 'evening');
    }

    // Tampilkan pesan sesekali
    this._maybeShowMessage(hour);
  },

  /**
   * Tampilkan pesan acak sesuai waktu.
   * Sinkron dengan getGreeting():
   *   Pagi:  05:00 – 11:59
   *   Siang: 12:00 – 14:59
   *   Sore:  15:00 – 17:59
   *   Malam: 18:00 – 04:59
   * @param {number} hour
   */
  _maybeShowMessage(hour) {
    const now = Date.now();
    // Hanya tampilkan setiap 2 menit
    if (now - this._lastMessageTime < 120000) return;

    // 20% chance untuk menampilkan pesan
    if (Math.random() > 0.2) return;

    let period;
    if (hour >= 5 && hour < 12) period = 'morning';
    else if (hour >= 12 && hour < 15) period = 'afternoon';
    else if (hour >= 15 && hour < 18) period = 'evening';
    else period = 'night';

    const messages = this._messages[period];
    const message = messages[Math.floor(Math.random() * messages.length)];

    this._showSpeech(message);
    this._lastMessageTime = now;
  },

  /**
   * Tampilkan speech bubble.
   * @param {string} message
   */
  _showSpeech(message) {
    const speech = document.getElementById('dog-speech');
    if (!speech) return;

    speech.textContent = message;
    speech.classList.add('visible');

    setTimeout(() => {
      speech.classList.remove('visible');
    }, 3000);
  },

  /**
   * Bind events untuk interaksi dengan mascot.
   */
  _bindEvents() {
    const mascot = document.getElementById('dog-mascot');
    if (!mascot) return;

    // Klik mascot untuk dapat pesan random
    mascot.addEventListener('click', () => {
      const hour = new Date().getHours();
      let period;
      if (hour >= 5 && hour < 12) period = 'morning';
      else if (hour >= 12 && hour < 15) period = 'afternoon';
      else if (hour >= 15 && hour < 18) period = 'evening';
      else period = 'night';

      const messages = this._messages[period];
      const message = messages[Math.floor(Math.random() * messages.length)];
      this._showSpeech(message);

      // Efek happy
      mascot.classList.add('happy');
      setTimeout(() => {
        mascot.classList.remove('happy');
      }, 1000);
    });
  },
};

/* ============================================================
   QuoteController
   Menampilkan quote motivasi acak di greeting widget.
   Ganti quote setiap kali user klik atau setiap 5 menit.

   DOM elements yang dikelola:
     #quote-text – Teks quote
   ============================================================ */
const QuoteController = {
  _quotes: [
    '"Hari ini adalah hari yang baru!"',
    '"Setiap langkah kecil adalah kemajuan."',
    '"Fokus pada satu hal pada satu waktu."',
    '"Kamu lebih bisa dari yang kamu kira!"',
    '"Jangan lupa istirahat ya!"',
    '"Tetap semangat, kamu hebat!"',
    '"Selesaikan yang penting terlebih dahulu."',
    '"Waktu terbaik untuk mulai adalah sekarang."',
    '"Istirahat bukan berarti berhenti."',
    '"Tetaplah bergerak maju."',
    '"Setiap hari adalah kesempatan baru."',
    '"Kerja kerasmu akan membuahkan hasil."',
    '"Jangan lupa makan dan minum air!"',
    '"Kamu sudah berusaha dengan baik hari ini."',
    '"Langkah kecil hari ini = lompatan besar besok."',
  ],

  _lastQuote: '',
  _lastChangeTime: 0,

  /**
   * Inisialisasi controller.
   */
  init() {
    this._render();
    this._bindEvents();

    // Ganti quote setiap 5 menit
    setInterval(() => this._render(), 300000);
  },

  /**
   * Render quote acak ke DOM.
   */
  _render() {
    const elQuote = document.getElementById('quote-text');
    if (!elQuote) return;

    let quote;
    do {
      quote = this._quotes[Math.floor(Math.random() * this._quotes.length)];
    } while (quote === this._lastQuote && this._quotes.length > 1);

    this._lastQuote = quote;
    elQuote.textContent = quote;
  },

  /**
   * Bind events - klik untuk ganti quote.
   */
  _bindEvents() {
    const quoteContainer = document.getElementById('mini-quote');
    if (!quoteContainer) return;

    quoteContainer.addEventListener('click', () => {
      this._render();
    });
  },
};

/* ============================================================
   PawPrintsController
   Mencetak jejak kaki anjing secara acak di background.

   DOM elements yang dikelola:
     #paw-prints-container – Container untuk paw prints
   ============================================================ */
const PawPrintsController = {
  _container: null,

  /**
   * Inisialisasi controller.
   */
  init() {
    this._container = document.getElementById('paw-prints-container');
    if (!this._container) return;

    // Spawn paw print setiap 8-15 detik
    this._scheduleNext();
  },

  /**
   * Jadwalkan paw print berikutnya.
   */
  _scheduleNext() {
    const delay = 8000 + Math.random() * 7000; // 8-15 detik
    setTimeout(() => {
      this._spawnPaw();
      this._scheduleNext();
    }, delay);
  },

  /**
   * Buat paw print baru di posisi acak.
   */
  _spawnPaw() {
    if (!this._container) return;

    const paw = document.createElement('div');
    paw.className = 'paw-print';

    // Posisi acak
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const rotation = Math.random() * 360;

    paw.style.left = `${x}%`;
    paw.style.top = `${y}%`;
    paw.style.setProperty('--paw-rotation', `${rotation}deg`);

    this._container.appendChild(paw);

    // Hapus setelah animasi selesai
    setTimeout(() => {
      paw.remove();
    }, 4000);
  },
};

/* ============================================================
   TimeGradientController
   Mengubah background gradient berdasarkan waktu.

   Time periods:
     Pagi (5-11):    biru gelap ke abu-abu
     Siang (12-14):  abu-abu ke coklat gelap
     Sore (15-17):   coklat gelap ke ungu gelap
     Malam (18-4):   ungu gelap ke hitam
   ============================================================ */
const TimeGradientController = {
  _gradients: {
    morning: { start: '#1a1a1a', end: '#2a2a2a' },
    afternoon: { start: '#222222', end: '#333333' },
    evening: { start: '#1a1a1a', end: '#2a2a2a' },
    night: { start: '#0f0f0f', end: '#1a1a2e' },
  },

  /**
   * Inisialisasi controller.
   */
  init() {
    this._update();
    setInterval(() => this._update(), 60000); // Update setiap menit
  },

  /**
   * Update gradient berdasarkan waktu saat ini.
   */
  _update() {
    const hour = new Date().getHours();
    let period;

    if (hour >= 5 && hour < 12) period = 'morning';
    else if (hour >= 12 && hour < 17) period = 'afternoon';
    else if (hour >= 17 && hour < 22) period = 'evening';
    else period = 'night';

    const gradient = this._gradients[period];
    const root = document.documentElement;

    root.style.setProperty('--bg-gradient-start', gradient.start);
    root.style.setProperty('--bg-gradient-end', gradient.end);
  },
};

/* ============================================================
   TodoController
   Mengelola CRUD tasks, validasi input, badge counter,
   dan persistensi ke localStorage.

   DOM elements yang dikelola:
     #todo-input         – Input field tambah task
     #todo-add-btn       – Tombol Tambah
     #todo-list          – Container <ul> task
     #todo-count-badge   – Jumlah task belum selesai
     #todo-input-error   – Error validasi input
     #todo-storage-error – Pesan error penyimpanan
   ============================================================ */

// In-memory state
const todoState = {
  tasks: [],
};

const TodoController = {
  _sortKey: 'todo_dashboard_sort',

  /**
   * Inisialisasi controller: load dari storage, validasi item,
   * filter item tidak valid, render daftar.
   */
  init() {
    const stored = StorageManager.get(StorageManager.KEYS.TASKS);
    if (Array.isArray(stored)) {
      todoState.tasks = stored.filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.text === 'string' &&
          typeof item.completed === 'boolean'
      );
    } else {
      todoState.tasks = [];
    }

    // Load sort preference
    const savedSort = StorageManager.get(this._sortKey) || 'newest';
    const sortSelect = document.getElementById('todo-sort-select');
    if (sortSelect) sortSelect.value = savedSort;

    this._bindSortEvents();
    this._render();
  },

  /**
   * Tambah task baru setelah validasi.
   * @param {string} text
   */
  addTask(text) {
    const validation = Validator.isValidTaskText(text);
    if (!validation.valid) {
      this._showInputError(validation.reason);
      return;
    }

    const trimmed = text.trim();

    // Cek duplikat
    const duplicate = todoState.tasks.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      this._showInputError('Tugas dengan teks yang sama sudah ada.');
      return;
    }

    const task = {
      id: generateId('task'),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    todoState.tasks.push(task);
    this._save();
    this._render();
  },

  /**
   * Edit teks task.
   * @param {string} id
   * @param {string} newText
   */
  editTask(id, newText) {
    const validation = Validator.isValidTaskText(newText);
    if (!validation.valid) {
      return false;
    }

    const task = todoState.tasks.find((t) => t.id === id);
    if (!task) return false;

    task.text = newText.trim();
    this._save();
    this._render();
    return true;
  },

  /**
   * Toggle status completed task.
   * @param {string} id
   */
  toggleTask(id) {
    const task = todoState.tasks.find((t) => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    this._save();
    this._render();
  },

  /**
   * Hapus task (tanpa konfirmasi — konfirmasi di event handler).
   * @param {string} id
   */
  deleteTask(id) {
    todoState.tasks = todoState.tasks.filter((t) => t.id !== id);
    this._save();
    this._render();
  },

  /**
   * Dapatkan jumlah task yang belum selesai.
   * @returns {number}
   */
  getUncompletedCount() {
    return todoState.tasks.filter((t) => !t.completed).length;
  },

  /**
   * Dapatkan seluruh daftar task (untuk testing).
   * @returns {Array}
   */
  getTasks() {
    return [...todoState.tasks];
  },

  /**
   * Bind events untuk sort dropdown.
   * @private
   */
  _bindSortEvents() {
    const sortSelect = document.getElementById('todo-sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
      StorageManager.set(this._sortKey, e.target.value);
      this._render();
    });
  },

  /**
   * Sort tasks berdasarkan kriteria.
   * @param {string} key - 'newest' | 'oldest' | 'unfinished' | 'alpha'
   * @returns {Array} sorted tasks
   * @private
   */
  _sortTasks(key) {
    const tasks = [...todoState.tasks];

    switch (key) {
      case 'newest':
        return tasks.sort((a, b) => b.createdAt - a.createdAt);
      case 'oldest':
        return tasks.sort((a, b) => a.createdAt - b.createdAt);
      case 'unfinished':
        return tasks.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return b.createdAt - a.createdAt;
        });
      case 'alpha':
        return tasks.sort((a, b) => a.text.localeCompare(b.text, 'id'));
      default:
        return tasks;
    }
  },

  /**
   * Render ulang daftar task ke DOM.
   * @private
   */
  _render() {
    const list = document.getElementById('todo-list');
    const badge = document.getElementById('todo-count-badge');
    const emptyState = document.getElementById('todo-empty');

    if (badge) {
      badge.textContent = this.getUncompletedCount();
    }

    if (!list) return;

    list.innerHTML = '';

    // Tampilkan/sembunyikan empty state
    if (emptyState) {
      emptyState.classList.toggle('visible', todoState.tasks.length === 0);
    }

    // Sort tasks
    const sortKey = StorageManager.get(this._sortKey) || 'newest';
    const sortedTasks = this._sortTasks(sortKey);

    sortedTasks.forEach((task) => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      li.className = 'todo-item' + (task.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-check';
      checkbox.checked = task.completed;

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = task.text;

      const editBtn = document.createElement('button');
      editBtn.className = 'todo-edit-btn';
      editBtn.textContent = 'Edit';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete-btn';
      deleteBtn.textContent = 'Hapus';

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  },

  /**
   * Simpan tasks ke localStorage.
   * @private
   */
  _save() {
    const success = StorageManager.set(StorageManager.KEYS.TASKS, todoState.tasks);
    const errorEl = document.getElementById('todo-storage-error');
    if (!success) {
      if (errorEl) {
        errorEl.textContent = 'Penyimpanan gagal. Perubahan tidak tersimpan.';
        errorEl.hidden = false;
      }
    } else {
      if (errorEl) errorEl.hidden = true;
    }
  },

  /**
   * Tampilkan error validasi input.
   * @param {string} message
   * @private
   */
  _showInputError(message) {
    const errorEl = document.getElementById('todo-input-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  },

  /**
   * Sembunyikan error validasi input.
   */
  clearInputError() {
    const errorEl = document.getElementById('todo-input-error');
    if (errorEl) errorEl.hidden = true;
  },
};

/* ============================================================
   QuickLinksController
   Mengelola CRUD quick links, validasi label & URL,
   dan persistensi ke localStorage.

   DOM elements yang dikelola:
     #link-label-input   – Input label
     #link-url-input     – Input URL
     #link-add-btn       – Tombol Tambah Link
     #link-list          – Container link cards
     #link-label-error   – Error validasi label
     #link-url-error     – Error validasi URL
     #link-storage-error – Pesan error penyimpanan
     #link-limit-error   – Error batas maksimum 20
   ============================================================ */

// In-memory state
const quickLinksState = {
  links: [],
};

const MAX_LINKS = 20;

const QuickLinksController = {
  /**
   * Inisialisasi controller: load dari storage, render daftar.
   */
  init() {
    const stored = StorageManager.get(StorageManager.KEYS.LINKS);
    if (Array.isArray(stored)) {
      quickLinksState.links = stored.filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.label === 'string' &&
          typeof item.url === 'string'
      );
    } else {
      quickLinksState.links = [];
    }
    this._render();
  },

  /**
   * Tambah quick link baru setelah validasi.
   * @param {string} label
   * @param {string} url
   * @returns {boolean} true jika berhasil
   */
  addLink(label, url) {
    this._clearErrors();

    // Validasi label
    const labelValidation = Validator.isValidLinkLabel(label);
    if (!labelValidation.valid) {
      this._showError('link-label-error', labelValidation.reason);
      return false;
    }

    // Validasi URL
    const urlValidation = Validator.isValidUrl(url);
    if (!urlValidation.valid) {
      this._showError('link-url-error', urlValidation.reason);
      return false;
    }

    // Cek duplikasi label (case-insensitive)
    const isDuplicate = quickLinksState.links.some(
      (link) => link.label.toLowerCase() === label.trim().toLowerCase()
    );
    if (isDuplicate) {
      this._showError('link-label-error', 'Label sudah digunakan.');
      return false;
    }

    // Cek batas maksimum
    if (quickLinksState.links.length >= MAX_LINKS) {
      this._showError('link-limit-error', 'Batas maksimum 20 link telah tercapai.');
      return false;
    }

    const link = {
      id: generateId('link'),
      label: label.trim(),
      url: url.trim(),
      createdAt: Date.now(),
    };

    quickLinksState.links.push(link);
    this._save();
    this._render();
    return true;
  },

  /**
   * Buka URL di tab baru.
   * @param {string} url
   */
  openLink(url) {
    window.open(url, '_blank');
  },

  /**
   * Hapus quick link.
   * @param {string} id
   */
  deleteLink(id) {
    quickLinksState.links = quickLinksState.links.filter((l) => l.id !== id);
    this._save();
    this._render();
  },

  /**
   * Dapatkan seluruh daftar link (untuk testing).
   * @returns {Array}
   */
  getLinks() {
    return [...quickLinksState.links];
  },

  /**
   * Render ulang daftar link ke DOM.
   * @private
   */
  _render() {
    const list = document.getElementById('link-list');
    if (!list) return;

    list.innerHTML = '';

    quickLinksState.links.forEach((link) => {
      const card = document.createElement('div');
      card.className = 'link-card';
      card.dataset.id = link.id;

      const labelSpan = document.createElement('span');
      labelSpan.className = 'link-label';
      labelSpan.textContent = link.label;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'link-delete-btn';
      deleteBtn.textContent = '×';

      card.appendChild(labelSpan);
      card.appendChild(deleteBtn);

      // Klik card untuk buka link
      card.addEventListener('click', (e) => {
        if (e.target === deleteBtn) return;
        this.openLink(link.url);
      });

      list.appendChild(card);
    });
  },

  /**
   * Simpan links ke localStorage.
   * @private
   */
  _save() {
    const success = StorageManager.set(StorageManager.KEYS.LINKS, quickLinksState.links);
    const errorEl = document.getElementById('link-storage-error');
    if (!success) {
      if (errorEl) {
        errorEl.textContent = 'Penyimpanan gagal. Perubahan tidak tersimpan.';
        errorEl.hidden = false;
      }
    } else {
      if (errorEl) errorEl.hidden = true;
    }
  },

  /**
   * Tampilkan pesan error pada elemen tertentu.
   * @param {string} elementId
   * @param {string} message
   * @private
   */
  _showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
  },

  /**
   * Sembunyikan semua error.
   * @private
   */
  _clearErrors() {
    ['link-label-error', 'link-url-error', 'link-storage-error', 'link-limit-error'].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
      }
    );
  },
};

/* ============================================================
   AppInitializer
   Inisialisasi semua controller dan pasang event listeners.
   Dipanggil dari event DOMContentLoaded.
   ============================================================ */
const AppInitializer = {
  /**
   * Inisialisasi semua komponen dan pasang event listeners.
   */
  init() {
    // Periksa ketersediaan localStorage
    if (!StorageManager.isAvailable()) {
      this._showStorageWarning();
    }

    // Inisialisasi semua controller
    NavbarController.init();
    GreetingController.init();
    DogMascotController.init();
    QuoteController.init();
    PawPrintsController.init();
    TimeGradientController.init();
    FocusTimerController.init();
    TodoController.init();
    QuickLinksController.init();

    // Pasang event listeners
    this._bindTodoEvents();
    this._bindTimerEvents();
    this._bindQuickLinksEvents();
  },

  /**
   * Tampilkan banner peringatan jika localStorage tidak tersedia.
   * @private
   */
  _showStorageWarning() {
    const banner = document.createElement('div');
    banner.id = 'storage-warning-banner';
    banner.textContent = 'Peringatan: Fitur penyimpanan tidak tersedia. Data tidak akan tersimpan.';
    banner.style.cssText =
      'background:#ffc107;color:#000;text-align:center;padding:8px;font-size:14px;';
    document.body.prepend(banner);
  },

  /**
   * Pasang event listeners untuk Todo widget.
   * @private
   */
  _bindTodoEvents() {
    const todoInput = document.getElementById('todo-input');
    const todoAddBtn = document.getElementById('todo-add-btn');
    const todoList = document.getElementById('todo-list');

    // Tambah task via tombol Tambah
    if (todoAddBtn) {
      todoAddBtn.addEventListener('click', () => {
        if (todoInput) {
          TodoController.addTask(todoInput.value);
          if (TodoController.getTasks().length > 0) {
            todoInput.value = '';
          }
        }
      });
    }

    // Tambah task via Enter
    if (todoInput) {
      todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          TodoController.addTask(todoInput.value);
          if (TodoController.getTasks().length > 0) {
            todoInput.value = '';
          }
        }
      });

      // Clear error saat user mengetik
      todoInput.addEventListener('input', () => {
        TodoController.clearInputError();
      });
    }

    // Delegasi event pada #todo-list
    if (todoList) {
      todoList.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('.todo-item');
        if (!li) return;
        const taskId = li.dataset.id;

        // Checkbox toggle
        if (target.classList.contains('todo-check')) {
          TodoController.toggleTask(taskId);
          return;
        }

        // Tombol Edit
        if (target.classList.contains('todo-edit-btn')) {
          this._startEditTask(li, taskId);
          return;
        }

        // Tombol Hapus
        if (target.classList.contains('todo-delete-btn')) {
          if (window.confirm('Yakin ingin menghapus tugas ini?')) {
            TodoController.deleteTask(taskId);
          }
          return;
        }

        // Tombol Simpan (edit mode)
        if (target.classList.contains('todo-save-btn')) {
          const editInput = li.querySelector('.todo-edit-input');
          if (editInput) {
            const success = TodoController.editTask(taskId, editInput.value);
            if (!success) {
              // Jika gagal, kembalikan tampilan normal
              this._cancelEditTask(li, taskId);
            }
          }
          return;
        }

        // Tombol Batal (edit mode)
        if (target.classList.contains('todo-cancel-btn')) {
          this._cancelEditTask(li, taskId);
          return;
        }
      });

      // Handle Enter di edit input
      todoList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('todo-edit-input')) {
          const li = e.target.closest('.todo-item');
          if (!li) return;
          const taskId = li.dataset.id;
          const success = TodoController.editTask(taskId, e.target.value);
          if (!success) {
            this._cancelEditTask(li, taskId);
          }
        }
      });
    }
  },

  /**
   * Mulai mode edit task.
   * @param {HTMLElement} li
   * @param {string} taskId
   * @private
   */
  _startEditTask(li, taskId) {
    const task = TodoController.getTasks().find((t) => t.id === taskId);
    if (!task) return;

    const textSpan = li.querySelector('.todo-text');
    const editBtn = li.querySelector('.todo-edit-btn');
    const deleteBtn = li.querySelector('.todo-delete-btn');

    // Sembunyikan teks dan tombol edit/hapus
    if (textSpan) textSpan.hidden = true;
    if (editBtn) editBtn.hidden = true;
    if (deleteBtn) deleteBtn.hidden = true;

    // Buat input edit
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'todo-edit-input';
    editInput.value = task.text;
    editInput.maxLength = 255;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'todo-save-btn';
    saveBtn.textContent = 'Simpan';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'todo-cancel-btn';
    cancelBtn.textContent = 'Batal';

    li.appendChild(editInput);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    editInput.focus();
  },

  /**
   * Batalkan mode edit task.
   * @param {HTMLElement} li
   * @param {string} taskId
   * @private
   */
  _cancelEditTask(li, taskId) {
    // Hapus elemen edit
    const editInput = li.querySelector('.todo-edit-input');
    const saveBtn = li.querySelector('.todo-save-btn');
    const cancelBtn = li.querySelector('.todo-cancel-btn');
    if (editInput) editInput.remove();
    if (saveBtn) saveBtn.remove();
    if (cancelBtn) cancelBtn.remove();

    // Tampilkan kembali teks dan tombol
    const textSpan = li.querySelector('.todo-text');
    const editBtn = li.querySelector('.todo-edit-btn');
    const deleteBtn = li.querySelector('.todo-delete-btn');
    if (textSpan) textSpan.hidden = false;
    if (editBtn) editBtn.hidden = false;
    if (deleteBtn) deleteBtn.hidden = false;
  },

  /**
   * Pasang event listeners untuk Focus Timer widget.
   * @private
   */
  _bindTimerEvents() {
    const startBtn = document.getElementById('timer-start-btn');
    const stopBtn = document.getElementById('timer-stop-btn');
    const resetBtn = document.getElementById('timer-reset-btn');

    if (startBtn) startBtn.addEventListener('click', () => FocusTimerController.start());
    if (stopBtn) stopBtn.addEventListener('click', () => FocusTimerController.stop());
    if (resetBtn) resetBtn.addEventListener('click', () => FocusTimerController.reset());
  },

  /**
   * Pasang event listeners untuk Quick Links widget.
   * @private
   */
  _bindQuickLinksEvents() {
    const linkAddBtn = document.getElementById('link-add-btn');
    const linkLabelInput = document.getElementById('link-label-input');
    const linkUrlInput = document.getElementById('link-url-input');
    const linkList = document.getElementById('link-list');

    // Tambah link
    if (linkAddBtn) {
      linkAddBtn.addEventListener('click', () => {
        if (linkLabelInput && linkUrlInput) {
          const success = QuickLinksController.addLink(linkLabelInput.value, linkUrlInput.value);
          if (success) {
            linkLabelInput.value = '';
            linkUrlInput.value = '';
          }
        }
      });
    }

    // Clear error saat user mengetik
    if (linkLabelInput) {
      linkLabelInput.addEventListener('input', () => {
        const el = document.getElementById('link-label-error');
        if (el) el.hidden = true;
      });
    }

    if (linkUrlInput) {
      linkUrlInput.addEventListener('input', () => {
        const el = document.getElementById('link-url-error');
        if (el) el.hidden = true;
      });
    }

    // Delegasi event pada #link-list
    if (linkList) {
      linkList.addEventListener('click', (e) => {
        const target = e.target;

        // Tombol Hapus
        if (target.classList.contains('link-delete-btn')) {
          const card = target.closest('.link-card');
          if (card) {
            QuickLinksController.deleteLink(card.dataset.id);
          }
          return;
        }
      });
    }
  },
};

/* ============================================================
   App Initializer — panggil init() saat DOM siap
   ============================================================ */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AppInitializer.init();
  });
}

/* ============================================================
   Exports (untuk testing — tidak memengaruhi browser file://)
   ============================================================ */
export {
  StorageManager,
  Validator,
  formatTime,
  formatDate,
  getGreeting,
  formatTimer,
  generateId,
  NavbarController,
  GreetingController,
  DogMascotController,
  QuoteController,
  PawPrintsController,
  TimeGradientController,
  FocusTimerController,
  TodoController,
  todoState,
  QuickLinksController,
  quickLinksState,
  AppInitializer,
  timerState,
};
