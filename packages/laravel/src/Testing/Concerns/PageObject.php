<?php

namespace Wreathe\Testing\Concerns;

use Illuminate\Support\Arr;
use InvalidArgumentException;
use PHPUnit\Framework\Assert as PHPUnit;

trait PageObject
{
    public function component(string $value = null, $shouldExist = null): self
    {
        PHPUnit::assertSame($value, $this->component, 'Unexpected Wreathe page component.');

        if ($shouldExist || (is_null($shouldExist) && config('wreathe.testing.ensure_pages_exist', true))) {
            try {
                app('wreathe.testing.view-finder')->find($value);
            } catch (InvalidArgumentException $exception) {
                PHPUnit::fail(sprintf('Wreathe page component file [%s] does not exist.', $value));
            }
        }

        return $this;
    }

    protected function prop(string $key = null)
    {
        return Arr::get($this->props, $key);
    }

    public function url(string $value): self
    {
        PHPUnit::assertSame($value, $this->url, 'Unexpected Wreathe page url.');

        return $this;
    }

    public function version(string $value): self
    {
        PHPUnit::assertSame($value, $this->version, 'Unexpected Wreathe asset version.');

        return $this;
    }

    public function toArray(): array
    {
        return [
            'component' => $this->component,
            'props' => $this->props,
            'url' => $this->url,
            'version' => $this->version,
        ];
    }
}
