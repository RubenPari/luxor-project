/**
 * @file setup.ts
 * @description File di setup globale per Vitest.
 * 
 * Questo file viene eseguito prima di ogni suite di test (configurato in vite.config.ts).
 * Configura l'ambiente di testing con:
 * - React disponibile globalmente per JSX
 * - Matchers di jest-dom per asserzioni sul DOM
 * - Cleanup automatico dopo ogni test
 * 
 * I matchers aggiunti permettono asserzioni come:
 * - toBeInTheDocument()
 * - toHaveTextContent()
 * - toBeVisible()
 * - etc.
 */

import React from 'react'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

/**
 * Rende React disponibile globalmente per il JSX nei test.
 * Necessario con alcune configurazioni di bundler che non
 * iniettano automaticamente React nel scope JSX.
 */
// @ts-ignore: aggiungiamo React a globalThis in modo dinamico
globalThis.React = React

/**
 * Estende l'oggetto expect di Vitest con i matchers di jest-dom.
 * Questo permette di usare asserzioni specifiche per il DOM come:
 * - expect(element).toBeInTheDocument()
 * - expect(element).toHaveClass('my-class')
 * - expect(element).toBeDisabled()
 */
expect.extend(matchers)

/**
 * Cleanup automatico dopo ogni test.
 * Rimuove tutti i componenti renderizzati per evitare
 * interferenze tra test e memory leak.
 */
afterEach(() => {
  cleanup()
})
