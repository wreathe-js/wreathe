# Pages

When building applications using Wreathe, each page in your application typically has its own controller / route and a corresponding JavaScript component. This allows you to retrieve just the data necessary for that page - no API required.

In addition, all of the data needed for the page can be retrieved before the page is ever rendered by the browser, eliminating the need for displaying "loading" states when users visit your application.

## Creating pages

Wreathe pages are simply JavaScript components. There is nothing particularly special or "magical" about pages. As you can see in the example below, pages receive data from your application's controllers as props.

::: code-group

```ts [Preact]
import Layout from './Layout'
import { Head } from '@wreathe-js/preact'

export default function Welcome({ user }) {
  return (
    <Layout>
      <Head title="Welcome" />
      <h1>Welcome</h1>
      <p>Hello {user.name}, welcome to your first Wreathe app!</p>
    </Layout>
  );
}
```

```ts [React]
import Layout from './Layout'
import { Head } from '@wreathe-js/react'

export default function Welcome({ user }) {
  return (
    <Layout>
      <Head title="Welcome" />
      <h1>Welcome</h1>
      <p>Hello {user.name}, welcome to your first Wreathe app!</p>
    </Layout>
  );
}
```

```ts [Vue]
<script setup lang="ts">
import Layout from './Layout'
import { Head } from '@wreathe-js/vue'

defineProps({ user: Object })
</script>

<template>
  <Layout>
    <Head title="Welcome" />
    <h1>Welcome</h1>
    <p>Hello {{ user.name }}, welcome to your first Wreathe app!</p>
  </Layout>
</template>
```

:::

Given the page above, you can render the page by returning a [Wreathe response](/guide/basic-usage/responses) from a controller or route. In this example, let's assume this page is stored at `resources/js/views/pages/user/show.vue` within the Laravel application.

```php
use Wreathe\Wreathe;

class UserController extends Controller
{
  public function show(User $user)
  {
    return Wreathe::render('User/Show', [
      'user' => $user
    ]);
  }
}
```
