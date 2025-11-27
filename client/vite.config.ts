/**
 * @file vite.config.ts
 * @description Configurazione di Vite per il progetto Luxor client.
 * 
 * Questo file configura:
 * - Build e dev server Vite
 * - Plugin React per JSX/TSX
 * - Alias di percorso per import più puliti
 * - Vitest per unit testing
 * - Code coverage con v8
 * 
 * Reference types per TypeScript: abilita i tipi Vitest.
 */

/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Configurazione Vite.
 * Documentazione: https://vite.dev/config/
 */
export default defineConfig({
  /**
   * Plugin Vite.
   * - react(): abilita Fast Refresh e trasformazione JSX
   */
  plugins: [react()],
  
  /**
   * Configurazione della risoluzione dei moduli.
   */
  resolve: {
    /**
     * Alias di percorso per import più puliti.
     * Permette di usare '@/...' invece di percorsi relativi complessi.
     * 
     * @example
     * // Invece di: import { useFavorites } from '../../../contexts/FavoritesContext'
     * // Puoi scrivere: import { useFavorites } from '@/contexts/FavoritesContext'
     */
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  /**
   * Configurazione Vitest per unit testing.
   * Integrato direttamente in Vite (no config separato).
   */
  test: {
    /**
     * Abilita API globali (describe, it, expect, etc.)
     * senza bisogno di importarle esplicitamente.
     */
    globals: true,
    
    /**
     * Ambiente di test: jsdom simula un browser.
     * Necessario per testare componenti React che usano il DOM.
     */
    environment: 'jsdom',
    
    /**
     * File di setup eseguito prima di ogni test suite.
     * Configura matchers jest-dom e cleanup automatico.
     */
    setupFiles: './src/test/setup.ts',
    
    /**
     * Abilita il processing dei file CSS nei test.
     * Necessario se i componenti importano CSS modules.
     */
    css: true,
    
    /**
     * Configurazione code coverage.
     */
    coverage: {
      /** Provider v8 per la misurazione della copertura */
      provider: 'v8',
      
      /** Formati di report generati */
      reporter: ['text', 'json', 'html'],
      
      /** Pattern da escludere dalla copertura */
      exclude: [
        'node_modules/',      // Dipendenze esterne
        'src/test/',          // File di utility per i test
        '**/*.config.{js,ts}', // File di configurazione
        '**/dist/**',         // Build output
      ],
    },
  },
})
