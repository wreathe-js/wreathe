<?php

namespace Wreathe\Ssr;

use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

class HttpGateway implements Gateway
{
    /**
     * Dispatch the Wreathe page to the Server Side Rendering engine.
     *
     * @param  array  $page
     * @return Response|null
     */
    public function dispatch(array $page): ?Response
    {
        if (! Config::get('wreathe.ssr.enabled', false)) {
            return null;
        }

        $url = Config::get('wreathe.ssr.url', 'http://127.0.0.1:13714/render');

        try {
            $response = Http::post($url, $page)->throw()->json();
        } catch (Exception $e) {
            return null;
        }

        if (is_null($response)) {
            return null;
        }

        return new Response(
            implode("\n", $response['head']),
            $response['body']
        );
    }
}
