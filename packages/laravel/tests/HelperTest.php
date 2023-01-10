<?php

namespace Wreathe\Tests;

use Wreathe\Wreathe;
use Wreathe\Response;
use Wreathe\ResponseFactory;

class HelperTest extends TestCase
{
    public function test_the_helper_function_returns_an_instance_of_the_response_factory(): void
    {
        $this->assertInstanceOf(ResponseFactory::class, wreathe());
    }

    public function test_the_helper_function_returns_a_response_instance(): void
    {
        $this->assertInstanceOf(Response::class, wreathe('User/Edit', ['user' => ['name' => 'Jonathan']]));
    }

    public function test_the_instance_is_the_same_as_the_facade_instance(): void
    {
        Wreathe::share('key', 'value');
        $this->assertEquals('value', wreathe()->getShared('key'));
    }
}
