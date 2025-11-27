/**
 * @file unsplash.ts
 * @description Definizioni TypeScript per i tipi di dati utilizzati nell'applicazione Luxor.
 * Contiene le interfacce per le foto di Unsplash, le risposte API e i preferiti.
 * 
 * Queste interfacce modellano la struttura dei dati ricevuti dall'API Unsplash
 * e dal backend Laravel per la gestione dei preferiti.
 */

/**
 * Interfaccia che rappresenta una singola foto restituita dall'API Unsplash.
 * Contiene tutte le informazioni relative alla foto, inclusi URL, dimensioni,
 * descrizioni e informazioni sull'autore.
 */
export interface UnsplashPhoto {
  /** Identificativo univoco della foto su Unsplash */
  id: string;
  /** Larghezza originale della foto in pixel */
  width: number;
  /** Altezza originale della foto in pixel */
  height: number;
  /** Descrizione della foto fornita dal fotografo (può essere null) */
  description: string | null;
  /** Testo alternativo per l'accessibilità (può essere null) */
  alt_description: string | null;
  /**
   * Oggetto contenente gli URL della foto in diverse risoluzioni.
   * - raw: URL originale senza modifiche
   * - full: Versione a piena risoluzione
   * - regular: Versione standard (1080px di larghezza)
   * - small: Versione ridotta (400px di larghezza)
   * - thumb: Miniatura (200px di larghezza)
   */
  urls: {
    raw: string | null;
    full: string | null;
    regular: string | null;
    small: string | null;
    thumb: string | null;
  };
  /**
   * Oggetto contenente i link relativi alla foto.
   * - self: Link all'endpoint API della foto
   * - html: Link alla pagina web della foto su Unsplash
   * - download: Link per scaricare la foto
   */
  links: {
    self: string | null;
    html: string | null;
    download: string | null;
  };
  /**
   * Informazioni sul fotografo che ha scattato la foto.
   * Include ID, username, nome visualizzato, portfolio e immagine profilo.
   */
  user: {
    /** ID univoco dell'utente su Unsplash */
    id: string | null;
    /** Username dell'utente (usato nell'URL del profilo) */
    username: string | null;
    /** Nome completo visualizzato dell'utente */
    name: string | null;
    /** URL del portfolio esterno dell'utente */
    portfolio_url: string | null;
    /** URL dell'immagine del profilo dell'utente */
    profile_image: string | null;
  };
  /** Data e ora di creazione della foto in formato ISO 8601 */
  created_at: string;
}

/**
 * Interfaccia per la risposta dell'API di ricerca foto Unsplash.
 * Incapsula il risultato della ricerca con metadati per la paginazione.
 */
export interface UnsplashSearchResponse {
  /** Indica se la richiesta è andata a buon fine */
  success: boolean;
  /** Oggetto contenente i risultati della ricerca */
  data: {
    /** Array delle foto trovate */
    results: UnsplashPhoto[];
    /** Numero totale di foto che corrispondono alla query */
    total: number;
    /** Numero totale di pagine disponibili */
    total_pages: number;
  };
  /** Messaggio opzionale (es. in caso di errore o avviso) */
  message?: string;
  /** Dettaglio dell'errore se la richiesta è fallita */
  error?: string;
}

/**
 * Interfaccia che rappresenta un elemento preferito salvato nel database.
 * Combina l'ID interno del database con i dati completi della foto Unsplash.
 */
export interface Favorite {
  /** ID auto-incrementale del record nel database */
  id: number;
  /** ID dell'utente proprietario del preferito (null se anonimo) */
  user_id: number | null;
  /** ID della foto Unsplash associata */
  photo_id: string;
  /** Dati completi della foto Unsplash salvati come JSON */
  photo_data: UnsplashPhoto;
  /** Timestamp di creazione del record */
  created_at: string;
  /** Timestamp dell'ultimo aggiornamento del record */
  updated_at: string;
}

/**
 * Interfaccia generica per le risposte delle API dei preferiti.
 * Utilizzata per standardizzare le risposte di GET, POST e DELETE.
 */
export interface FavoriteResponse {
  /** Indica se l'operazione è andata a buon fine */
  success: boolean;
  /** Dati restituiti: singolo Favorite o array di Favorite */
  data?: Favorite | Favorite[];
  /** Messaggio informativo o di errore */
  message?: string;
  /** Dettaglio tecnico dell'errore */
  error?: string;
}
