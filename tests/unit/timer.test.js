/**
 * Unit tests untuk FocusTimerController
 * Task 4.4 — Transisi state machine dan formatTimer edge cases
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimer, FocusTimerController, timerState } from '../../js/app.js';

// ---------------------------------------------------------------
// formatTimer — batas nilai
// ---------------------------------------------------------------
describe('formatTimer', () => {
  test('0 detik → "00:00"', () => {
    expect(formatTimer(0)).toBe('00:00');
  });

  test('1500 detik (25 menit) → "25:00"', () => {
    expect(formatTimer(1500)).toBe('25:00');
  });

  test('90 detik → "01:30"', () => {
    expect(formatTimer(90)).toBe('01:30');
  });

  test('65 detik → "01:05"', () => {
    expect(formatTimer(65)).toBe('01:05');
  });

  test('59 detik → "00:59"', () => {
    expect(formatTimer(59)).toBe('00:59');
  });

  test('60 detik → "01:00"', () => {
    expect(formatTimer(60)).toBe('01:00');
  });

  test('nilai negatif dibulatkan ke 00:00', () => {
    expect(formatTimer(-10)).toBe('00:00');
  });

  test('nilai float di-floor: 90.9 → "01:30"', () => {
    expect(formatTimer(90.9)).toBe('01:30');
  });

  test('selalu menghasilkan format 5 karakter MM:SS', () => {
    [0, 1, 59, 60, 90, 1500].forEach(s => {
      const result = formatTimer(s);
      expect(result).toHaveLength(5);
      expect(result[2]).toBe(':');
    });
  });
});

// ---------------------------------------------------------------
// FocusTimerController — state machine transitions
// Menggunakan fake timers (vi.useFakeTimers) untuk menghindari
// dependency pada waktu nyata. DOM elemen di-mock agar _updateDisplay
// tidak melempar error karena getElementById mengembalikan null.
// ---------------------------------------------------------------
describe('FocusTimerController state machine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock DOM elements yang diakses oleh _updateDisplay
    const mockEl = () => ({
      textContent: '',
      disabled: false,
      classList: { remove: vi.fn(), add: vi.fn() },
      hidden: false,
    });
    vi.spyOn(document, 'getElementById').mockImplementation(() => mockEl());
    FocusTimerController.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('init() → state IDLE dengan remainingMs = 1.500.000', () => {
    const state = FocusTimerController.getState();
    expect(state.status).toBe('IDLE');
    expect(state.remainingMs).toBe(25 * 60 * 1000);
  });

  test('IDLE → RUNNING setelah start()', () => {
    FocusTimerController.start();
    expect(FocusTimerController.getState().status).toBe('RUNNING');
  });

  test('RUNNING → PAUSED setelah stop()', () => {
    FocusTimerController.start();
    FocusTimerController.stop();
    expect(FocusTimerController.getState().status).toBe('PAUSED');
  });

  test('PAUSED → RUNNING setelah start() kedua kali', () => {
    FocusTimerController.start();
    FocusTimerController.stop();
    FocusTimerController.start();
    expect(FocusTimerController.getState().status).toBe('RUNNING');
  });

  test('RUNNING → IDLE setelah reset()', () => {
    FocusTimerController.start();
    FocusTimerController.reset();
    const state = FocusTimerController.getState();
    expect(state.status).toBe('IDLE');
    expect(state.remainingMs).toBe(25 * 60 * 1000);
  });

  test('PAUSED → IDLE setelah reset()', () => {
    FocusTimerController.start();
    FocusTimerController.stop();
    FocusTimerController.reset();
    const state = FocusTimerController.getState();
    expect(state.status).toBe('IDLE');
    expect(state.remainingMs).toBe(25 * 60 * 1000);
  });

  test('IDLE → IDLE setelah reset() (no-op)', () => {
    FocusTimerController.reset();
    const state = FocusTimerController.getState();
    expect(state.status).toBe('IDLE');
    expect(state.remainingMs).toBe(25 * 60 * 1000);
  });

  test('stop() saat IDLE tidak mengubah state', () => {
    FocusTimerController.stop(); // tidak ada efek saat IDLE
    expect(FocusTimerController.getState().status).toBe('IDLE');
  });

  test('saat RUNNING, sisa waktu berkurang setelah 1 detik', () => {
    const initialMs = FocusTimerController.getState().remainingMs;
    FocusTimerController.start();
    vi.advanceTimersByTime(1000);
    const afterMs = FocusTimerController.getState().remainingMs;
    expect(afterMs).toBeLessThan(initialMs);
  });

  test('RUNNING → FINISHED saat countdown habis', () => {
    // Set remainingMs ke sangat kecil agar cepat selesai dalam test
    timerState.remainingMs = 500; // 500ms
    FocusTimerController.start();
    vi.advanceTimersByTime(1100); // lebih dari 500ms
    expect(FocusTimerController.getState().status).toBe('FINISHED');
    expect(FocusTimerController.getState().remainingMs).toBe(0);
  });

  test('FINISHED → IDLE setelah reset()', () => {
    timerState.remainingMs = 500;
    FocusTimerController.start();
    vi.advanceTimersByTime(1100);
    expect(FocusTimerController.getState().status).toBe('FINISHED');
    FocusTimerController.reset();
    const state = FocusTimerController.getState();
    expect(state.status).toBe('IDLE');
    expect(state.remainingMs).toBe(25 * 60 * 1000);
  });
});
