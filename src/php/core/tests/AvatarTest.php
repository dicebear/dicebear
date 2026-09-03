<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Avatar;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class AvatarTest extends TestCase
{
    private static function minimalStyleData(): array
    {
        return ['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]];
    }

    // constructor

    public function testAcceptsStyleInstanceAndRawOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);
        $this->assertInstanceOf(Avatar::class, $avatar);
    }

    public function testRejectsARawDefinitionArray(): void
    {
        $this->expectException(\TypeError::class);
        new Avatar(self::minimalStyleData(), ['seed' => 'test']);
    }

    public function testAcceptsRawOptions(): void
    {
        $avatar = new Avatar(new Style(self::minimalStyleData()), ['seed' => 'test']);
        $this->assertInstanceOf(Avatar::class, $avatar);
    }

    public function testWorksWithoutOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style);
        $this->assertInstanceOf(Avatar::class, $avatar);
    }

    // toString

    public function testToStringReturnsString(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);
        $this->assertIsString($avatar->toString());
    }

    // toJSON

    public function testToJsonReturnsObjectWithSvgAndOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);
        $json = $avatar->toJSON();

        $this->assertIsString($json['svg']);
        $this->assertIsArray($json['options']);
    }

    public function testToJsonConsistentWithToString(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $this->assertSame($avatar->toJSON()['svg'], $avatar->toString());
    }

    public function testToJsonReturnsDeepCopyOfOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $json1 = $avatar->toJSON();
        $json2 = $avatar->toJSON();
        $json1['options']['injected'] = 'modified';

        $this->assertArrayNotHasKey('injected', $json2['options']);
    }

    public function testToJsonDoesNotIncludeSeed(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $this->assertArrayNotHasKey('seed', $avatar->toJSON()['options']);
    }

    // toDataUri

    public function testToDataUriReturnsDataUri(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $this->assertStringStartsWith('data:image/svg+xml;charset=utf-8,', $avatar->toDataUri());
    }

    public function testToDataUriContainsEncodedSvg(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        // The exact byte-level encoding (JS encodeURIComponent) is pinned by
        // the parity fixtures; here only the round-trip is asserted.
        $payload = substr($avatar->toDataUri(), strlen('data:image/svg+xml;charset=utf-8,'));
        $this->assertSame($avatar->toString(), rawurldecode($payload));
    }
}
