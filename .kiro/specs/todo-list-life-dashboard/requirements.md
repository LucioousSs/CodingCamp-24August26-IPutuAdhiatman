# Requirements Document

## Introduction

To Do List Life Dashboard adalah aplikasi web berbasis klien yang dirancang untuk membantu pengguna mengelola produktivitas sehari-hari. Aplikasi ini menggabungkan empat fitur utama dalam satu antarmuka: Greeting (sapa pengguna berdasarkan waktu), Focus Timer (timer Pomodoro 25 menit), To-Do List (manajemen tugas), dan Quick Links (akses cepat ke website favorit). Semua data disimpan secara lokal menggunakan browser Local Storage API tanpa membutuhkan backend server. Aplikasi dibangun menggunakan HTML, CSS, dan Vanilla JavaScript, serta dapat dijalankan sebagai standalone web app atau browser extension di browser modern.

## Glossary

- **Dashboard**: Halaman utama aplikasi yang menampilkan semua widget secara bersamaan dalam satu tampilan
- **Greeting_Widget**: Komponen UI yang menampilkan waktu, tanggal, dan sapaan berdasarkan waktu hari
- **Focus_Timer**: Komponen UI berupa countdown timer dengan durasi 25 menit untuk sesi fokus kerja
- **Todo_Manager**: Komponen UI yang mengelola daftar tugas pengguna (tambah, edit, selesai, hapus)
- **Quick_Links_Manager**: Komponen UI yang menyimpan dan menampilkan link/shortcut ke website favorit
- **Local_Storage**: Browser API yang digunakan untuk menyimpan data secara persisten di sisi klien
- **Task**: Satu item pekerjaan yang dicatat dalam Todo_Manager, memiliki teks deskripsi dan status selesai/belum
- **Quick_Link**: Satu item shortcut yang terdiri dari label teks dan URL yang akan dibuka
- **Session**: Satu siklus Focus_Timer dari mulai (Start) hingga timer habis atau dihentikan
- **Time_Of_Day**: Kategori waktu harian: Pagi (05:00–11:59), Siang (12:00–14:59), Sore (15:00–17:59), Malam (18:00–04:59)

---

## Requirements

### Requirement 1: Tampilan Greeting Berdasarkan Waktu

**User Story:** Sebagai pengguna, saya ingin melihat waktu, tanggal, dan sapaan yang sesuai dengan waktu hari saat ini, sehingga saya merasa disambut secara personal setiap kali membuka dashboard.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL menampilkan waktu saat ini dalam format HH:MM (jam:menit, 24 jam) yang diperbarui setiap detik.
2. THE Greeting_Widget SHALL menampilkan tanggal saat ini dalam format lengkap (nama hari, tanggal, nama bulan, tahun) dalam Bahasa Indonesia.
3. WHEN waktu saat ini berada dalam rentang 05:00–11:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Pagi".
4. WHEN waktu saat ini berada dalam rentang 12:00–14:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Siang".
5. WHEN waktu saat ini berada dalam rentang 15:00–17:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Sore".
6. WHEN waktu saat ini berada dalam rentang 18:00–23:59 atau 00:00–04:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Malam".
7. THE Greeting_Widget SHALL menyediakan input nama pengguna untuk sapaan personal.
8. IF pengguna memasukkan nama, THEN THE Greeting_Widget SHALL menampilkan sapaan dalam format "[Sapaan], [Nama]" (contoh: "Selamat Pagi, Budi").
9. THE Greeting_Widget SHALL menyimpan nama pengguna ke Local Storage dan mengembalikannya saat halaman dimuat ulang.
10. WHEN halaman Dashboard dimuat, THE Greeting_Widget SHALL langsung menampilkan waktu, tanggal, dan sapaan yang akurat dalam waktu ≤ 1 detik setelah halaman selesai dimuat.
11. WHEN waktu sistem melewati batas pergantian Time_Of_Day (contoh: 11:59→12:00), THE Greeting_Widget SHALL memperbarui sapaan secara otomatis tanpa membutuhkan reload halaman.
12. IF waktu sistem tidak tersedia atau tidak dapat dibaca, THEN THE Greeting_Widget SHALL menampilkan indikator error yang terlihat oleh pengguna sebagai pengganti tampilan waktu dan sapaan.

---

### Requirement 2: Focus Timer

