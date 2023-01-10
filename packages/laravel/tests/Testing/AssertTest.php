<?php

namespace Wreathe\Tests\Testing;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Testing\Fluent\AssertableJson;
use Wreathe\Wreathe;
use Wreathe\Testing\Assert;
use Wreathe\Tests\TestCase;
use PHPUnit\Framework\AssertionFailedError;
use TypeError;

class AssertTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        if (class_exists(AssertableJson::class)) {
            $this->markTestSkipped("These tests are not applicable on Laravel 8.32 or newer, as Laravel's built-in AssertableJson is used instead.");
        }
    }

    /** @test */
    public function it_has_a_prop(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'prop' => 'value',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('prop');
        });
    }

    /** @test */
    public function it_does_not_have_a_prop(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'value',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [prop] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('prop');
        });
    }

    /** @test */
    public function it_has_a_nested_prop(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'example' => [
                    'nested' => 'nested-value',
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('example.nested');
        });
    }

    /** @test */
    public function it_does_not_have_a_nested_prop(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'example' => [
                    'nested' => 'nested-value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [example.another] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('example.another');
        });
    }

    /** @test */
    public function it_can_count_the_amount_of_items_in_a_given_prop(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'example',
                    'prop' => 'value',
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', 2);
        });
    }

    /** @test */
    public function it_fails_counting_when_the_amount_of_items_in_a_given_prop_does_not_match(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'example',
                    'prop' => 'value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] does not have the expected size.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', 1);
        });
    }

    /** @test */
    public function it_cannot_count_the_amount_of_items_in_a_given_prop_when_the_prop_does_not_exist(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'example',
                    'prop' => 'value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('baz', 2);
        });
    }

    /** @test */
    public function it_fails_when_the_second_argument_of_the_has_assertion_is_an_unsupported_type(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'baz',
            ])
        );

        $this->expectException(TypeError::class);

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', 'invalid');
        });
    }

    /** @test */
    public function it_asserts_that_a_prop_is_missing(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'bar' => true,
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->missing('foo.baz');
        });
    }

    /** @test */
    public function it_asserts_that_a_prop_is_missing_using_the_misses_method(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'bar' => true,
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->misses('foo.baz');
        });
    }

    /** @test */
    public function it_fails_asserting_that_a_prop_is_missing_when_it_exists_using_the_misses_method(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'prop' => 'value',
                'foo' => [
                    'bar' => true,
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [foo.bar] was found while it was expected to be missing.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('prop')
                ->misses('foo.bar');
        });
    }

    /** @test */
    public function it_fails_asserting_that_a_prop_is_missing_when_it_exists(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'prop' => 'value',
                'foo' => [
                    'bar' => true,
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [foo.bar] was found while it was expected to be missing.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('prop')
                ->missing('foo.bar');
        });
    }

    /** @test */
    public function it_can_assert_that_multiple_props_are_missing(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'baz' => 'foo',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('baz')
                ->missingAll([
                    'foo',
                    'bar',
                ]);
        });
    }

    /** @test */
    public function it_cannot_assert_that_multiple_props_are_missing_when_at_least_one_exists(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'baz' => 'example',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] was found while it was expected to be missing.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('foo')
                ->missingAll([
                    'bar',
                    'baz',
                ]);
        });
    }

    /** @test */
    public function it_can_use_arguments_instead_of_an_array_to_assert_that_it_is_missing_multiple_props(): void
    {
        $this->makeMockRequest(
            Wreathe::render('foo', [
                'baz' => 'foo',
            ])
        )->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('baz')->missingAll('foo', 'bar');
        });

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] was found while it was expected to be missing.');

        $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'baz' => 'example',
            ])
        )->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('foo')->missingAll('bar', 'baz');
        });
    }

    /** @test */
    public function it_can_assert_that_multiple_props_are_missing_using_the_misses_all_method(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'baz' => 'foo',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('baz')
                ->missesAll([
                    'foo',
                    'bar',
                ]);
        });
    }

    /** @test */
    public function it_cannot_assert_that_multiple_props_are_missing_when_at_least_one_exists_using_the_misses_all_method(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'baz' => 'example',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] was found while it was expected to be missing.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('foo')
                ->missesAll([
                    'bar',
                    'baz',
                ]);
        });
    }

    /** @test */
    public function it_can_use_arguments_instead_of_an_array_to_assert_that_it_is_missing_multiple_props_using_the_misses_all_method(): void
    {
        $this->makeMockRequest(
            Wreathe::render('foo', [
                'baz' => 'foo',
            ])
        )->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('baz')->missesAll('foo', 'bar');
        });

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] was found while it was expected to be missing.');

        $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'baz' => 'example',
            ])
        )->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('foo')->missesAll('bar', 'baz');
        });
    }

    /** @test */
    public function the_prop_matches_a_value(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'value',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('bar', 'value');
        });
    }

    /** @test */
    public function the_prop_does_not_match_a_value(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'value',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] does not match the expected value.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('bar', 'invalid');
        });
    }

    /** @test */
    public function the_prop_does_not_match_a_value_when_it_does_not_exist(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'value',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('baz', null);
        });
    }

    /** @test */
    public function the_prop_does_not_match_loosely(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 1,
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] does not match the expected value.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('bar', true);
        });
    }

    /** @test */
    public function the_prop_matches_a_value_using_a_closure(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'baz',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('bar', function ($value) {
                return $value === 'baz';
            });
        });
    }

    /** @test */
    public function the_prop_does_not_match_a_value_using_a_closure(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'baz',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] was marked as invalid using a closure.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('bar', function ($value) {
                return $value === 'invalid';
            });
        });
    }

    /** @test */
    public function array_props_will_be_automatically_cast_to_collections_when_using_a_closure(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'foo',
                    'example' => 'value',
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('bar', function ($value) {
                $this->assertInstanceOf(Collection::class, $value);

                return $value->count() === 2;
            });
        });
    }

    /** @test */
    public function the_prop_matches_a_value_using_an_arrayable(): void
    {
        Model::unguard();
        $user = User::make(['name' => 'Example']);
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => $user,
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) use ($user) {
            $wreathe->where('bar', $user);
        });
    }

    /** @test */
    public function the_prop_does_not_match_a_value_using_an_arrayable(): void
    {
        Model::unguard();
        $userA = User::make(['name' => 'Example']);
        $userB = User::make(['name' => 'Another']);
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => $userA,
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] does not match the expected value.');

        $response->assertWreathe(function (Assert $wreathe) use ($userB) {
            $wreathe->where('bar', $userB);
        });
    }

    /** @test */
    public function the_prop_matches_a_value_using_an_arrayable_even_when_they_are_sorted_differently(): void
    {
        // https://github.com/claudiodekker/wreathe-laravel-testing/issues/30
        Model::unguard();
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => User::make(['id' => 1, 'name' => 'Example']),
                'baz' => [
                    'id' => 1,
                    'name' => 'Nayeli Hermiston',
                    'email' => 'vroberts@example.org',
                    'email_verified_at' => '2021-01-22T10:34:42.000000Z',
                    'created_at' => '2021-01-22T10:34:42.000000Z',
                    'updated_at' => '2021-01-22T10:34:42.000000Z',
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->where('bar', User::make(['name' => 'Example', 'id' => 1]))
                ->where('baz', [
                    'name' => 'Nayeli Hermiston',
                    'email' => 'vroberts@example.org',
                    'id' => 1,
                    'email_verified_at' => '2021-01-22T10:34:42.000000Z',
                    'updated_at' => '2021-01-22T10:34:42.000000Z',
                    'created_at' => '2021-01-22T10:34:42.000000Z',
                ]);
        });
    }

    /** @test */
    public function the_prop_matches_a_value_using_a_responsable(): void
    {
        Model::unguard();
        $user = User::make(['name' => 'Example']);
        $resource = JsonResource::collection(new Collection([$user, $user]));
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => $resource,
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) use ($resource) {
            $wreathe->where('bar', $resource);
        });
    }

    /** @test */
    public function the_prop_does_not_match_a_value_using_a_responsable(): void
    {
        Model::unguard();
        $resourceA = JsonResource::make(User::make(['name' => 'Another']));
        $resourceB = JsonResource::make(User::make(['name' => 'Example']));
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => $resourceA,
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] does not match the expected value.');

        $response->assertWreathe(function (Assert $wreathe) use ($resourceB) {
            $wreathe->where('bar', $resourceB);
        });
    }

    /** @test */
    public function the_nested_prop_matches_a_value(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'example' => [
                    'nested' => 'nested-value',
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('example.nested', 'nested-value');
        });
    }

    /** @test */
    public function the_nested_prop_does_not_match_a_value(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'example' => [
                    'nested' => 'nested-value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [example.nested] does not match the expected value.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->where('example.nested', 'another-value');
        });
    }

    /** @test */
    public function it_can_scope_the_assertion_query(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'example',
                    'prop' => 'value',
                ],
            ])
        );

        $called = false;
        $response->assertWreathe(function (Assert $wreathe) use (&$called) {
            $wreathe->has('bar', function (Assert $wreathe) use (&$called) {
                $called = true;
                $wreathe
                    ->where('baz', 'example')
                    ->where('prop', 'value');
            });
        });

        $this->assertTrue($called, 'The scoped query was never actually called.');
    }

    /** @test */
    public function it_cannot_scope_the_assertion_query_when_the_scoped_prop_does_not_exist(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'example',
                    'prop' => 'value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('baz', function (Assert $wreathe) {
                $wreathe->where('baz', 'example');
            });
        });
    }

    /** @test */
    public function it_cannot_scope_the_assertion_query_when_the_scoped_prop_is_a_single_value(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => 'value',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] is not scopeable.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', function (Assert $wreathe) {
                //
            });
        });
    }

    /** @test */
    public function it_can_scope_on_complex_objects_responsable(): void
    {
        Model::unguard();
        $userA = User::make(['name' => 'Example']);
        $userB = User::make(['name' => 'Another']);

        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'example' => JsonResource::make([$userA, $userB]),
            ])
        );

        $called = false;
        $response->assertWreathe(function (Assert $wreathe) use (&$called) {
            return $wreathe->has('example', function (Assert $wreathe) use (&$called) {
                $wreathe->has('data', 2);

                $called = true;
            });
        });

        $this->assertTrue($called, 'The scoped query was never actually called.');
    }

    /** @test */
    public function it_can_directly_scope_onto_the_first_item_when_asserting_that_a_prop_has_a_length_greater_than_zero(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    ['key' => 'first'],
                    ['key' => 'second'],
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', 2, function (Assert $wreathe) {
                $wreathe->where('key', 'first');
            });
        });
    }

    /** @test */
    public function it_cannot_directly_scope_onto_the_first_item_when_asserting_that_a_prop_has_a_length_of_zero(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    ['key' => 'first'],
                    ['key' => 'second'],
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Cannot scope directly onto the first entry of property [bar] when asserting that it has a size of 0.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', 0, function (Assert $wreathe) {
                $wreathe->where('key', 'first');
            });
        });
    }

    /** @test */
    public function it_cannot_directly_scope_onto_the_first_item_when_it_does_not_match_the_expected_size(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    ['key' => 'first'],
                    ['key' => 'second'],
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [bar] does not have the expected size.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', 1, function (Assert $wreathe) {
                $wreathe->where('key', 'first');
            });
        });
    }

    /** @test */
    public function it_fails_when_it_does_not_interact_with_all_props_in_the_scope_at_least_once(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'baz' => 'example',
                    'prop' => 'value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Unexpected Wreathe properties were found in scope [bar].');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('bar', function (Assert $wreathe) {
                $wreathe->where('baz', 'example');
            });
        });
    }

    /** @test */
    public function it_can_disable_the_interaction_check_for_the_current_scope(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => true,
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->etc();
        });
    }

    /** @test */
    public function it_cannot_disable_the_interaction_check_for_any_other_scopes(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => true,
                'baz' => [
                    'foo' => 'bar',
                    'example' => 'value',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Unexpected Wreathe properties were found in scope [baz].');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->etc()
                ->has('baz', function (Assert $wreathe) {
                    $wreathe->where('foo', 'bar');
                });
        });
    }

    /** @test */
    public function it_does_not_fail_when_not_interacting_with_every_top_level_prop(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'bar' => 'baz',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->has('foo');
        });
    }

    /** @test */
    public function it_fails_when_not_interacting_with_every_top_level_prop_while_the_interacted_flag_is_set(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'bar' => 'baz',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Unexpected Wreathe properties were found on the root level.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe
                ->has('foo')
                ->interacted();
        });
    }

    /** @test */
    public function it_can_assert_that_multiple_props_match_their_expected_values_at_once(): void
    {
        Model::unguard();
        $user = User::make(['name' => 'Example']);
        $resource = JsonResource::make(User::make(['name' => 'Another']));

        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'user' => $user,
                    'resource' => $resource,
                ],
                'bar' => 'baz',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) use ($user, $resource) {
            $wreathe->whereAll([
                'foo.user' => $user,
                'foo.resource' => $resource,
                'bar' => function ($value) {
                    return $value === 'baz';
                },
            ]);
        });
    }

    /** @test */
    public function it_cannot_assert_that_multiple_props_match_their_expected_values_when_at_least_one_does_not(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => 'bar',
                'baz' => 'example',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] was marked as invalid using a closure.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->whereAll([
                'foo' => 'bar',
                'baz' => function ($value) {
                    return $value === 'foo';
                },
            ]);
        });
    }

    /** @test */
    public function it_can_assert_that_it_has_multiple_props(): void
    {
        Model::unguard();
        $user = User::make(['name' => 'Example']);
        $resource = JsonResource::make(User::make(['name' => 'Another']));

        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'user' => $user,
                    'resource' => $resource,
                ],
                'bar' => 'baz',
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->hasAll([
                'foo.user',
                'foo.resource',
                'bar',
            ]);
        });
    }

    /** @test */
    public function it_cannot_assert_that_it_has_multiple_props_when_at_least_one_is_missing(): void
    {
        Model::unguard();
        $user = User::make(['name' => 'Example']);
        $resource = JsonResource::make(User::make(['name' => 'Another']));

        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'user' => $user,
                    'resource' => $resource,
                ],
                'bar' => 'baz',
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->hasAll([
                'foo.user',
                'baz',
            ]);
        });
    }

    /** @test */
    public function it_can_use_arguments_instead_of_an_array_to_assert_that_it_has_multiple_props(): void
    {
        Model::unguard();
        $user = User::make(['name' => 'Example']);
        $resource = JsonResource::make(User::make(['name' => 'Another']));

        $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'user' => $user,
                    'resource' => $resource,
                ],
                'bar' => 'baz',
            ])
        )->assertWreathe(function (Assert $wreathe) {
            $wreathe->hasAll('foo.user', 'foo.resource', 'bar');
        });

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] does not exist.');

        $this->makeMockRequest(
            Wreathe::render('foo', [
                'foo' => [
                    'user' => $user,
                    'resource' => $resource,
                ],
                'bar' => 'baz',
            ])
        )->assertWreathe(function (Assert $wreathe) {
            $wreathe->hasAll('foo.user', 'baz');
        });
    }

    /** @test */
    public function it_can_count_multiple_props_at_once(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'key' => 'value',
                    'prop' => 'example',
                ],
                'baz' => [
                    'another' => 'value',
                ],
            ])
        );

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->hasAll([
                'bar' => 2,
                'baz' => 1,
            ]);
        });
    }

    /** @test */
    public function it_cannot_count_multiple_props_at_once_when_at_least_one_is_missing(): void
    {
        $response = $this->makeMockRequest(
            Wreathe::render('foo', [
                'bar' => [
                    'key' => 'value',
                    'prop' => 'example',
                ],
            ])
        );

        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('Wreathe property [baz] does not exist.');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->hasAll([
                'bar' => 2,
                'baz' => 1,
            ]);
        });
    }

    /** @test */
    public function it_is_macroable(): void
    {
        Assert::macro('myCustomMacro', function () {
            throw new Exception('My Custom Macro was called!');
        });

        $response = $this->makeMockRequest(
            Wreathe::render('foo')
        );

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('My Custom Macro was called!');

        $response->assertWreathe(function (Assert $wreathe) {
            $wreathe->myCustomMacro();
        });
    }
}
