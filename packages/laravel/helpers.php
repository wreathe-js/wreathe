<?php

if (! function_exists('wreathe')) {
    /**
     * Wreathe helper.
     *
     * @param  null|string  $component
     * @param  array|\Illuminate\Contracts\Support\Arrayable  $props
     * @return \Wreathe\ResponseFactory|\Wreathe\Response
     */
    function wreathe($component = null, $props = [])
    {
        $instance = \Wreathe\Wreathe::getFacadeRoot();

        if ($component) {
            return $instance->render($component, $props);
        }

        return $instance;
    }
}
