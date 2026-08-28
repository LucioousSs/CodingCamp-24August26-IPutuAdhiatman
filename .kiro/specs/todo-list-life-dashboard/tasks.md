# Implementation Plan: Todo List Life Dashboard

## Overview

Implementasi aplikasi web client-side menggunakan HTML5, CSS3, dan Vanilla JavaScript (ES2020) tanpa framework eksternal. Aplikasi terdiri dari widget Greeting, Focus Timer, To-Do List, Quick Links, dan fitur UI (Dog Mascot, Quote, Paw Prints, Time Gradient) dalam satu halaman dengan persistensi data menggunakan `localStorage`.

## Tasks

- [x] 1. Scaffolding struktur proyek dan konfigurasi testing
  - [x] 1.1 Buat struktur direktori proyek dan file utama
  - [x] 1.2 Inisialisasi package.json dan konfigurasi Vitest + fast-check

- [x] 2. Implementasi StorageManager dan Validator
  - [x] 2.1 Implementasi `StorageManager` di `js/app.js`
  - [x] 2.2 Implementasi `Validator` di `js/app.js`
  - [x]* 2.4 Tulis unit test untuk `Validator`

- [x] 3. Implementasi `GreetingController`
  - [x] 3.1 Implementasi helper functions `formatTime`, `formatDate`, `getGreeting`
  - [x] 3.2 Implementasi `GreetingController.init()` di `js/app.js`
  - [x]* 3.4 Tulis unit test untuk `GreetingController`

- [x] 4. Implementasi `FocusTimerController`
  - [x] 4.1 Implementasi helper function `formatTimer` dan state machine `FocusTimerController`
  - [x] 4.2 Implementasi render state tombol dan indikator FINISHED
  - [x]* 4.4 Tulis unit test untuk `FocusTimerController`

- [x] 5. Checkpoint — Pastikan semua test phase awal lulus

- [x] 6. Implementasi `TodoController`
  - [x] 6.1 Implementasi `TodoController.init()` dan fungsi render daftar task
  - [x] 6.2 Implementasi `TodoController.addTask(text)` dan badge counter
  - [x] 6.3 Implementasi `TodoController.editTask(id, newText)`
  - [x] 6.4 Implementasi `TodoController.toggleTask(id)` dan `deleteTask(id)`

- [x] 7. Implementasi `QuickLinksController`
  - [x] 7.1 Implementasi `QuickLinksController.init()` dan fungsi render daftar link
  - [x] 7.2 Implementasi `QuickLinksController.addLink(label, url)`
  - [x] 7.3 Implementasi `QuickLinksController.openLink(url)` dan `deleteLink(id)`

- [x] 8. Implementasi `AppInitializer` dan wiring semua komponen
  - [x] 8.1 Implementasi `AppInitializer` dan periksa ketersediaan `localStorage`
  - [x] 8.2 Pasang event listeners untuk semua widget di `AppInitializer`

- [x] 9. Implementasi CSS dan responsivitas
  - [x] 9.1 Tulis layout utama dan styling semua widget di `css/style.css`
  - [x] 9.2 Implementasi responsivitas untuk layar minimal 320px

- [x] 10. Checkpoint Final — Verifikasi integrasi dan jalankan semua test

- [x] 11. Glassmorphism Monochrome Theme
  - [x] 11.1 Implementasi glassmorphism CSS (backdrop-filter, transparansi, border)
  - [x] 11.2 Implementasi monochrome color palette dengan CSS custom properties
  - [x] 11.3 Implementasi custom scrollbar

- [x] 12. Navbar dengan Waktu dan Tanggal
  - [x] 12.1 Tambahkan navbar di `index.html`
  - [x] 12.2 Implementasi `NavbarController` untuk menampilkan waktu dan tanggal
  - [x] 12.3 Refactor `GreetingController` untuk menampilkan sapaan saja (waktu dipindah ke navbar)

- [x] 13. Dog Mascot CSS Art
  - [x] 13.1 Tambahkan markup dog mascot di `index.html`
  - [x] 13.2 Implementasi CSS art untuk dog mascot (body, head, ears, eyes, nose, mouth, tongue, paws, tail)
  - [x] 13.3 Implementasi `DogMascotController` untuk ekspresi berdasarkan waktu
  - [x] 13.4 Implementasi interaksi click untuk pesan random

