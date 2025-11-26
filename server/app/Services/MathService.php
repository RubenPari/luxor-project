<?php

namespace App\Services;

class MathService
{
    /**
     * Calculate the sum of two numbers
     */
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }

    /**
     * Calculate the product of two numbers
     */
    public function multiply(float $a, float $b): float
    {
        return $a * $b;
    }

    /**
     * Divide two numbers
     * 
     * @throws \InvalidArgumentException
     */
    public function divide(float $a, float $b): float
    {
        if ($b === 0.0) {
            throw new \InvalidArgumentException('Cannot divide by zero');
        }
        
        return $a / $b;
    }

    /**
     * Check if a number is even
     */
    public function isEven(int $number): bool
    {
        return $number % 2 === 0;
    }

    /**
     * Calculate factorial of a number
     */
    public function factorial(int $n): int
    {
        if ($n < 0) {
            throw new \InvalidArgumentException('Factorial is not defined for negative numbers');
        }
        
        if ($n === 0 || $n === 1) {
            return 1;
        }
        
        $result = 1;
        for ($i = 2; $i <= $n; $i++) {
            $result *= $i;
        }
        
        return $result;
    }
}
