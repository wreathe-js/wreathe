# Shared data

Sometimes you need to access specific pieces of data on numerous pages within your application. For example, you may need to display the current user in the site header. Passing this data manually in each response across your entire application isn't practical. Thankfully, there is a better option: shared data.

## Sharing data

Wreathe's server-side adapters provide a method of preassigning shared data for each request. This is typically done outside of your controllers. Shared data will be automatically merged with the page props provided in your controller.

In Laravel applications, this is typically handled by the `HandleWreatheRequests` middleware that is automatically installed when installing the [server-side adapter](/advanced-usage/manual-installation#middleware).

```php
class HandleWreatheRequests extends Middleware
{
  public function share(Request $request)
  {
    return array_merge(parent::share($request), [
      // Synchronously...
      'appName' => config('app.name'),

      // Lazily...
      'auth.user' => fn () => $request->user()
        ? $request->user()->only('id', 'name', 'email')
        : null,
    ]);
  }
}
```

Alternatively, you can manually share data using the `Wreathe::share` method.

```php
use Wreathe\Wreathe;

// Synchronously...
Wreathe::share('appName', config('app.name'));

// Lazily...
Wreathe::share('user', fn (Request $request) => $request->user()
  ? $request->user()->only('id', 'name', 'email')
  : null
);
```

::: warning

Shared data should be used sparingly as all shared data is included with every response.

Page props and shared data are merged together, so be sure to namespace your shared data appropriately to avoid collisions.

:::

## Accessing shared data

Once you have shared the data server-side, you will then be able to access it within any of your pages or components. Here's an example of how to access shared data in a layout component.

::: code-group

```ts [Preact]
import { usePage } from '@wreathe-js/preact'

export default function Layout({ children }) {
  const { auth } = usePage().props;

  return (
    <main>
      <header>You are logged in as: {auth.user.name}</header>
      <content>{children}</content>
    </main>
  )
}
```

```ts [React]
import { usePage } from '@wreathe-js/react'

export default function Layout({ children }) {
  const { auth } = usePage().props;

  return (
    <main>
      <header>You are logged in as: {auth.user.name}</header>
      <content>{children}</content>
    </main>
  )
}
```

```ts [Vue]
<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@wreathe-js/vue'

const user = computed(() => usePage().props.auth.user)
</script>

<template>
  <main>
    <header>
      You are logged in as: {{ user.name }}
    </header>
    <content>
      <slot />
    </content>
  </main>
</template>
```

:::

## Flash messages

Another great use-case for shared data is flash messages. These are messages stored in the session only for the next request. For example, it's common to set a flash message after completing a task and before redirecting to a different page.

Here's a simple way to implement flash messages in your Wreathe applications. First, share the flash message on each request.

```php
class HandleWreatheRequests extends Middleware
{
  public function share(Request $request)
  {
    return array_merge(parent::share($request), [
      'flash' => [
        'message' => fn () => $request->session()->get('message')
      ],
    ]);
  }
}
```

Next, display the flash message in a front-end component, such as the site layout.

::: code-group

```ts [Preact]
import { usePage } from '@wreathe-js/preact'

export default function Layout({ children }) {
  const { flash } = usePage().props;

  return (
    <main>
      <header></header>
      <content>
        {flash.message && <div class="alert">{flash.message}</div>}
        {children}
      </content>
      <footer></footer>
    </main>
  )
}
```

```ts [React]
import { usePage } from '@wreathe-js/react'

export default function Layout({ children }) {
  const { flash } = usePage().props;

  return (
    <main>
      <header></header>
      <content>
        {flash.message && <div class="alert">{flash.message}</div>}
        {children}
      </content>
      <footer></footer>
    </main>
  )
}
```

```ts [Vue]
<template>
  <main>
    <header></header>
    <content>
      <div v-if="$page.props.flash.message" class="alert">
        {{ $page.props.flash.message }}
      </div>
      <slot />
    </content>
    <footer></footer>
  </main>
</template>
```

:::
