/**
 * Unit tests untuk Validator
 * Task 2.4 — Semua cabang validasi: kosong, whitespace, batas karakter, URL
 * Requirements: 3.2, 3.5, 4.2, 4.3
 */
import { describe, test, expect } from 'vitest';
import { Validator } from '../../js/app.js';

// ---------------------------------------------------------------
// Validator.isValidTaskText
// ---------------------------------------------------------------
describe('Validator.isValidTaskText', () => {
  test('menolak string kosong', () => {
    expect(Validator.isValidTaskText('').valid).toBe(false);
  });

  test('menolak string hanya whitespace', () => {
    expect(Validator.isValidTaskText('   ').valid).toBe(false);
    expect(Validator.isValidTaskText('\t\n').valid).toBe(false);
  });

  test('menolak non-string (null, undefined, number)', () => {
    expect(Validator.isValidTaskText(null).valid).toBe(false);
    expect(Validator.isValidTaskText(undefined).valid).toBe(false);
    expect(Validator.isValidTaskText(42).valid).toBe(false);
  });

  test('menerima teks 1 karakter', () => {
    expect(Validator.isValidTaskText('a').valid).toBe(true);
  });

  test('menerima teks tepat 255 karakter', () => {
    const text = 'a'.repeat(255);
    expect(Validator.isValidTaskText(text).valid).toBe(true);
  });

  test('menolak teks 256 karakter (melebihi batas)', () => {
    const text = 'a'.repeat(256);
    const result = Validator.isValidTaskText(text);
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  test('menolak teks > 255 karakter', () => {
    expect(Validator.isValidTaskText('x'.repeat(300)).valid).toBe(false);
  });

  test('menerima teks normal', () => {
    expect(Validator.isValidTaskText('Belajar desain sistem').valid).toBe(true);
  });

  test('hasil invalid mengandung reason string', () => {
    const result = Validator.isValidTaskText('');
    expect(typeof result.reason).toBe('string');
    expect(result.reason.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------
// Validator.isValidLinkLabel
// ---------------------------------------------------------------
describe('Validator.isValidLinkLabel', () => {
  test('menolak string kosong', () => {
    expect(Validator.isValidLinkLabel('').valid).toBe(false);
  });

  test('menolak string hanya whitespace', () => {
    expect(Validator.isValidLinkLabel('  ').valid).toBe(false);
  });

  test('menerima label 1 karakter', () => {
    expect(Validator.isValidLinkLabel('X').valid).toBe(true);
  });

  test('menerima label tepat 50 karakter', () => {
    expect(Validator.isValidLinkLabel('a'.repeat(50)).valid).toBe(true);
  });

  test('menolak label 51 karakter (melebihi batas)', () => {
    const result = Validator.isValidLinkLabel('a'.repeat(51));
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  test('menerima label normal seperti "GitHub"', () => {
    expect(Validator.isValidLinkLabel('GitHub').valid).toBe(true);
  });
});

// ---------------------------------------------------------------
// Validator.isValidUrl
// ---------------------------------------------------------------
describe('Validator.isValidUrl', () => {
  test('menerima URL https valid', () => {
    expect(Validator.isValidUrl('https://github.com').valid).toBe(true);
  });

  test('menerima URL http valid', () => {
    expect(Validator.isValidUrl('http://example.com').valid).toBe(true);
  });

  test('menolak URL kosong', () => {
    expect(Validator.isValidUrl('').valid).toBe(false);
  });

  test('menolak URL hanya whitespace', () => {
    expect(Validator.isValidUrl('   ').valid).toBe(false);
  });

  test('menolak protokol ftp://', () => {
    const result = Validator.isValidUrl('ftp://example.com');
    expect(result.valid).toBe(false);
  });

  test('menolak protokol javascript:', () => {
    // javascript: bukan http/https
    expect(Validator.isValidUrl('javascript:alert(1)').valid).toBe(false);
  });

  test('menolak format URL tidak valid (tanpa protokol)', () => {
    expect(Validator.isValidUrl('example.com').valid).toBe(false);
  });

  test('menolak URL melebihi 2048 karakter', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(2030);
    expect(longUrl.length).toBeGreaterThan(2048);
    expect(Validator.isValidUrl(longUrl).valid).toBe(false);
  });

  test('menerima URL tepat 2048 karakter', () => {
    // Buat URL valid tepat 2048 karakter
    const base = 'https://example.com/';
    const padding = 'a'.repeat(2048 - base.length);
    const url = base + padding;
    expect(url.length).toBe(2048);
    expect(Validator.isValidUrl(url).valid).toBe(true);
  });

  test('menolak URL dengan hostname kosong (mis. file:// tanpa host)', () => {
    // URL dengan protokol selain http/https harus ditolak
    expect(Validator.isValidUrl('file:///path/to/file').valid).toBe(false);
  });

  test('hasil invalid mengandung reason string', () => {
    const result = Validator.isValidUrl('');
    expect(typeof result.reason).toBe('string');
  });
});
