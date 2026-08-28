/**
 * Unit tests untuk GreetingController helper functions
 * Task 3.4 — Batas pergantian Time_Of_Day dan edge cases
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTime, formatDate, getGreeting } from '../../js/app.js';

// ---------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------
describe('formatTime', () => {
  test('format tengah malam → "00:00"', () => {
    const d = new Date(2024, 7, 26, 0, 0, 0);
    expect(formatTime(d)).toBe('00:00');
  });

  test('format jam 9 menit 5 → "09:05"', () => {
    const d = new Date(2024, 7, 26, 9, 5, 30);
    expect(formatTime(d)).toBe('09:05');
  });

  test('format jam 23 menit 59 → "23:59"', () => {
    const d = new Date(2024, 7, 26, 23, 59, 0);
    expect(formatTime(d)).toBe('23:59');
  });

  test('format jam 12 menit 0 → "12:00"', () => {
    const d = new Date(2024, 7, 26, 12, 0, 0);
    expect(formatTime(d)).toBe('12:00');
  });

  test('selalu menghasilkan format 5 karakter HH:MM', () => {
    const d = new Date(2024, 7, 26, 8, 3, 0);
    const result = formatTime(d);
    expect(result).toHaveLength(5);
    expect(result[2]).toBe(':');
  });
});

// ---------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------
describe('formatDate', () => {
  test('format 26 Agustus 2024 (Senin)', () => {
    const d = new Date(2024, 7, 26); // Bulan 0-indexed: 7 = Agustus
    const result = formatDate(d);
    expect(result).toContain('Senin');
    expect(result).toContain('26');
    expect(result).toContain('Agustus');
    expect(result).toContain('2024');
  });

  test('mengandung nama hari Bahasa Indonesia', () => {
    const HARI_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(2024, 7, 26);
    const result = formatDate(d);
    const containsDay = HARI_ID.some(h => result.includes(h));
    expect(containsDay).toBe(true);
  });

  test('mengandung nama bulan Bahasa Indonesia', () => {
    const BULAN_ID = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const d = new Date(2024, 0, 15); // Januari
    const result = formatDate(d);
    const containsMonth = BULAN_ID.some(b => result.includes(b));
    expect(containsMonth).toBe(true);
  });

  test('format 1 Januari 2024 (Senin)', () => {
    const d = new Date(2024, 0, 1);
    const result = formatDate(d);
    expect(result).toContain('Januari');
    expect(result).toContain('2024');
  });

  test('semua 12 bulan diformat dengan benar', () => {
    const BULAN_ID = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    for (let m = 0; m < 12; m++) {
      const d = new Date(2024, m, 15);
      const result = formatDate(d);
      expect(result).toContain(BULAN_ID[m]);
    }
  });
});

// ---------------------------------------------------------------
// getGreeting — batas pergantian Time_Of_Day
// ---------------------------------------------------------------
describe('getGreeting', () => {
  // Batas tepat sesuai spesifikasi
  test('jam 4 (04:xx) → Selamat Malam', () => {
    expect(getGreeting(4)).toBe('Selamat Malam');
  });

  test('jam 5 (05:xx) → Selamat Pagi (batas bawah Pagi)', () => {
    expect(getGreeting(5)).toBe('Selamat Pagi');
  });

  test('jam 11 (11:xx) → Selamat Pagi (batas atas Pagi)', () => {
    expect(getGreeting(11)).toBe('Selamat Pagi');
  });

  test('jam 12 (12:xx) → Selamat Siang (batas bawah Siang)', () => {
    expect(getGreeting(12)).toBe('Selamat Siang');
  });

  test('jam 14 (14:xx) → Selamat Siang (batas atas Siang)', () => {
    expect(getGreeting(14)).toBe('Selamat Siang');
  });

  test('jam 15 (15:xx) → Selamat Sore (batas bawah Sore)', () => {
    expect(getGreeting(15)).toBe('Selamat Sore');
  });

  test('jam 17 (17:xx) → Selamat Sore (batas atas Sore)', () => {
    expect(getGreeting(17)).toBe('Selamat Sore');
  });

  test('jam 18 (18:xx) → Selamat Malam (batas bawah Malam)', () => {
    expect(getGreeting(18)).toBe('Selamat Malam');
  });

  test('jam 23 → Selamat Malam', () => {
    expect(getGreeting(23)).toBe('Selamat Malam');
  });

  test('jam 0 (tengah malam) → Selamat Malam', () => {
    expect(getGreeting(0)).toBe('Selamat Malam');
  });

  // Pergantian jam yang kritis sesuai task 3.4
  test('transisi 11→12: jam 11 Pagi, jam 12 Siang', () => {
    expect(getGreeting(11)).toBe('Selamat Pagi');
    expect(getGreeting(12)).toBe('Selamat Siang');
  });

  test('transisi 14→15: jam 14 Siang, jam 15 Sore', () => {
    expect(getGreeting(14)).toBe('Selamat Siang');
    expect(getGreeting(15)).toBe('Selamat Sore');
  });

  test('transisi 17→18: jam 17 Sore, jam 18 Malam', () => {
    expect(getGreeting(17)).toBe('Selamat Sore');
    expect(getGreeting(18)).toBe('Selamat Malam');
  });

  test('transisi 4→5: jam 4 Malam, jam 5 Pagi', () => {
    expect(getGreeting(4)).toBe('Selamat Malam');
    expect(getGreeting(5)).toBe('Selamat Pagi');
  });
});
