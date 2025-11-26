/**
 * Utility math functions
 */

export const add = (a: number, b: number): number => {
  return a + b
}

export const multiply = (a: number, b: number): number => {
  return a * b
}

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}

export const isEven = (n: number): boolean => {
  return n % 2 === 0
}
