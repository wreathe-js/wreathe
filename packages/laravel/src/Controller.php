<?php

namespace Wreathe;

use Illuminate\Http\Request;

class Controller
{
    public function __invoke(Request $request): Response
    {
        return Wreathe::render(
            $request->route()->defaults['component'],
            $request->route()->defaults['props']
        );
    }
}
