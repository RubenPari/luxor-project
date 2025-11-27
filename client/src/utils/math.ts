/**
 * @file math.ts
 * @description Funzioni di utilità matematica.
 * 
 * Questo modulo fornisce funzioni matematiche di base riutilizzabili
 * in tutta l'applicazione. Include operazioni aritmetiche fondamentali
 * con gestione degli errori (es. divisione per zero).
 * 
 * Principalmente utilizzato per scopi dimostrativi e testing.
 */

/**
 * Somma due numeri.
 * 
 * @param a - Primo addendo
 * @param b - Secondo addendo
 * @returns La somma di a e b
 * 
 * @example
 * add(2, 3) // => 5
 * add(-1, 1) // => 0
 */
export const add = (a: number, b: number): number => {
  return a + b
}

/**
 * Moltiplica due numeri.
 * 
 * @param a - Primo fattore
 * @param b - Secondo fattore
 * @returns Il prodotto di a e b
 * 
 * @example
 * multiply(4, 5) // => 20
 * multiply(-2, 3) // => -6
 */
export const multiply = (a: number, b: number): number => {
  return a * b
}

/**
 * Divide due numeri con controllo divisione per zero.
 * 
 * @param a - Dividendo (numeratore)
 * @param b - Divisore (denominatore) - non può essere zero
 * @returns Il quoziente di a diviso b
 * @throws Error se b è zero ("Cannot divide by zero")
 * 
 * @example
 * divide(10, 2) // => 5
 * divide(7, 2) // => 3.5
 * divide(5, 0) // => throws Error
 */
export const divide = (a: number, b: number): number => {
  // Verifica che il divisore non sia zero
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}

/**
 * Verifica se un numero è pari.
 * 
 * @param n - Numero da verificare
 * @returns true se n è pari, false se è dispari
 * 
 * @example
 * isEven(4) // => true
 * isEven(7) // => false
 * isEven(0) // => true
 */
export const isEven = (n: number): boolean => {
  // Usa operatore modulo: resto 0 = pari
  return n % 2 === 0
}
