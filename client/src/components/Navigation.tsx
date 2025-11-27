/**
 * @file Navigation.tsx
 * @description Componente di navigazione principale dell'applicazione.
 * 
 * Renderizza la barra di navigazione sticky in alto con:
 * - Logo/brand dell'applicazione
 * - Link per navigare tra Search e Favorites (React Router)
 * - Badge con conteggio preferiti
 * 
 * Utilizza NavLink di React Router per gestire lo stato attivo.
 * Supporta dark mode tramite le classi Tailwind dark:*
 */

import { NavLink } from 'react-router-dom'

/**
 * Props per il componente Navigation.
 */
interface NavigationProps {
  /** Numero di foto nei preferiti (mostrato come badge) */
  favoritesCount: number;
}

/**
 * Componente di navigazione con link per switchare tra le route.
 * 
 * Caratteristiche:
 * - Sticky positioning: rimane fisso in alto durante lo scroll
 * - NavLink con stile attivo/inattivo automatico
 * - Badge numerico sui preferiti quando count > 0
 * - Logo con gradiente viola-rosa
 * 
 * @param props - Props di configurazione del componente
 * @returns Elemento nav con la barra di navigazione
 */
export default function Navigation({ favoritesCount }: NavigationProps) {
  // === CLASSI CSS ===
  
  /** Classi base comuni a tutti i link di navigazione */
  const linkClasses = "px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300";
  
  /** Classi aggiuntive per il link attivo (sfondo viola, testo bianco) */
  const activeLinkClasses = "bg-purple-600 text-white";
  
  /** Classi aggiuntive per i link inattivi (testo grigio, hover con sfondo) */
  const inactiveLinkClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  /**
   * Genera le classi CSS per un NavLink in base allo stato attivo.
   * Usato come callback per la prop className di NavLink.
   * 
   * @param isActive - true se il link corrisponde alla route corrente
   * @returns Stringa con le classi CSS appropriate
   */
  const getLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

  // === RENDERING ===

  return (
    // Nav sticky con z-index alto per rimanere sopra altri elementi
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Layout flex: logo a sinistra, navigazione a destra */}
        <div className="flex justify-between items-center h-20">
          
          {/* Logo/Brand con gradiente - link alla home */}
          <NavLink to="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
              Luxor
            </h1>
          </NavLink>
          
          {/* Link di navigazione */}
          <div className="flex items-center space-x-4">
            {/* Link Cerca */}
            <NavLink to="/" end className={getLinkClasses}>
              Cerca
            </NavLink>
            
            {/* Link Preferiti con badge */}
            <NavLink to="/favorites" className={(props) => `${getLinkClasses(props)} relative`}>
              <span>Preferiti</span>
              {/* Badge numerico - visibile solo se ci sono preferiti */}
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
