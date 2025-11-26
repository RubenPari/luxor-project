import { describe, it, expect } from 'vitest'
import { add, multiply, divide, isEven } from './math'

describe('Math Utilities', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('adds negative numbers', () => {
      expect(add(-2, -3)).toBe(-5)
    })

    it('adds zero', () => {
      expect(add(5, 0)).toBe(5)
    })
  })

  describe('multiply', () => {
    it('multiplies two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12)
    })

    it('multiplies by zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })

    it('multiplies negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6)
    })
  })

  describe('divide', () => {
    it('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('throws error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero')
    })

    it('handles decimal results', () => {
      expect(divide(5, 2)).toBe(2.5)
    })
  })

  describe('isEven', () => {
    it('returns true for even numbers', () => {
      expect(isEven(4)).toBe(true)
      expect(isEven(0)).toBe(true)
    })

    it('returns false for odd numbers', () => {
      expect(isEven(3)).toBe(false)
      expect(isEven(7)).toBe(false)
    })

    it('handles negative numbers', () => {
      expect(isEven(-4)).toBe(true)
      expect(isEven(-3)).toBe(false)
    })
  })
})
