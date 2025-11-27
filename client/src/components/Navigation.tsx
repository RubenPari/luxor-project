/**
 * @file Navigation.tsx
 * @description Componente di navigazione principale dell'applicazione.
 * 
 * Renderizza la barra di navigazione sticky in alto con:
 * - Logo/brand dell'applicazione
 * - Pulsanti per switchare tra Search e Favorites
 * - Badge con conteggio preferiti
 * 
 * Supporta dark mode tramite le classi Tailwind dark:*
 */

/**
 * Props per il componente Navigation.
 */
interface NavigationProps {
  /** Vista attualmente attiva ('search' o 'favorites') */
  currentView: 'search' | 'favorites';
  /** Callback invocata quando l'utente cambia vista */
  onViewChange: (view: 'search' | 'favorites') => void;
  /** Numero di foto nei preferiti (mostrato come badge) */
  favoritesCount: number;
}

/**
 * Componente di navigazione con tab per switchare tra le viste.
 * 
 * Caratteristiche:
 * - Sticky positioning: rimane fisso in alto durante lo scroll
 * - Stile attivo/inattivo per i pulsanti di navigazione
 * - Badge numerico sui preferiti quando count > 0
 * - Logo con gradiente viola-rosa
 * 
 * @param props - Props di configurazione del componente
 * @returns Elemento nav con la barra di navigazione
 */
export default function Navigation({ currentView, onViewChange, favoritesCount }: NavigationProps) {
  // === CLASSI CSS ===
  
  /** Classi base comuni a tutti i link di navigazione */
  const linkClasses = "px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300";
  
  /** Classi aggiuntive per il link attivo (sfondo viola, testo bianco) */
  const activeLinkClasses = "bg-purple-600 text-white";
  
  /** Classi aggiuntive per i link inattivi (testo grigio, hover con sfondo) */
  const inactiveLinkClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  // === RENDERING ===

  return (
    // Nav sticky con z-index alto per rimanere sopra altri elementi
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Layout flex: logo a sinistra, navigazione a destra */}
        <div className="flex justify-between items-center h-20">
          
          {/* Logo/Brand con gradiente */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
              Luxor
            </h1>
          </div>
          
          {/* Pulsanti di navigazione */}
          <div className="flex items-center space-x-4">
            {/* Pulsante Cerca */}
            <button 
              onClick={() => onViewChange('search')}
              className={`${linkClasses} ${currentView === 'search' ? activeLinkClasses : inactiveLinkClasses}`}
            >
              Cerca
            </button>
            
            {/* Pulsante Preferiti con badge */}
            <button 
              onClick={() => onViewChange('favorites')}
              className={`${linkClasses} ${currentView === 'favorites' ? activeLinkClasses : inactiveLinkClasses} relative`}
            >
              <span>Preferiti</span>
              {/* Badge numerico - visibile solo se ci sono preferiti */}
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
