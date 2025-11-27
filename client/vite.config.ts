/**
 * @file vite.config.ts
 * @description Configurazione di Vite per il progetto Luxor client.
 * 
 * Questo file configura:
 * - Build e dev server Vite
 * - Plugin React per JSX/TSX
 * - Alias di percorso per import più puliti
 * 
 * La configurazione di Vitest è in vitest.config.ts.
 */

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
})
