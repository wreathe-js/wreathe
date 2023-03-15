# Responses

## Creating responses

Creating a wreathe response is simple. To get started, invoke the `Wreathe::render()` within your controller or route, providing both the name of the [TypeScript page component](/guide/basic-usage/pages) that you wish to render, as well as any props (data) for the page.

In the example below, we will pass a single prop (`event`) which contains four attributes (`id`, `title`, `start_date` and `description`) to the `Event/Show` page component.

```php
use Wreathe\Wreathe;

class EventsController extends Controller
{
  public function show(Event $event)
  {
    return Wreathe::render('Event/Show', [
      'event' => $event->only(
        'id',
        'title',
        'start_date',
        'description'
      ),
    ]);

    // Alternatively, you can use the wreathe() helper...
    return wreathe('Event/Show', [
      'event' => $event->only(
        'id',
        'title',
        'start_date',
        'description'
      ),
    ]);
  }
}
```

::: warning

To ensure that pages load quickly, only return the minimum data required for the page. Also, be aware that all data returned from the controllers will be visible client-side, so be sure to omit sensitive information.

:::

## Root template data

There are situations where you may want to access your prop data in your application's root Blade template. For example, you may want to add a meta description tag, Twitter card meta tags, or Facebook Open Graph meta tags. You can access this data via the `$page` variable.

```php
<meta name="twitter:title" content="{{ $page['props']['event']->title }}">
```

Sometimes you may even want to provide data to the root template that will not be sent to your JavaScript page / component. This can be accomplished by invoking the `withViewData` method.

```php
return Wreathe::render('Event', ['event' => $event])
  ->withViewData(['meta' => $event->meta]);
```

After invoking the `withViewData` method, you can then access the defined data as you would typically access a Blade template variable.

```php
<meta name="description" content="{{ $meta }}">
```

## Maximum response size

To enable client-side history navigation, all Wreathe server responses are stored in the browser's history state. It's good to be aware that some browsers impose a size limit on how much data can be saved within the history state.

For example, [Firefox](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) has a size limit of 640k characters and throws a `NS_ERROR_ILLEGAL_VALUE` error if you exceed this limit. This is generally much more data than you'll ever practically need when building applications, but it's good to be aware of this limit when building an Wreathe application.
