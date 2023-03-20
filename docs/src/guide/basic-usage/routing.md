# Routing

## Defining routes

When using Wreathe, all of your application's routes are defined server-side. This means that you don't need Vue Router or React Router. Instead, you can simply define Laravel routes and return [Wreathe responses](/guide/basic-usage/responses) from those routes.

## Shorthand routes

If you have a [page](/guide/basic-usage/pages) that doesn't need a corresponding controller method, like an "FAQ" or "about" page, you can route directly to a component via the `Route::wreathe()` method.

```php
Route::wreathe('/about', 'About');
```

## Generating URLs

Some server-side frameworks allow you to generate URLs from named routes. However, you will not have access to those helpers client-side. Here are a couple ways to still use named routes with Wreathe.

The first option is to generate URLs server-side and include them as props. Notice in this example how we're passing the `edit_url` and `create_url` to the `Users/Index` component.

```php
class UsersController extends Controller
{
  public function index()
  {
    return Wreathe::render('Users/Index', [
      'users' => User::all()->map(function ($user) {
        return [
          'id' => $user->id,
          'name' => $user->name,
          'email' => $user->email,
          'edit_url' => route('users.edit', $user),
        ];
      }),
      'create_url' => route('users.create'),
    ]);
  }
}
```

However, when using Laravel, the [Ziggy](https://github.com/tighten/ziggy) library can make your named, server-side routes available to you via a global `route()` function. In fact, if you are developing an application using one of Laravel's [starter kits](https://laravel.com/docs/10.x/starter-kits), Ziggy is already configured for you.

If you're using Ziggy with Vue, it's helpful to make this function available as a custom `$route` property so you can use it directly in your templates.

```vue
app.config.globalProperties.$route = route
```

```ts
<Link :href="$route('users.create')">Create User</Link>
```
