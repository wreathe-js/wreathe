<?php

namespace Wreathe\Tests\Testing;

use Illuminate\Testing\Fluent\AssertableJson;
use Wreathe\Wreathe;
use Wreathe\Testing\Assert;
use Wreathe\Tests\TestCase;

class TestResponseMacrosTest extends TestCase
{
    /** @test */
    public function it_can_make_wreathe_assertions(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $success = false;
        $response->assertWreathe(function ($page) use (&$success) {
            if (class_exists(AssertableJson::class)) {
                $this->assertInstanceOf(AssertableJson::class, $page);
            } else {
                // TODO: Remove once built-in Assert library is removed.
                $this->assertInstanceOf(Assert::class, $page);
            }
            $success = true;
        });

        $this->assertTrue($success);
    }

    /** @test */
    public function it_preserves_the_ability_to_continue_chaining_laravel_test_response_calls(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $this->assertInstanceOf(
            $this->getTestResponseClass(),
            $response->assertWreathe()
        );
    }

    /** @test */
    public function it_can_retrieve_the_wreathe_page(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', ['bar' => 'baz'])
        );

        tap($response->wreathePage(), function (array $page) {
            $this->assertSame('foo', $page['component']);
            $this->assertSame(['bar' => 'baz'], $page['props']);
            $this->assertSame('/example-url', $page['url']);
            $this->assertSame('', $page['version']);
        });
    }
}
