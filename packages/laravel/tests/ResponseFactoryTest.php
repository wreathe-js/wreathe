<?php

namespace Wreathe\Tests;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Wreathe\Wreathe;
use Wreathe\LazyProp;
use Wreathe\ResponseFactory;
use Wreathe\Tests\Stubs\ExampleMiddleware;

class ResponseFactoryTest extends TestCase
{
    public function test_can_macro(): void
    {
        $factory = new ResponseFactory();
        $factory->macro('foo', function () {
            return 'bar';
        });

        $this->assertEquals('bar', $factory->foo());
    }

    public function test_location_response_for_wreathe_requests(): void
    {
        Request::macro('wreathe', function () {
            return true;
        });

        $response = (new ResponseFactory())->location('https://wreathe.dev');

        $this->assertInstanceOf(Response::class, $response);
        $this->assertEquals(Response::HTTP_CONFLICT, $response->getStatusCode());
        $this->assertEquals('https://wreathe.dev', $response->headers->get('X-Wreathe-Location'));
    }

    public function test_location_response_for_non_wreathe_requests(): void
    {
        Request::macro('wreathe', function () {
            return false;
        });

        $response = (new ResponseFactory())->location('https://wreathe.dev');

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(Response::HTTP_FOUND, $response->getStatusCode());
        $this->assertEquals('https://wreathe.dev', $response->headers->get('location'));
    }

    public function test_location_response_for_wreathe_requests_using_redirect_response(): void
    {
        Request::macro('wreathe', function () {
            return true;
        });

        $redirect = new RedirectResponse('https://wreathe.dev');
        $response = (new ResponseFactory())->location($redirect);

        $this->assertInstanceOf(Response::class, $response);
        $this->assertEquals(409, $response->getStatusCode());
        $this->assertEquals('https://wreathe.dev', $response->headers->get('X-Wreathe-Location'));
    }

    public function test_location_response_for_non_wreathe_requests_using_redirect_response(): void
    {
        $redirect = new RedirectResponse('https://wreathe.dev');
        $response = (new ResponseFactory())->location($redirect);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(Response::HTTP_FOUND, $response->getStatusCode());
        $this->assertEquals('https://wreathe.dev', $response->headers->get('location'));
    }

    public function test_the_version_can_be_a_closure(): void
    {
        Route::middleware([StartSession::class, ExampleMiddleware::class])->get('/', function () {
            $this->assertSame('', Wreathe::getVersion());

            Wreathe::version(function () {
                return md5('Wreathe');
            });

            return Wreathe::render('User/Edit');
        });

        $response = $this->withoutExceptionHandling()->get('/', [
            'X-Wreathe' => 'true',
            'X-Wreathe-Version' => 'b19a24ee5c287f42ee1d465dab77ab37',
        ]);

        $response->assertSuccessful();
        $response->assertJson(['component' => 'User/Edit']);
    }

    public function test_shared_data_can_be_shared_from_anywhere(): void
    {
        Route::middleware([StartSession::class, ExampleMiddleware::class])->get('/', function () {
            Wreathe::share('foo', 'bar');

            return Wreathe::render('User/Edit');
        });

        $response = $this->withoutExceptionHandling()->get('/', ['X-Wreathe' => 'true']);

        $response->assertSuccessful();
        $response->assertJson([
            'component' => 'User/Edit',
            'props' => [
                'foo' => 'bar',
            ],
        ]);
    }

    public function test_can_flush_shared_data(): void
    {
        Wreathe::share('foo', 'bar');
        $this->assertSame(['foo' => 'bar'], Wreathe::getShared());
        Wreathe::flushShared();
        $this->assertSame([], Wreathe::getShared());
    }

    public function test_can_create_lazy_prop(): void
    {
        $factory = new ResponseFactory();
        $lazyProp = $factory->lazy(function () {
            return 'A lazy value';
        });

        $this->assertInstanceOf(LazyProp::class, $lazyProp);
    }

    public function test_will_accept_arrayabe_props()
    {
        Route::middleware([StartSession::class, ExampleMiddleware::class])->get('/', function () {
            Wreathe::share('foo', 'bar');

            return Wreathe::render('User/Edit', new class implements Arrayable
            {
                public function toArray()
                {
                    return [
                        'foo' => 'bar',
                    ];
                }
            });
        });

        $response = $this->withoutExceptionHandling()->get('/', ['X-Wreathe' => 'true']);
        $response->assertSuccessful();
        $response->assertJson([
            'component' => 'User/Edit',
            'props' => [
                'foo' => 'bar',
            ],
        ]);
    }
}
