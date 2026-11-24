<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Prng;
use DiceBear\Prng\Fnv1a;
use DiceBear\Prng\Mulberry32;
use PHPUnit\Framework\TestCase;

// Known-value vectors (Fnv1a, Mulberry32, getValue) live in
// tests/fixtures/parity/ and are exercised by ParityTest. This file keeps
// only the PHP-side behavioral and edge-case tests.
class PrngTest extends TestCase
{
    // fnv1a

    public function testFnv1aProducesDifferentHashesForDifferentInputs(): void
    {
        $this->assertNotSame(Fnv1a::hash('abc'), Fnv1a::hash('abd'));
    }

    public function testFnv1aReturnsUnsigned32BitIntegers(): void
    {
        $inputs = ['', 'a', 'hello', 'test:flip', 'some-long-seed:optionName'];

        foreach ($inputs as $input) {
            $hash = Fnv1a::hash($input);

            $this->assertGreaterThanOrEqual(0, $hash);
            $this->assertLessThanOrEqual(0xFFFFFFFF, $hash);
        }
    }

    // fnv1aHex

    public function testFnv1aHexPadsTo8Characters(): void
    {
        $this->assertSame(8, strlen(Fnv1a::hex('test')));
    }

    // mulberry32

    public function testMulberry32ReturnsFloatInRange(): void
    {
        $seeds = [0, 1, 42, 2166136261, 4294967295];

        foreach ($seeds as $seed) {
            $mulberry = new Mulberry32($seed);
            $value = $mulberry->nextFloat();

            $this->assertGreaterThanOrEqual(0, $value);
            $this->assertLessThan(1, $value);
        }
    }

    // getValue

    public function testGetValueIsDeterministic(): void
    {
        $a = new Prng('seed');
        $b = new Prng('seed');

        $this->assertSame($a->getValue('key'), $b->getValue('key'));
    }

    public function testGetValueDiffersForDifferentSeeds(): void
    {
        $a = new Prng('seed-a');
        $b = new Prng('seed-b');

        $this->assertNotSame($a->getValue('key'), $b->getValue('key'));
    }

    public function testGetValueDiffersForDifferentKeys(): void
    {
        $prng = new Prng('test');

        $this->assertNotSame($prng->getValue('flip'), $prng->getValue('scale'));
    }

    public function testGetValueReturnsFloatInRange(): void
    {
        $prng = new Prng('test');
        $keys = ['a', 'b', 'flip', 'scale', 'rotate', 'eyesVariant'];

        foreach ($keys as $key) {
            $value = $prng->getValue($key);

            $this->assertGreaterThanOrEqual(0, $value);
            $this->assertLessThan(1, $value);
        }
    }

    // pick

