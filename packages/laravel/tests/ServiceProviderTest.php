<?php

namespace Wreathe\Tests;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;

class ServiceProviderTest extends TestCase
{
    public function test_blade_directive_is_registered(): void
    {
        $this->assertArrayHasKey('wreathe', Blade::getCustomDirectives());
    }

    public function test_request_macro_is_registered(): void
    {
        $request = Request::create('/user/123', 'GET');

        $this->assertFalse($request->wreathe());

        $request->headers->add(['X-Wreathe' => 'true']);

        $this->assertTrue($request->wreathe());
    }

    public function test_route_macro_is_registered(): void
    {
        $route = Route::wreathe('/', 'User/Edit', ['user' => ['name' => 'Jonathan']]);
        $routes = Route::getRoutes();

        $this->assertNotEmpty($routes->getRoutes());
        $this->assertEquals($route, $routes->getRoutes()[0]);
        $this->assertEquals(['GET', 'HEAD'], $route->methods);
        $this->assertEquals('/', $route->uri);
        $this->assertEquals(['uses' => '\Wreathe\Controller@__invoke', 'controller' => '\Wreathe\Controller'], $route->action);
        $this->assertEquals(['component' => 'User/Edit', 'props' => ['user' => ['name' => 'Jonathan']]], $route->defaults);
    }
}
