<?php

namespace Wreathe\Ssr;

interface Gateway
{
    /**
     * Dispatch the Wreathe page to the Server Side Rendering engine.
     *
     * @param  array  $page
     * @return Response|null
     */
    public function dispatch(array $page): ?Response;
}
