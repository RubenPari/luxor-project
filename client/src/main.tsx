/**
 * @file main.tsx
 * @description Entry point dell'applicazione React Luxor.
 * 
 * Questo file è responsabile del bootstrap dell'applicazione:
 * - Monta l'app React nel DOM
 * - Configura i provider globali (BrowserRouter, FavoritesContext)
 * - Abilita StrictMode per rilevare problemi durante lo sviluppo
 * 
 * L'ordine dei provider è importante: i context più interni possono
 * accedere a quelli più esterni, ma non viceversa.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'  // Stili globali Tailwind
import App from './App.tsx'
import { FavoritesProvider } from './contexts/FavoritesContext'

/**
 * Monta l'applicazione React nel DOM.
 * 
 * - StrictMode: attiva controlli aggiuntivi in development per identificare
 *   effetti collaterali impuri, API deprecate e altri potenziali problemi.
 *   Non ha effetto in produzione.
 * 
 * - BrowserRouter: provider per React Router, abilita la navigazione
 *   client-side tramite History API del browser.
 * 
 * - FavoritesProvider: fornisce il context dei preferiti a tutta l'app,
 *   permettendo a qualsiasi componente di accedere e modificare i preferiti.
 * 
 * - App: componente radice che gestisce le route.
 * 
 * Il non-null assertion (!) su getElementById è sicuro perché index.html
 * contiene sempre un elemento con id="root".
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