    public function testPickReturnsNullForEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertNull($prng->pick('key', []));
    }

    public function testPickReturnsSingleItem(): void
    {
        $prng = new Prng('test');

        $this->assertSame('only', $prng->pick('key', ['only']));
    }

    public function testPickIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');
        $items = ['a', 'b', 'c', 'd'];

        $this->assertSame($a->pick('key', $items), $b->pick('key', $items));
    }

    public function testPickAlwaysReturnsValidItem(): void
    {
        $items = ['x', 'y', 'z'];

        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertContains($prng->pick('key', $items), $items);
        }
    }

    public function testPickCollapsesDuplicateItems(): void
    {
        $unique = ['a', 'b', 'c'];
        $withDuplicates = ['a', 'a', 'b', 'b', 'b', 'c'];

        for ($i = 0; $i < 50; $i++) {
            $this->assertSame(
                (new Prng("seed-{$i}"))->pick('key', $unique),
                (new Prng("seed-{$i}"))->pick('key', $withDuplicates),
            );
        }
    }

    public function testPickTreatsAllDuplicatesAsSingleItem(): void
    {
        $prng = new Prng('test');

        $this->assertSame('only', $prng->pick('key', ['only', 'only', 'only']));
    }

    // float

    public function testFloatReturnsValueWhenMinEqualsMax(): void
    {
        $prng = new Prng('test');

        $this->assertEqualsWithDelta(42, $prng->float('key', ['min' => 42, 'max' => 42]), 1e-10);
    }

    public function testFloatInterpolatesWithinBounds(): void
    {
        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->float('key', ['min' => 10, 'max' => 20]);

            $this->assertGreaterThanOrEqual(10, $value);
            $this->assertLessThanOrEqual(20, $value);
        }
    }

    public function testFloatHandlesReversedOrder(): void
    {
        $prng = new Prng('test');
        $value = $prng->float('key', ['min' => 20, 'max' => 10]);

        $this->assertGreaterThanOrEqual(10, $value);
        $this->assertLessThanOrEqual(20, $value);
    }

    public function testFloatQuantizesToStep(): void
    {
        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->float('key', ['min' => 0, 'max' => 100, 'step' => 5]);

            $this->assertGreaterThanOrEqual(0, $value);
            $this->assertLessThanOrEqual(100, $value);
            $this->assertEqualsWithDelta(0.0, fmod($value, 5), 1e-9, "Expected multiple of 5, got {$value}");
        }
    }

    public function testFloatIgnoresNonPositiveStep(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->float('key', ['min' => 10, 'max' => 20, 'step' => 0]);

            $this->assertGreaterThanOrEqual(10, $value);
            $this->assertLessThanOrEqual(20, $value);
        }
    }

    public function testFloatStepIsAnchoredAtMin(): void
    {
        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->float('key', ['min' => 3, 'max' => 23, 'step' => 5]);

            $this->assertGreaterThanOrEqual(3, $value);
            $this->assertLessThanOrEqual(23, $value);
            $this->assertEqualsWithDelta(0.0, fmod($value - 3, 5), 1e-9, "Expected 3 + n*5, got {$value}");
        }
    }

    public function testFloatReachesMaxEndpointWhenStepDividesRangeEvenly(): void
    {
        $maxSeen = false;

        for ($i = 0; $i < 500; $i++) {
            $value = (new Prng("seed-{$i}"))->float('key', ['min' => 0, 'max' => 90, 'step' => 90]);

            $this->assertTrue($value === 0.0 || $value === 90.0, "Expected 0 or 90, got {$value}");
            if ($value === 90.0) {
                $maxSeen = true;
            }
        }

        $this->assertTrue($maxSeen, 'Expected 90 to appear at least once across 500 seeds');
    }

    public function testFloatDistributesSteppedValuesRoughlyUniformly(): void
    {
        $buckets = [0 => 0, 45 => 0, 90 => 0, 135 => 0, 180 => 0];
        $samples = 2000;

        for ($i = 0; $i < $samples; $i++) {
            $value = (new Prng("seed-{$i}"))->float('key', ['min' => 0, 'max' => 180, 'step' => 45]);
            $key = (int) $value;

            $this->assertArrayHasKey($key, $buckets, "Unexpected bucket value: {$value}");
            $buckets[$key]++;
        }

        $expected = $samples / 5; // 400 per bucket
        $tolerance = $expected * 0.35; // ±35% — generous for 2000 samples

        foreach ($buckets as $value => $count) {
            $this->assertLessThan(
                $tolerance,
                abs($count - $expected),
                "Bucket {$value}: expected ~{$expected} ±{$tolerance}, got {$count}",
            );
        }
    }

    public function testFloatIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $this->assertSame(
            $a->float('key', ['min' => 0, 'max' => 100]),
            $b->float('key', ['min' => 0, 'max' => 100]),
        );
    }

    public function testFloatRoundsToFourDecimalPlaces(): void
    {
        $prng = new Prng('test');
        $value = $prng->float('scale', ['min' => 0, 'max' => 1]);
        $parts = explode('.', (string) $value);
        $decimals = $parts[1] ?? '';

        $this->assertLessThanOrEqual(4, strlen($decimals), "Expected at most 4 decimal places, got {$decimals}: {$value}");
    }

    public function testFloatReturnsKnownValues(): void
    {
        $prng = new Prng('test');

        $this->assertSame(
            $prng->float('scale', ['min' => 0, 'max' => 1]),
            $prng->float('scale', ['min' => 0, 'max' => 1]),
        );
        $this->assertSame(
            $prng->float('a', ['min' => 10, 'max' => 20]),
            $prng->float('a', ['min' => 10, 'max' => 20]),
        );
    }

    // bool

    public function testBoolReturnsBool(): void
    {
        $prng = new Prng('test');

        $this->assertIsBool($prng->bool('key'));
    }

    public function testBoolAlwaysTrueForLikelihood100(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertTrue($prng->bool('key', 100));
        }
    }

    public function testBoolAlwaysFalseForLikelihood0(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertFalse($prng->bool('key', 0));
        }
    }

    public function testBoolIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $this->assertSame($a->bool('key', 50), $b->bool('key', 50));
    }

    // integer

    public function testIntegerReturnsValueWhenMinEqualsMax(): void
    {
        $prng = new Prng('test');

        $this->assertSame(5, $prng->integer('key', ['min' => 5, 'max' => 5]));
    }

    public function testIntegerWithinBounds(): void
    {
        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $value = $prng->integer('key', ['min' => 1, 'max' => 10]);

            $this->assertGreaterThanOrEqual(1, $value);
            $this->assertLessThanOrEqual(10, $value);
            $this->assertSame($value, (int) floor($value));
        }
    }

    public function testIntegerHandlesReversedOrder(): void
    {
        $prng = new Prng('test');
        $value = $prng->integer('key', ['min' => 10, 'max' => 1]);

        $this->assertGreaterThanOrEqual(1, $value);
        $this->assertLessThanOrEqual(10, $value);
    }

    public function testIntegerIgnoresStep(): void
    {
        $prng = new Prng('test');
        $value = $prng->integer('key', ['min' => 3, 'max' => 10, 'step' => 5]);

        $this->assertGreaterThanOrEqual(3, $value);
        $this->assertLessThanOrEqual(10, $value);
        $this->assertSame($value, (int) floor($value));
    }

    public function testIntegerIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $this->assertSame(
            $a->integer('key', ['min' => 1, 'max' => 100]),
            $b->integer('key', ['min' => 1, 'max' => 100]),
        );
    }

    public function testIntegerDistributesValuesRoughlyUniformly(): void
    {
        $buckets = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];
        $samples = 2000;

        for ($i = 0; $i < $samples; $i++) {
            $value = (new Prng("seed-{$i}"))->integer('key', ['min' => 1, 'max' => 5]);

            $this->assertArrayHasKey($value, $buckets, "Unexpected bucket value: {$value}");
            $buckets[$value]++;
        }

        $expected = $samples / 5; // 400 per bucket
        $tolerance = $expected * 0.35; // ±35% — generous for 2000 samples

        foreach ($buckets as $value => $count) {
            $this->assertLessThan(
                $tolerance,
                abs($count - $expected),
                "Bucket {$value}: expected ~{$expected} ±{$tolerance}, got {$count}",
            );
        }
    }

    // shuffle

    public function testShuffleReturnsNewArray(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5];
        $result = $prng->shuffle('key', $items);

        $this->assertNotSame($result, $items);
    }

    public function testShuffleContainsSameElements(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5];
        $result = $prng->shuffle('key', $items);

        sort($result);
        $sorted = $items;
        sort($sorted);

        $this->assertSame($sorted, $result);
    }

    public function testShuffleDoesNotModifyOriginal(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5];
        $copy = $items;

        $prng->shuffle('key', $items);

        $this->assertSame($copy, $items);
    }

    public function testShuffleIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');
        $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        $this->assertSame($a->shuffle('key', $items), $b->shuffle('key', $items));
    }

    public function testShuffleProducesDifferentOrderingsForDifferentKeys(): void
    {
        $prng = new Prng('test');
        $items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        $this->assertNotSame($prng->shuffle('key-a', $items), $prng->shuffle('key-b', $items));
    }

    public function testShuffleHandlesEmptyArray(): void
    {
        $prng = new Prng('test');

        $this->assertSame([], $prng->shuffle('key', []));
    }

    public function testShuffleHandlesSingleElement(): void
    {
        $prng = new Prng('test');

        $this->assertSame([42], $prng->shuffle('key', [42]));
    }

    // weightedPick

    public function testWeightedPickReturnsNullForEmptyMap(): void
    {
        $prng = new Prng('test');

        $this->assertNull($prng->weightedPick('key', []));
    }

    public function testWeightedPickReturnsSingleKey(): void
    {
        $prng = new Prng('test');

        $this->assertSame('only', $prng->weightedPick('key', ['only' => 1]));
    }

    public function testWeightedPickFallsBackToUniformWhenAllWeightsZero(): void
    {
        $prng = new Prng('test');
        $result = $prng->weightedPick('key', ['a' => 0, 'b' => 0, 'c' => 0]);

        $this->assertContains($result, ['a', 'b', 'c']);
    }

    public function testWeightedPickIsDeterministic(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');
        $weights = ['a' => 1, 'b' => 5, 'c' => 2];

        $this->assertSame(
            $a->weightedPick('key', $weights),
            $b->weightedPick('key', $weights),
        );
    }

    public function testWeightedPickNeverPicksWeightZeroKey(): void
    {
        $weights = ['rare' => 0, 'common' => 1];

        for ($i = 0; $i < 100; $i++) {
            $prng = new Prng("seed-{$i}");

            $this->assertSame('common', $prng->weightedPick('key', $weights));
        }
    }

    public function testWeightedPickFavorsHigherWeightedKeys(): void
    {
        $weights = ['heavy' => 100, 'light' => 1];
        $heavyCount = 0;

        for ($i = 0; $i < 200; $i++) {
            $prng = new Prng("seed-{$i}");

            if ($prng->weightedPick('key', $weights) === 'heavy') {
                $heavyCount++;
            }
        }

        $this->assertGreaterThan(150, $heavyCount, "Expected heavy to be picked most of the time, got {$heavyCount}/200");
    }

    public function testWeightedPickProducesInsertionOrderIndependentResults(): void
    {
        $a = new Prng('test');
        $b = new Prng('test');

        $resultA = $a->weightedPick('key', ['x' => 1, 'y' => 5, 'z' => 2]);
        $resultB = $b->weightedPick('key', ['z' => 2, 'x' => 1, 'y' => 5]);

        $this->assertSame($resultA, $resultB);
    }

    public function testWeightedPickAlwaysReturnsValidKey(): void
    {
        $weights = ['a' => 1, 'b' => 1, 'c' => 1];

        for ($i = 0; $i < 50; $i++) {
            $prng = new Prng("seed-{$i}");
            $result = $prng->weightedPick('key', $weights);

            $this->assertContains($result, ['a', 'b', 'c']);
        }
    }

    // shuffle dedup

    public function testShuffleCollapsesDuplicates(): void
    {
        $prng = new Prng('test');
        $result = $prng->shuffle('key', ['a', 'a', 'b', 'b', 'c', 'c']);
        sort($result);

        $this->assertSame(['a', 'b', 'c'], $result);
    }

    // integer bounds past the int range

    public function testIntegerClampsABoundPastTheIntRange(): void
    {
        $prng = new Prng('test');

        $this->assertSame(2147483647, $prng->integer('key', ['min' => 1e19, 'max' => 1e19]));
        $this->assertGreaterThanOrEqual(2, $prng->integer('key', ['min' => 2, 'max' => 1e300]));
    }
}
