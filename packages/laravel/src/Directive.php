<?php

namespace Wreathe;

class Directive
{
    /**
     * Compiles the "@wreathe" directive.
     *
     * @param  string  $expression
     * @return string
     */
    public static function compile($expression = ''): string
    {
        $id = trim(trim($expression), "\'\"") ?: 'app';

        $template = '<?php
            if (!isset($__wreatheSsr)) {
                $__wreatheSsr = app(\Wreathe\Ssr\Gateway::class)->dispatch($page);
            }

            if ($__wreatheSsr instanceof \Wreathe\Ssr\Response) {
                echo $__wreatheSsr->body;
            } else {
                ?><div id="'.$id.'" data-page="{{ json_encode($page) }}"></div><?php
            }
        ?>';

        return implode(' ', array_map('trim', explode("\n", $template)));
    }

    /**
     * Compiles the "@wreatheHead" directive.
     *
     * @param  string  $expression
     * @return string
     */
    public static function compileHead($expression = ''): string
    {
        $template = '<?php
            if (!isset($__wreatheSsr)) {
                $__wreatheSsr = app(\Wreathe\Ssr\Gateway::class)->dispatch($page);
            }

            if ($__wreatheSsr instanceof \Wreathe\Ssr\Response) {
                echo $__wreatheSsr->head;
            }
        ?>';

        return implode(' ', array_map('trim', explode("\n", $template)));
    }
}