- [x] 14. Focus Timer Duration Picker
  - [x] 14.1 Tambahkan dropdown durasi di `index.html`
  - [x] 14.2 Update `FocusTimerController` untuk membaca durasi dari dropdown
  - [x] 14.3 Simpan durasi pilihan ke `localStorage`
  - [x] 14.4 Load durasi dari `localStorage` saat init

- [x] 15. Circular Timer Progress (SVG)
  - [x] 15.1 Tambahkan SVG circle di `index.html`
  - [x] 15.2 Implementasi CSS untuk circular progress
  - [x] 15.3 Update `FocusTimerController` untuk memperbarui progress bar

- [x] 16. Todo Empty State
  - [x] 16.1 Tambahkan markup empty state di `index.html`
  - [x] 16.2 Implementasi CSS untuk empty state
  - [x] 16.3 Update `TodoController._render()` untuk menampilkan/sembunyikan empty state

- [x] 17. Mini Quote Widget
  - [x] 17.1 Tambahkan markup quote di `index.html`
  - [x] 17.2 Implementasi `QuoteController` untuk quote motivasi acak
  - [x] 17.3 Implementasi CSS untuk quote widget

- [x] 18. Paw Prints Animation
  - [x] 18.1 Tambahkan container paw prints di `index.html`
  - [x] 18.2 Implementasi `PawPrintsController` untuk spawn paw print acak
  - [x] 18.3 Implementasi CSS animation untuk paw prints

- [x] 19. Time-based Gradient Background
  - [x] 19.1 Implementasi `TimeGradientController` untuk update gradient berdasarkan waktu
  - [x] 19.2 Definisikan gradient untuk morning, afternoon, evening, night (monochrome)

- [x] 20. Challenge: Custom Name in Greeting
  - [x] 20.1 Tambahkan input nama di `index.html`
  - [x] 20.2 Update `GreetingController` untuk menampilkan nama di sapaan
  - [x] 20.3 Simpan nama ke `localStorage`
  - [x] 20.4 Implementasi CSS untuk input nama

- [x] 21. Challenge: Prevent Duplicate Tasks
  - [x] 21.1 Update `TodoController.addTask()` untuk cek duplikat case-insensitive
  - [x] 21.2 Tampilkan pesan error jika duplikat

- [x] 22. Challenge: Sort Tasks
  - [x] 22.1 Tambahkan dropdown sort di `index.html`
  - [x] 22.2 Implementasi `TodoController._sortTasks()` untuk 4 opsi sort
  - [x] 22.3 Simpan sort preference ke `localStorage`
  - [x] 22.4 Implementasi CSS untuk sort dropdown

- [x] 23. Layout Opsi A
  - [x] 23.1 Update CSS grid untuk greeting full width
  - [x] 23.2 Update CSS grid untuk timer dan todo sejajar
  - [x] 23.3 Update CSS grid untuk quicklinks full width
  - [x] 23.4 Implementasi max-height dan scroll untuk todo list

- [x] 24. Semantic HTML
  - [x] 24.1 Ganti `<div>` dengan `<h1>` untuk greeting message
  - [x] 24.2 Ganti `<div>` dengan `<p>` untuk error message dan timer finished
  - [x] 24.3 Ganti `<div>` dengan `<aside>` untuk todo empty state
  - [x] 24.4 Tambahkan `<label class="sr-only">` untuk aksesibilitas

- [x] 25. Update Dokumentasi
  - [x] 25.1 Update `README.md` dengan deskripsi project dan cara menjalankan
  - [x] 25.2 Update `requirements.md` dengan fitur baru
  - [x] 25.3 Update `design.md` dengan controller baru
  - [x] 25.4 Update `tasks.md` dengan task yang sudah selesai

## Notes

- Task bertanda `*` adalah opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task merujuk ke requirement spesifik untuk traceability
- Property test menggunakan `fast-check` dengan `numRuns: 100` per property
- Unit test menggunakan Vitest dengan `jsdom` environment untuk simulasi DOM
- Focus Timer menyimpan durasi pilihan ke `localStorage` (ephemeral state untuk timer running)
- ID generation: `"prefix_" + Date.now() + "_" + random4hex` untuk collision resistance pada aplikasi single-user
