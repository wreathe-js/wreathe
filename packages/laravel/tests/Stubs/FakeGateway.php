<?php

namespace Wreathe\Tests\Stubs;

use Illuminate\Support\Facades\Config;
use Wreathe\Ssr\Gateway;
use Wreathe\Ssr\Response;

class FakeGateway implements Gateway
{
    /**
     * Tracks the number of times the 'dispatch' method was called.
     *
     * @var int
     */
    public $times = 0;

    /**
     * Dispatch the Wreathe page to the Server Side Rendering engine.
     *
     * @param  array  $page
     * @return Response|null
     */
    public function dispatch(array $page): ?Response
    {
        $this->times++;

        if (! Config::get('wreathe.ssr.enabled', false)) {
            return null;
        }

        return new Response(
            "<meta charset=\"UTF-8\" />\n<title wreathe>Example SSR Title</title>\n",
            '<p>This is some example SSR content</p>'
        );
    }
}
