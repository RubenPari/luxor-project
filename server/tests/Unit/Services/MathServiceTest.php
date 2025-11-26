<?php

namespace Tests\Unit\Services;

use App\Services\MathService;
use PHPUnit\Framework\TestCase;

class MathServiceTest extends TestCase
{
    private MathService $mathService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->mathService = new MathService();
    }

    public function test_add_two_positive_numbers(): void
    {
        $result = $this->mathService->add(5, 3);
        $this->assertEquals(8, $result);
    }

    public function test_add_negative_numbers(): void
    {
        $result = $this->mathService->add(-5, -3);
        $this->assertEquals(-8, $result);
    }

    public function test_multiply_two_numbers(): void
    {
        $result = $this->mathService->multiply(4, 5);
        $this->assertEquals(20, $result);
    }

    public function test_multiply_by_zero(): void
    {
        $result = $this->mathService->multiply(10, 0);
        $this->assertEquals(0, $result);
    }

    public function test_divide_two_numbers(): void
    {
        $result = $this->mathService->divide(10, 2);
        $this->assertEquals(5, $result);
    }

    public function test_divide_by_zero_throws_exception(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot divide by zero');
        
        $this->mathService->divide(10, 0);
    }

    public function test_is_even_returns_true_for_even_numbers(): void
    {
        $this->assertTrue($this->mathService->isEven(4));
        $this->assertTrue($this->mathService->isEven(0));
        $this->assertTrue($this->mathService->isEven(-6));
    }

    public function test_is_even_returns_false_for_odd_numbers(): void
    {
        $this->assertFalse($this->mathService->isEven(3));
        $this->assertFalse($this->mathService->isEven(7));
        $this->assertFalse($this->mathService->isEven(-5));
    }

    public function test_factorial_of_zero_returns_one(): void
    {
        $result = $this->mathService->factorial(0);
        $this->assertEquals(1, $result);
    }

    public function test_factorial_of_positive_number(): void
    {
        $this->assertEquals(1, $this->mathService->factorial(1));
        $this->assertEquals(2, $this->mathService->factorial(2));
        $this->assertEquals(6, $this->mathService->factorial(3));
        $this->assertEquals(24, $this->mathService->factorial(4));
        $this->assertEquals(120, $this->mathService->factorial(5));
    }

    public function test_factorial_of_negative_number_throws_exception(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Factorial is not defined for negative numbers');
        
        $this->mathService->factorial(-5);
    }
}