**User Story:** Sebagai pengguna, saya ingin menggunakan timer Pomodoro dengan durasi yang dapat disesuaikan, sehingga saya bisa mengikuti teknik Pomodoro dan meningkatkan produktivitas.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menampilkan hitungan mundur dalam format MM:SS dengan nilai awal default 25:00.
2. THE Focus_Timer SHALL menyediakan dropdown pemilihan durasi: 5, 15, 25, 30, 45, dan 60 menit.
3. WHEN pengguna memilih durasi baru dari dropdown, THE Focus_Timer SHALL memperbarui timer ke durasi yang dipilih dan mereset countdown.
4. WHEN pengguna menekan tombol Start, THE Focus_Timer SHALL memulai hitungan mundur dari nilai yang ditampilkan saat ini.
5. WHILE Focus_Timer sedang berjalan, THE Focus_Timer SHALL memperbarui tampilan hitungan mundur setiap detik.
6. WHEN pengguna menekan tombol Stop, THE Focus_Timer SHALL menghentikan hitungan mundur dan mempertahankan nilai waktu yang tersisa saat itu.
7. WHEN pengguna menekan tombol Reset, THE Focus_Timer SHALL menghentikan hitungan mundur (jika sedang berjalan) dan mengembalikan tampilan ke durasi yang dipilih.
8. WHEN hitungan mundur Focus_Timer mencapai 00:00, THE Focus_Timer SHALL berhenti secara otomatis dan menampilkan indikator visual yang dapat dibedakan dari tampilan timer normal.
9. THE Focus_Timer SHALL menampilkan circular progress bar yang menunjukkan persentase waktu tersisa.
10. WHILE Focus_Timer sedang berjalan, THE Focus_Timer SHALL menonaktifkan tombol Start untuk mencegah duplikasi sesi.
11. WHILE Focus_Timer dalam keadaan berhenti atau di-reset, THE Focus_Timer SHALL menonaktifkan tombol Stop dan mengaktifkan tombol Start.
12. THE Focus_Timer SHALL menyimpan durasi yang dipilih ke Local Storage dan mengembalikannya saat halaman dimuat ulang.

---

### Requirement 3: Manajemen To-Do List

**User Story:** Sebagai pengguna, saya ingin menambah, mengedit, menyelesaikan, dan menghapus tugas dalam daftar, sehingga saya dapat melacak pekerjaan yang perlu diselesaikan setiap harinya.

#### Acceptance Criteria

1. WHEN pengguna memasukkan teks tugas (maksimal 255 karakter) dan mengkonfirmasi input (menekan Enter atau tombol Tambah), THE Todo_Manager SHALL menambahkan Task baru dengan teks tersebut dan status belum selesai ke dalam daftar.
2. IF pengguna mencoba mengkonfirmasi input dengan teks kosong, hanya berisi spasi, atau melebihi 255 karakter, THEN THE Todo_Manager SHALL menolak penambahan Task dan mempertahankan fokus pada input field.
3. IF pengguna mencoba menambahkan Task dengan teks yang sama (case-insensitive) dengan Task yang sudah ada, THEN THE Todo_Manager SHALL menolak penambahan dan menampilkan pesan error bahwa tugas dengan teks yang sama sudah ada.
4. WHEN pengguna mengklik tombol Edit pada sebuah Task, THE Todo_Manager SHALL menampilkan input field yang dapat diedit berisi teks Task tersebut.
5. WHEN pengguna mengkonfirmasi perubahan teks Task (menekan Enter atau tombol Simpan) dengan teks valid (tidak kosong, tidak hanya spasi, maksimal 255 karakter), THE Todo_Manager SHALL memperbarui teks Task dengan nilai yang baru.
6. IF pengguna mencoba menyimpan perubahan Task dengan teks kosong, hanya berisi spasi, atau melebihi 255 karakter, THEN THE Todo_Manager SHALL membatalkan perubahan dan mengembalikan teks Task ke nilai sebelumnya.
7. WHEN pengguna menandai sebuah Task sebagai selesai, THE Todo_Manager SHALL mengubah status Task menjadi selesai dan menampilkan teks Task dengan strikethrough sebagai tanda visual pembeda dari task yang belum selesai.
8. WHEN pengguna menandai sebuah Task yang sudah selesai, THE Todo_Manager SHALL mengubah status Task kembali menjadi belum selesai dan menghapus tampilan strikethrough.
9. WHEN pengguna menekan tombol Hapus pada sebuah Task, THE Todo_Manager SHALL meminta konfirmasi dari pengguna sebelum menghapus.
10. WHEN pengguna mengkonfirmasi penghapusan Task, THE Todo_Manager SHALL menghapus Task tersebut dari daftar secara permanen.
11. WHEN terjadi perubahan pada daftar Task (tambah, edit, selesai, hapus), THE Todo_Manager SHALL menyimpan seluruh daftar Task ke dalam Local_Storage secara otomatis.
12. IF Local_Storage gagal menyimpan data Task, THEN THE Todo_Manager SHALL menampilkan pesan error kepada pengguna bahwa penyimpanan gagal.
13. WHEN halaman Dashboard dimuat, THE Todo_Manager SHALL membaca dan menampilkan seluruh daftar Task dari Local_Storage.
14. IF data Task di Local_Storage tidak dapat di-parse atau tidak valid, THEN THE Todo_Manager SHALL menginisialisasi daftar Task kosong dan menampilkan daftar kosong tanpa pesan error kepada pengguna.
15. THE Todo_Manager SHALL menampilkan jumlah Task yang belum selesai dan memperbarui jumlah tersebut setiap kali status atau jumlah Task berubah.
16. THE Todo_Manager SHALL menyediakan dropdown pengurutan: Terbaru (berdasarkan waktu pembuatan), Terlama, Belum selesai dulu, dan A-Z (alfabetis).
17. WHEN pengguna memilih opsi pengurutan dari dropdown, THE Todo_Manager SHALL mengurutkan daftar Task sesuai kriteria yang dipilih.
18. THE Todo_Manager SHALL menyimpan opsi pengurutan yang dipilih ke Local Storage dan mengembalikannya saat halaman dimuat ulang.
19. THE Todo_Manager SHALL menampilkan empty state (pesan dan ikon) saat daftar Task kosong.

