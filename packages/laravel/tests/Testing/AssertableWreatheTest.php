<?php

namespace Wreathe\Tests\Testing;

use Wreathe\Wreathe;
use Wreathe\Tests\TestCase;
use PHPUnit\Framework\AssertionFailedError;

class AssertableWreatheTest extends TestCase
{
    /** @test */
    public function the_view_is_served_by_wreathe(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $response->assertWreathe();
    }

    /** @test */
    public function the_view_is_not_served_by_wreathe(): void
    {
        $response = $this->makeMockRequest(view('welcome'));
        $response->assertOk(); // Make sure we can render the built-in Orchestra 'welcome' view..

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Not a valid Wreathe response.');

        $response->assertWreathe();
    }

    /** @test */
    public function the_component_matches(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('foo');
        });
    }

    /** @test */
    public function the_component_does_not_match(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Unexpected Wreathe page component.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('bar');
        });
    }

    /** @test */
    public function the_component_exists_on_the_filesystem(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('Stubs/ExamplePage')
        );

        config()->set('wreathe.testing.ensure_pages_exist', true);
        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('Stubs/ExamplePage');
        });
    }

    /** @test */
    public function the_component_does_not_exist_on_the_filesystem(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        config()->set('wreathe.testing.ensure_pages_exist', true);
        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe page component file [foo] does not exist.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('foo');
        });
    }

    /** @test */
    public function it_can_force_enable_the_component_file_existence(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        config()->set('wreathe.testing.ensure_pages_exist', false);
        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe page component file [foo] does not exist.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('foo', true);
        });
    }

    /** @test */
    public function it_can_force_disable_the_component_file_existence_check(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        config()->set('wreathe.testing.ensure_pages_exist', true);

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('foo', false);
        });
    }

    /** @test */
    public function the_component_does_not_exist_on_the_filesystem_when_it_does_not_exist_relative_to_any_of_the_given_paths(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('fixtures/ExamplePage')
        );

        config()->set('wreathe.testing.ensure_pages_exist', true);
        config()->set('wreathe.testing.page_paths', [realpath(__DIR__)]);
        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe page component file [fixtures/ExamplePage] does not exist.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('fixtures/ExamplePage');
        });
    }

    /** @test */
    public function the_component_does_not_exist_on_the_filesystem_when_it_does_not_have_one_of_the_configured_extensions(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('fixtures/ExamplePage')
        );

        config()->set('wreathe.testing.ensure_pages_exist', true);
        config()->set('wreathe.testing.page_extensions', ['bin', 'exe', 'svg']);
        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe page component file [fixtures/ExamplePage] does not exist.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->component('fixtures/ExamplePage');
        });
    }

    /** @test */
    public function the_page_url_matches(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $response->assertWreathe(function ($wreathe) {
            $wreathe->url('/example-url');
        });
    }

    /** @test */
    public function the_page_url_does_not_match(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Unexpected Wreathe page url.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->url('/invalid-page');
        });
    }

    /** @test */
    public function the_asset_version_matches(): void
    {
        Wreathe::version('example-version');

        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $response->assertWreathe(function ($wreathe) {
            $wreathe->version('example-version');
        });
    }

    /** @test */
    public function the_asset_version_does_not_match(): void
    {
        Wreathe::version('example-version');

        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Unexpected Wreathe asset version.');

        $response->assertWreathe(function ($wreathe) {
            $wreathe->version('different-version');
        });
    }
}
