interface NavigationProps {
  currentView: 'search' | 'favorites';
  onViewChange: (view: 'search' | 'favorites') => void;
  favoritesCount: number;
}

export default function Navigation({ currentView, onViewChange, favoritesCount }: NavigationProps) {
  const linkClasses = "px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300";
  const activeLinkClasses = "bg-purple-600 text-white";
  const inactiveLinkClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
              Luxor
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onViewChange('search')}
              className={`${linkClasses} ${currentView === 'search' ? activeLinkClasses : inactiveLinkClasses}`}
            >
              Search
            </button>
            <button 
              onClick={() => onViewChange('favorites')}
              className={`${linkClasses} ${currentView === 'favorites' ? activeLinkClasses : inactiveLinkClasses} relative`}
            >
              <span>Favorites</span>
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
