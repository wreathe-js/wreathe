<?php

namespace Wreathe\Testing;

use Closure;
use Illuminate\Testing\Fluent\AssertableJson;

class TestResponseMacros
{
    public function assertWreathe()
    {
        return function (Closure $callback = null) {
            if (class_exists(AssertableJson::class)) {
                $assert = AssertableWreathe::fromTestResponse($this);
            } else {
                $assert = Assert::fromTestResponse($this);
            }

            if (is_null($callback)) {
                return $this;
            }

            $callback($assert);

            return $this;
        };
    }

    public function wreathePage()
    {
        return function () {
            if (class_exists(AssertableJson::class)) {
                return AssertableWreathe::fromTestResponse($this)->toArray();
            }

            return Assert::fromTestResponse($this)->toArray();
        };
    }
}
