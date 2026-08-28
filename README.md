# Todo List Life Dashboard

<img width="1920" height="967" alt="image" src="https://github.com/user-attachments/assets/ceccc83d-4c3b-4bfc-959e-575ef6f58d9f" />

Aplikasi web client-side untuk mengelola produktivitas harian dengan empat widget utama: Greeting, Focus Timer, To-Do List, dan Quick Links.

## Features

### Greeting Widget
- Menampilkan waktu (HH:MM) dan tanggal lengkap Bahasa Indonesia
- Sapaan otomatis berdasarkan waktu: Pagi, Siang, Sore, Malam
- Input nama untuk sapaan personal ("Selamat Pagi, [Nama]")
- Dog mascot CSS art dengan ekspresi berubah sesuai waktu
- Mini quote motivasi

### Focus Timer
- Timer Pomodoro dengan durasi default 25 menit
- Pilihan durasi: 5, 15, 25, 30, 45, 60 menit
- Circular progress bar (SVG)
- Tombol Start, Stop, Reset
- Indikator visual saat timer selesai

### To-Do List
- Tambah, edit, hapus task
- Toggle status selesai/belum selesai
- Badge counter task belum selesai
- Sort tasks: Terbaru, Terlama, Belum selesai dulu, A-Z
- Pencegahan task duplikat
- Empty state saat tidak ada task
- Auto-save ke Local Storage

### Quick Links
- Tambah link favorit dengan label dan URL
- Validasi URL (http/https)
- Maksimum 20 link
- Pencegahan label duplikat
- Klik card untuk buka link di tab baru
- Auto-save ke Local Storage

### UI/UX
- Glassmorphism monochrome theme
- Time-based gradient background
- Paw prints animation
- Responsive design (mobile-friendly)
- Custom scrollbar

## Tech Stack

- HTML5 (semantic elements)
- CSS3 (CSS custom properties, glassmorphism)
- Vanilla JavaScript (ES2020, no frameworks)
- Local Storage API (client-side persistence)

## Project Structure

```
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All styles
├── js/
│   └── app.js              # All JavaScript logic
├── tests/
│   ├── unit/               # Unit tests
│   └── property/           # Property-based tests
├── package.json
├── vitest.config.js
└── .gitignore
```

## How to Run

### Direct (Browser)
Buka `index.html` langsung di browser.

### Development (with tests)
```bash
npm install
npm test
```

## Browser Support

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Apple Safari

## License

MIT
