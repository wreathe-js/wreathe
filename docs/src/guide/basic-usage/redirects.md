# Redirects

When making a non-GET Wreathe request via `<Link>` or manually, you should ensure that you always respond with a proper Wreathe redirect response.

For example, if your controller is creating a new user, your "store" endpoint should return a redirect back to a standard `GET` endpoint, such as your user "index" page. Wreathe will automatically follow this redirect and update the page accordingly.

```php
class UsersController extends Controller
{
  public function index()
  {
    return Wreathe::render('Users/Index', [
      'users' => User::all(),
    ]);
  }

  public function store(Request $request)
  {
    User::create(
      $request->validate([
        'name' => ['required', 'max:50'],
        'email' => ['required', 'max:50', 'email'],
      ])
    );

    return to_route('users.index');
  }
}
```

## 303 response code

When redirecting after a `PUT`, `PATCH`, or `DELETE` request, you must use a `303` response code, otherwise the subsequent request will not be treated as a `GET` request. A `303` redirect is very similar to a `302` redirect; however, the follow-up request is explicitly changed to a `GET` request.

If you're using one of our official server-side adapters, all redirects will automatically be converted to 303 redirects.

## External redirects

Sometimes it's necessary to redirect to an external website, or even another non-Wreathe endpoint in your app while handling an Wreathe request. This can be accomplished using a server-side initiated `window.location` visit via the `Wreathe::location()` method.

```php
return Wreathe::location($url);
```

The `Wreathe::location()` method will generate a `409 Conflict` response and include the destination URL in the `X-Wreathe-Location` header. When this response is received client-side, Wreathe will automatically perform a `window.location = url` visit.
