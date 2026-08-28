/**
 * Property-based tests untuk GreetingController helper functions
 * Task 3.3 — Properties 1, 2, 3
 * Framework: fast-check (fc)
 */
import { describe, test } from 'vitest';
import fc from 'fast-check';
import { formatTime, formatDate, getGreeting } from '../../js/app.js';

// ---------------------------------------------------------------
// Property 1: Format Waktu Selalu HH:MM
// Validates: Requirements 1.1
// ---------------------------------------------------------------
describe('Property 1: formatTime selalu menghasilkan HH:MM', () => {
  test('untuk semua valid Date, output cocok pola HH:MM', () => {
    fc.assert(
      fc.property(fc.date({ noInvalidDate: true }), (date) => {
        const result = formatTime(date);
        // Harus tepat 5 karakter
        if (result.length !== 5) return false;
        // Karakter ke-3 (index 2) harus ':'
        if (result[2] !== ':') return false;
        // HH harus dua digit angka 0-9
        if (!/^\d{2}$/.test(result.slice(0, 2))) return false;
        // MM harus dua digit angka 0-9
        if (!/^\d{2}$/.test(result.slice(3, 5))) return false;
        // HH dalam range 00-23
        const hours = parseInt(result.slice(0, 2), 10);
        if (hours < 0 || hours > 23) return false;
        // MM dalam range 00-59
        const minutes = parseInt(result.slice(3, 5), 10);
        if (minutes < 0 || minutes > 59) return false;
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------
// Property 2: Format Tanggal Lengkap Bahasa Indonesia
// Validates: Requirements 1.2
// ---------------------------------------------------------------
describe('Property 2: formatDate menghasilkan tanggal Bahasa Indonesia lengkap', () => {
  const HARI_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BULAN_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  test('untuk semua valid Date, output mengandung hari, tanggal, bulan, tahun Bahasa Indonesia', () => {
    fc.assert(
      fc.property(fc.date({ noInvalidDate: true }), (date) => {
        const result = formatDate(date);
        // Mengandung nama hari Bahasa Indonesia yang sesuai
        const expectedDay = HARI_ID[date.getDay()];
        if (!result.includes(expectedDay)) return false;
        // Mengandung angka tanggal
        if (!result.includes(String(date.getDate()))) return false;
        // Mengandung nama bulan Bahasa Indonesia yang sesuai
        const expectedMonth = BULAN_ID[date.getMonth()];
        if (!result.includes(expectedMonth)) return false;
        // Mengandung tahun 4 digit
        if (!result.includes(String(date.getFullYear()))) return false;
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------
// Property 3: Sapaan Sesuai Rentang Waktu
// Validates: Requirements 1.3, 1.4, 1.5, 1.6
// ---------------------------------------------------------------
describe('Property 3: getGreeting mengembalikan sapaan yang benar untuk setiap jam', () => {
  test('untuk setiap jam 0-23, sapaan sesuai rentang yang ditentukan', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const result = getGreeting(hour);
        if (hour >= 5 && hour <= 11) return result === 'Selamat Pagi';
        if (hour >= 12 && hour <= 14) return result === 'Selamat Siang';
        if (hour >= 15 && hour <= 17) return result === 'Selamat Sore';
        // hour in {0,1,2,3,4,18,19,20,21,22,23}
        return result === 'Selamat Malam';
      }),
      { numRuns: 100 }
    );
  });
});
