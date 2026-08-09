<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Error\OptionsValidationError;
use DiceBear\Error\ValidationError;
use DiceBear\Options;
use PHPUnit\Framework\TestCase;

class OptionsTest extends TestCase
{
    // constructor

    public function testAcceptsEmptyData(): void
    {
        $this->assertNotNull(new Options([]));
    }

    public function testAcceptsFullInputData(): void
    {
        $options = new Options([
            'seed' => 'test-seed',
            'size' => 128,
            'flip' => 'horizontal',
            'scale' => 1.2,
        ]);
        $this->assertNotNull($options);
    }

    public function testThrowsOptionsValidationError(): void
    {
        $this->expectException(OptionsValidationError::class);
        new Options(['size' => -1]);
    }

    public function testThrowsValidationError(): void
    {
        $this->expectException(ValidationError::class);
        new Options(['size' => -1]);
    }

    public function testErrorIncludesDetails(): void
    {
        try {
            new Options(['size' => -1]);
            $this->fail('Expected error');
        } catch (OptionsValidationError $e) {
            $this->assertIsArray($e->details);
            $this->assertGreaterThan(0, count($e->details));
        }
    }

    // scalar passthroughs

    public function testScalarsReturnNullWhenUnset(): void
    {
        $options = new Options([]);
        $this->assertNull($options->seed());
        $this->assertNull($options->size());
        $this->assertNull($options->idRandomization());
        $this->assertNull($options->title());
    }

    public function testScalarsReturnUserSetValues(): void
    {
        $options = new Options([
            'seed' => 'abc',
            'size' => 256,
            'idRandomization' => true,
            'title' => 'My Avatar',
        ]);
        $this->assertSame('abc', $options->seed());
        $this->assertSame(256, $options->size());
        $this->assertTrue($options->idRandomization());
        $this->assertSame('My Avatar', $options->title());
    }

    // top-level normalization

    public function testNormalizesScalarListToOneElementList(): void
    {
        $options = new Options(['flip' => 'horizontal']);
        $this->assertSame(['horizontal'], $options->flip());
    }

    public function testPassesListArrayThrough(): void
    {
        $options = new Options(['flip' => ['horizontal', 'vertical']]);
        $this->assertSame(['horizontal', 'vertical'], $options->flip());
    }

    public function testNormalizesScalarRangeToFixedValue(): void
    {
        $options = new Options(['scale' => 1.5]);
        $this->assertSame(['min' => 1.5, 'max' => 1.5], $options->scale());
    }

    public function testNormalizesRangeTupleToObject(): void
    {
        $options = new Options(['scale' => [0.8, 1.2]]);
        $this->assertSame(['min' => 0.8, 'max' => 1.2], $options->scale());
    }

    public function testSingleElementRangeArrayIsAFixedValue(): void
    {
        // `[n]` behaves like the scalar `n`; an empty array is unset (default).
        $this->assertSame(['min' => 2, 'max' => 2], (new Options(['scale' => [2]]))->scale());
        $this->assertNull((new Options(['scale' => []]))->scale());
    }

    public function testReturnsNullForUnsetRangeOptions(): void
    {
        $options = new Options([]);
        $this->assertNull($options->scale());
        $this->assertNull($options->borderRadius());
        $this->assertNull($options->rotate());
        $this->assertNull($options->translateX());
        $this->assertNull($options->translateY());
    }

    public function testReturnsEmptyArrayForUnsetListOptions(): void
    {
        $options = new Options([]);
        $this->assertSame([], $options->flip());
        $this->assertSame([], $options->fontFamily());
        $this->assertSame([], $options->fontWeight());
    }

    // componentVariant()

    public function testComponentVariantReturnsNullWhenUnset(): void
    {
        $this->assertNull((new Options([]))->componentVariant('eyes'));
    }

    public function testComponentVariantNormalizesStringToWeightedMap(): void
    {
        $options = new Options(['eyesVariant' => 'open']);
        $this->assertSame(['open' => 1], $options->componentVariant('eyes'));
    }

    public function testComponentVariantNormalizesListToWeightedMap(): void
    {
        $options = new Options(['eyesVariant' => ['open', 'closed']]);
        $this->assertSame(['open' => 1, 'closed' => 1], $options->componentVariant('eyes'));
    }

    public function testComponentVariantPassesWeightedRecordThrough(): void
    {
        $options = new Options(['eyesVariant' => ['open' => 5, 'closed' => 1]]);
        $this->assertSame(['open' => 5, 'closed' => 1], $options->componentVariant('eyes'));
    }

    // componentProbability()

    public function testComponentProbabilityReturnsNullWhenUnset(): void
    {
        $this->assertNull((new Options([]))->componentProbability('eyes'));
    }

    public function testComponentProbabilityReturnsValue(): void
    {
        $options = new Options(['eyesProbability' => 80]);
        $this->assertSame(80, $options->componentProbability('eyes'));
    }

    // color()

    public function testColorReturnsNullWhenUnset(): void
    {
        $this->assertNull((new Options([]))->color('skin'));
    }

    public function testColorNormalizesSingleHex(): void
    {
        $options = new Options(['skinColor' => '#f0c8a0']);
        $this->assertSame(['#f0c8a0'], $options->color('skin'));
    }

    public function testColorPassesListThrough(): void
    {
        $options = new Options(['skinColor' => ['#f0c8a0', '#d4a574']]);
        $this->assertSame(['#f0c8a0', '#d4a574'], $options->color('skin'));
    }

    // colorFill / colorAngle / colorFillStops

    public function testColorMetaNormalizes(): void
    {
        $options = new Options([
            'skinColorFill' => 'linear',
            'skinColorAngle' => 45,
            'skinColorFillStops' => [2, 4],
        ]);
        $this->assertSame(['linear'], $options->colorFill('skin'));
        $this->assertSame(['min' => 45, 'max' => 45], $options->colorAngle('skin'));
        $this->assertSame(['min' => 2, 'max' => 4], $options->colorFillStops('skin'));
    }

    public function testColorMetaDefaultsWhenUnset(): void
    {
        $options = new Options([]);
        $this->assertSame([], $options->colorFill('skin'));
        $this->assertNull($options->colorAngle('skin'));
        $this->assertNull($options->colorFillStops('skin'));
    }

    // colorOrder()

    public function testColorOrderReturnsNullWhenUnset(): void
    {
        $this->assertNull((new Options([]))->colorOrder('skin'));
    }

    public function testColorOrderPassesValueThrough(): void
    {
        $options = new Options(['skinColorOrder' => 'fixed']);
        $this->assertSame('fixed', $options->colorOrder('skin'));
    }

    public function testColorOrderRejectsUnknownValue(): void
    {
        $this->expectException(OptionsValidationError::class);
        new Options(['skinColorOrder' => 'sorted']);
    }

    public function testColorOrderRejectsListValue(): void
    {
        $this->expectException(OptionsValidationError::class);
        new Options(['skinColorOrder' => ['fixed']]);
    }
}