---

### Requirement 4: Manajemen Quick Links

**User Story:** Sebagai pengguna, saya ingin menyimpan dan mengakses shortcut ke website favorit saya langsung dari dashboard, sehingga saya bisa berpindah ke situs yang sering dikunjungi dengan cepat tanpa perlu mengetik URL.

#### Acceptance Criteria

1. WHEN pengguna memasukkan label (1–50 karakter, tidak hanya spasi) dan URL yang valid (diawali `http://` atau `https://`, memiliki host non-kosong, maksimal 2048 karakter) lalu mengkonfirmasi (menekan tombol Tambah Link), THE Quick_Links_Manager SHALL menambahkan Quick_Link baru ke dalam daftar.
2. IF pengguna mencoba menambahkan Quick_Link dengan label kosong, hanya berisi spasi, atau melebihi 50 karakter, THEN THE Quick_Links_Manager SHALL menolak penambahan dan menampilkan pesan error yang menyebutkan field label tidak valid.
3. IF pengguna memasukkan URL yang tidak diawali dengan `http://` atau `https://`, memiliki host kosong, atau melebihi 2048 karakter, THEN THE Quick_Links_Manager SHALL menolak penambahan dan menampilkan pesan error bahwa format URL tidak valid.
4. IF pengguna mencoba menambahkan Quick_Link dengan label yang identik (case-insensitive) dengan Quick_Link yang sudah ada, THEN THE Quick_Links_Manager SHALL menolak penambahan dan menampilkan pesan error bahwa label sudah digunakan.
5. IF jumlah Quick_Link dalam daftar sudah mencapai 20, THEN THE Quick_Links_Manager SHALL menolak penambahan Quick_Link baru dan menampilkan pesan error bahwa batas maksimum telah tercapai.
6. WHEN pengguna mengklik sebuah Quick_Link, THE Quick_Links_Manager SHALL membuka URL yang terkait di tab baru browser.
7. WHEN pengguna menekan tombol Hapus pada sebuah Quick_Link, THE Quick_Links_Manager SHALL menghapus Quick_Link tersebut dari daftar secara permanen.
8. WHEN terjadi perubahan pada daftar Quick_Link (tambah, hapus), THE Quick_Links_Manager SHALL menyimpan seluruh daftar Quick_Link ke dalam Local_Storage secara otomatis.
9. IF Local_Storage gagal menyimpan data Quick_Link, THEN THE Quick_Links_Manager SHALL menampilkan pesan error kepada pengguna bahwa penyimpanan gagal.
10. WHEN halaman Dashboard dimuat, THE Quick_Links_Manager SHALL membaca dan menampilkan seluruh daftar Quick_Link dari Local_Storage.

