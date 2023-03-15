# Links

To create links to other pages within an Wreathe app, you will typically use the Wreathe `<Link>` component. This component is a light wrapper around a standard anchor `<a>` link that intercepts click events and prevents full page reloads from occurring. This is how Wreathe provides a single-page app experience once your application has been loaded.

## Creating links

To create an Wreathe link, use the Wreathe `<Link>` component. Any attributes you provide to this component will be proxied to the underlying HTML tag.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link href="/">Home</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link href="/">Home</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/">Home</Link>
```

:::

By default, Wreathe renders links as anchor `<a>` elements. However, you can change the tag using the `as` attribute.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link href="/logout" method="post" as="button" type="button">Logout</Link>

// Renders as...
<button type="button">Logout</button>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link href="/logout" method="post" as="button" type="button">Logout</Link>

// Renders as...
<button type="button">Logout</button>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/logout" method="post" as="button" type="button">Logout</Link>

// Renders as...
<button type="button">Logout</button>
```

:::

::: warning

Creating `POST`/`PUT`/`PATCH`/`DELETE` anchor `<a>` links is discouraged as it causes "Open Link in New Tab / Window" accessibility issues. Instead, consider using a more appropriate element, such as a `<button>`.

:::

## Method

You can specify the HTTP request method for an Wreathe link request using the method attribute. The default `method` used by links is GET, but you can use the `method` attribute to make `POST`, `PUT`, `PATCH`, and `DELETE` requests via links.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link href="/logout" method="post" as="button">
  Logout
</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link href="/logout" method="post" as="button">
  Logout
</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/logout" method="post" as="button">
  Logout
</Link>
```

:::

## Data

When making `POST` or `PUT` requests, you may wish to add additional `data` to the request. You can accomplish this using the data attribute. The provided data can be an `object` or `FormData` instance.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link href="/endpoint" method="post" data={{ foo: bar }}>
  Save
</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link href="/endpoint" method="post" data={{ foo: bar }}>
  Save
</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/endpoint" method="post" :data="{ foo: bar }">Save</Link>
```

:::

## Custom headers

The `headers` attribute allows you to add custom headers to an Wreathe link. However, you should note that the headers Wreathe uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link href="/endpoint" headers={{ foo: bar }}>
  Save
</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link href="/endpoint" headers={{ foo: bar }}>
  Save
</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/endpoint" :headers="{ foo: bar }">Save</Link>
```

:::

## Browser history

The `replace` attribute allows you to specify the browser's history behaviour. By default, page visits push (new) state (`window.history.pushState`) into the history; however, it's also possible to replace state (`window.history.replaceState`) by setting the `replace` attribute to true. This will cause the visit to replace the current history state instead of adding a new history state to the stack.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link replace href="/">
  Home
</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link replace href="/">
  Home
</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/" replace>
  Home
</Link>
```

:::

## State preservation

You can preserve a page component's local state using the `preserve-state` attribute. This will prevent a page component from fully re-rendering. The `preserve-state` attribute is especially helpful with forms, since you can avoid manually repopulating input fields and can also maintain a focused input.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<input onChange={this.handleChange} value={query} />

<Link href="/search" data={query} preserveState>Search</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<input onChange={this.handleChange} value={query} />

<Link href="/search" data={query} preserveState>Search</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<input v-model="query" type="text" />

<Link href="/search" :data="{ query }" preserve-state>Search</Link>
```

:::

## Scroll preservation

You can use the `preserve-scroll` attribute to prevent Wreathe from automatically resetting the scroll position when making a page visit.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link preserveScroll href="/">
  Home
</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link preserveScroll href="/">
  Home
</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/" preserve-scroll>
  Home
</Link>
```

:::

For more information on managing scroll position, please consult the documentation on [scroll management](/advanced-usage/scroll-management).

## Partial reloads

The `only` attribute allows you to specify that only a subset of a page's props (data) should be retrieved from the server on subsequent visits to that page.

::: code-group

```ts [Preact]
import { Link } from '@wreathe-js/preact'

<Link href="/users?active=true" only={["users"]}>
  Show active
</Link>
```

```ts [React]
import { Link } from '@wreathe-js/react'

<Link href="/users?active=true" only={["users"]}>
  Show active
</Link>
```

```ts [vue]
import { Link } from '@wreathe-js/vue'

<Link href="/users?active=true" :only="['users']">Show active</Link>
```

:::

For more information on this topic, please consult the complete documentation on [partial reloads](/advanced-usage/partial-reloads).

## Active states

It's often desirable to set an active state for navigation links based on the current page. This can be accomplished when using Wreathe by inspecting the `page` object and doing string comparisons against the `page.url` and `page.component` properties.

::: code-group

```ts [Preact]
import { usePage } from '@wreathe-js/preact'

const { url, component } = usePage()

// URL exact match...
<Link href="/users" className={url === '/users' ? 'active' : ''}>Users</Link>

// Component exact match...
<Link href="/users" className={component === 'Users/Index' ? 'active' : ''}>Users</Link>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" className={url.startsWith('/users') ? 'active' : ''}>Users</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" className={component.startsWith('Users') ? 'active' : ''}>Users</Link>
```

```ts [React]
import { usePage } from '@wreathe-js/react'

const { url, component } = usePage()

// URL exact match...
<Link href="/users" className={url === '/users' ? 'active' : ''}>Users</Link>

// Component exact match...
<Link href="/users" className={component === 'Users/Index' ? 'active' : ''}>Users</Link>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" className={url.startsWith('/users') ? 'active' : ''}>Users</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" className={component.startsWith('Users') ? 'active' : ''}>Users</Link>
```

```ts [vue]
import { usePage } from '@wreathe-js/vue'

// URL exact match...
<Link href="/users" :class="{ 'active': $page.url === '/users' }">Users</Link>

// Component exact match...
<Link href="/users" :class="{ 'active': $page.component === 'Users/Index' }">Users</Link>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" :class="{ 'active': $page.url.startsWith('/users') }">Users</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" :class="{ 'active': $page.component.startsWith('Users') }">Users</Link>
```

:::

You can perform exact match comparisons (`===`), `startsWith()` comparisons (useful for matching a subset of pages), or even more complex comparisons using regular expressions.

Using this approach, you're not limited to just setting class names. You can use this technique to conditionally render any markup on active state, such as different link text or even an SVG icon that represents the link is active.
