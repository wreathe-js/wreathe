<?php

namespace Wreathe;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

class Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://wreathe.dev/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://wreathe.dev/asset-versioning
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        if (config('app.asset_url')) {
            return md5(config('app.asset_url'));
        }

        if (file_exists($manifest = public_path('mix-manifest.json'))) {
            return md5_file($manifest);
        }

        if (file_exists($manifest = public_path('build/manifest.json'))) {
            return md5_file($manifest);
        }

        return null;
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://wreathe.dev/shared-data
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return [
            'errors' => function () use ($request) {
                return $this->resolveValidationErrors($request);
            },
        ];
    }

    /**
     * Sets the root template that's loaded on the first page visit.
     *
     * @see https://wreathe.dev/server-side-setup#root-template
     *
     * @param  Request  $request
     * @return string
     */
    public function rootView(Request $request)
    {
        return $this->rootView;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Closure  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next)
    {
        Wreathe::version(function () use ($request) {
            return $this->version($request);
        });

        Wreathe::share($this->share($request));
        Wreathe::setRootView($this->rootView($request));

        $response = $next($request);
        $response->headers->set('Vary', 'X-Wreathe');

        if (! $request->header('X-Wreathe')) {
            return $response;
        }

        if ($request->method() === 'GET' && $request->header('X-Wreathe-Version', '') !== Wreathe::getVersion()) {
            $response = $this->onVersionChange($request, $response);
        }

        if ($response->isOk() && empty($response->getContent())) {
            $response = $this->onEmptyResponse($request, $response);
        }

        if ($response->getStatusCode() === 302 && in_array($request->method(), ['PUT', 'PATCH', 'DELETE'])) {
            $response->setStatusCode(303);
        }

        return $response;
    }

    /**
     * Determines what to do when an Wreathe action returned with no response.
     * By default, we'll redirect the user back to where they came from.
     *
     * @param  Request  $request
     * @param  Response  $response
     * @return Response
     */
    public function onEmptyResponse(Request $request, Response $response): Response
    {
        return Redirect::back();
    }

    /**
     * Determines what to do when the Wreathe asset version has changed.
     * By default, we'll initiate a client-side location visit to force an update.
     *
     * @param  Request  $request
     * @param  Response  $response
     * @return Response
     */
    public function onVersionChange(Request $request, Response $response): Response
    {
        if ($request->hasSession()) {
            $request->session()->reflash();
        }

        return Wreathe::location($request->fullUrl());
    }

    /**
     * Resolves and prepares validation errors in such
     * a way that they are easier to use client-side.
     *
     * @param  Request  $request
     * @return object
     */
    public function resolveValidationErrors(Request $request)
    {
        if (! $request->hasSession() || ! $request->session()->has('errors')) {
            return (object) [];
        }

        return (object) collect($request->session()->get('errors')->getBags())->map(function ($bag) {
            return (object) collect($bag->messages())->map(function ($errors) {
                return $errors[0];
            })->toArray();
        })->pipe(function ($bags) use ($request) {
            if ($bags->has('default') && $request->header('x-wreathe-error-bag')) {
                return [$request->header('x-wreathe-error-bag') => $bags->get('default')];
            }

            if ($bags->has('default')) {
                return $bags->get('default');
            }

            return $bags->toArray();
        });
    }
}
