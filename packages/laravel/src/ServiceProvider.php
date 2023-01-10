<?php

namespace Wreathe;

use Illuminate\Foundation\Testing\TestResponse as LegacyTestResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Testing\TestResponse;
use Illuminate\View\FileViewFinder;
use Wreathe\Ssr\Gateway;
use Wreathe\Ssr\HttpGateway;
use Wreathe\Testing\TestResponseMacros;
use LogicException;
use ReflectionException;

class ServiceProvider extends BaseServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ResponseFactory::class);
        $this->app->bind(Gateway::class, HttpGateway::class);

        $this->mergeConfigFrom(
            __DIR__.'/../config/wreathe.php',
            'wreathe'
        );

        $this->registerBladeDirectives();
        $this->registerRequestMacro();
        $this->registerRouterMacro();
        $this->registerTestingMacros();

        $this->app->bind('wreathe.testing.view-finder', function ($app) {
            return new FileViewFinder(
                $app['files'],
                $app['config']->get('wreathe.testing.page_paths'),
                $app['config']->get('wreathe.testing.page_extensions')
            );
        });
    }

    public function boot(): void
    {
        $this->registerConsoleCommands();

        $this->publishes([
            __DIR__.'/../config/wreathe.php' => config_path('wreathe.php'),
        ]);
    }

    protected function registerBladeDirectives(): void
    {
        $this->callAfterResolving('blade.compiler', function ($blade) {
            $blade->directive('wreathe', [Directive::class, 'compile']);
            $blade->directive('wreatheHead', [Directive::class, 'compileHead']);
        });
    }

    protected function registerConsoleCommands(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->commands([
            Console\CreateMiddleware::class,
        ]);
    }

    protected function registerRequestMacro(): void
    {
        Request::macro('wreathe', function () {
            return (bool) $this->header('X-Wreathe');
        });
    }

    protected function registerRouterMacro(): void
    {
        Router::macro('wreathe', function ($uri, $component, $props = []) {
            return $this->match(['GET', 'HEAD'], $uri, '\\'.Controller::class)
                ->defaults('component', $component)
                ->defaults('props', $props);
        });
    }

    /**
     * @throws ReflectionException|LogicException
     */
    protected function registerTestingMacros(): void
    {
        if (class_exists(TestResponse::class)) {
            TestResponse::mixin(new TestResponseMacros());

            return;
        }

        // Laravel <= 6.0
        if (class_exists(LegacyTestResponse::class)) {
            LegacyTestResponse::mixin(new TestResponseMacros());

            return;
        }

        throw new LogicException('Could not detect TestResponse class.');
    }
}
