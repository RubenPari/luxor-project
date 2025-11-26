import React from 'react'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Rende React disponibile globalmente per il JSX nei test
// (utile con alcune configurazioni di bundler)
// @ts-expect-error: aggiungiamo React a globalThis in modo dinamico
globalThis.React = React

// Estende expect di Vitest con i matchers di jest-dom
expect.extend(matchers)

// Cleanup dopo ogni test
afterEach(() => {
  cleanup()
})