---

### Requirement 5: Persistensi Data dengan Local Storage

**User Story:** Sebagai pengguna, saya ingin data Task dan Quick Link saya tersimpan secara otomatis, sehingga data saya tidak hilang meskipun saya menutup atau me-refresh browser.

#### Acceptance Criteria

1. WHEN terjadi perubahan pada daftar Task (tambah, edit, selesai, hapus), THE Dashboard SHALL menyimpan seluruh daftar Task dalam format JSON di bawah key `todo_dashboard_tasks` pada Local_Storage.
2. WHEN terjadi perubahan pada daftar Quick_Link (tambah, hapus), THE Dashboard SHALL menyimpan seluruh daftar Quick_Link dalam format JSON di bawah key `todo_dashboard_links` pada Local_Storage.
3. WHEN halaman Dashboard dimuat, THE Dashboard SHALL membaca key `todo_dashboard_tasks` dan `todo_dashboard_links` dari Local_Storage dan merestorasi state daftar Task dan Quick_Link sesuai data yang tersimpan.
4. IF Local_Storage tidak mengandung data Task saat halaman dimuat, THEN THE Todo_Manager SHALL menampilkan daftar Task yang kosong tanpa error.
5. IF Local_Storage tidak mengandung data Quick_Link saat halaman dimuat, THEN THE Quick_Links_Manager SHALL menampilkan daftar Quick_Link yang kosong tanpa error.
6. IF data yang tersimpan di Local_Storage tidak dapat di-parse sebagai JSON yang valid, THEN THE Dashboard SHALL mengabaikan data yang rusak, menginisialisasi kedua daftar sebagai kosong, dan merender keduanya tanpa pesan error kepada pengguna.

---

### Requirement 6: Kompatibilitas dan Struktur Aplikasi

**User Story:** Sebagai pengguna, saya ingin aplikasi dapat dijalankan di berbagai browser modern tanpa instalasi tambahan, sehingga saya dapat menggunakannya di perangkat apapun.

#### Acceptance Criteria

1. THE Dashboard SHALL dapat dijalankan di Chrome, Firefox, Edge, dan Safari pada versi mayor yang dirilis dalam 24 bulan terakhir, tanpa menggunakan framework JavaScript eksternal.
2. THE Dashboard SHALL dapat dibuka sebagai file HTML lokal (via protokol `file://`) maupun di-host pada web server tanpa perubahan kode.
3. THE Dashboard SHALL menggunakan tepat satu file CSS di dalam direktori `css/` dan tepat satu file JavaScript di dalam direktori `js/`.
4. THE Dashboard SHALL memuat dan menampilkan semua widget (Greeting, Focus Timer, To-Do List, Quick Links) dalam satu halaman tanpa navigasi ke halaman lain.
5. WHEN pengguna mengakses Dashboard pada layar dengan lebar minimal 320px, THE Dashboard SHALL menampilkan semua widget tanpa overflow horizontal (tidak ada elemen yang terpotong atau menyebabkan scrollbar horizontal).
6. IF pengguna mengakses Dashboard pada browser yang tidak mendukung Local Storage API, THEN THE Dashboard SHALL menampilkan pesan peringatan bahwa fitur penyimpanan tidak tersedia, dan tetap menampilkan semua widget meskipun data tidak dapat disimpan.

---

### Requirement 7: Responsivitas dan Performa UI

**User Story:** Sebagai pengguna, saya ingin interaksi dengan dashboard terasa cepat dan lancar, sehingga pengalaman menggunakan aplikasi tidak terganggu oleh kelambatan.

#### Acceptance Criteria

1. WHEN pengguna melakukan aksi pada UI (klik tombol, input teks), THE Dashboard SHALL memperbarui tampilan dalam waktu kurang dari 100ms.
2. THE Dashboard SHALL memuat seluruh antarmuka — didefinisikan sebagai semua widget (Greeting, Focus Timer, To-Do List, Quick Links) terrender dan interaktif — dalam waktu kurang dari 2 detik pada koneksi lokal (file://) atau jaringan dengan kecepatan unduh ≥ 10 Mbps.
3. WHILE Dashboard sedang aktif dan Greeting_Widget memperbarui tampilan waktu setiap detik, aksi UI lainnya (klik tombol, input teks) SHALL tetap merespons dalam waktu kurang dari 100ms.
