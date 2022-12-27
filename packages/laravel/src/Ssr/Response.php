<?php

namespace Wreathe\Ssr;

class Response
{
    /**
     * @var string
     */
    public $head;

    /**
     * @var string
     */
    public $body;

    /**
     * Prepare the Wreathe Server Side Rendering (SSR) response.
     *
     * @param  string  $head
     * @param  string  $body
     */
    public function __construct(string $head, string $body)
    {
        $this->head = $head;
        $this->body = $body;
    }
}
