# Title & meta

Since Wreathe powered JavaScript apps are rendered within the document `<body>`, they are unable to render markup to the document `<head>`, as it's outside of their scope. To help with this, Wreathe ships with an `<Head>` component which can be used to set the page `<title>`, `<meta>` tags, and other `<head>` elements.

::: warning

The `<Head>` component will only replace `<head>` elements that are not in your server-side root template.

:::

## Head component

To add `<head>` elements to your page, use the `<Head>` component. Within this component, you can include the elements that you wish to add to the document `<head>`.

::: code-group

```ts [Preact]
import { Head } from '@wreathe-js/preact'

<Head>
  <title>Your page title</title>
  <meta name="description" content="Your page description" />
</Head>
```

```ts [React]
import { Head } from '@wreathe-js/react'

<Head>
  <title>Your page title</title>
  <meta name="description" content="Your page description" />
</Head>
```

```ts [vue]
import { Head } from '@wreathe-js/vue'

<Head>
  <title>Your page title</title>
  <meta name="description" content="Your page description">
</Head>
```

:::

## Title shorthand

If you only need to add a `<title>` to the document `<head>`, you may simply pass the title as a prop to the `<Head>` component.

::: code-group

```ts [Preact]
import { Head } from '@wreathe-js/preact'

<Head title="Your page title" />
```

```ts [React]
import { Head } from '@wreathe-js/react'

<Head title="Your page title" />
```

```ts [vue]
import { Head } from "@wreathe-js/vue";

<Head title="Your page title" />
```

:::

## Title callback

You can globally modify the page `<title>` using the `title callback` in the `createWreatheApp` setup method. Typically, this method is invoked in your application's main JavaScript file. A common use case for the title callback is automatically adding an app name before or after each page title.

```ts
createWreatheApp({
  title: (title) => `${title} - My App`,
  // ...
})
```

After defining the title callback, the callback will automatically be invoked when you set a title using the `<Head>` component.

The title callback will also be invoked when you set the title using a `<title>` tag within your `<Head>` component.

Which, in this example, will result in the following `<title>` tag.

```html
<title>Home - My App</title>
```

The title callback will also be invoked when you set the title using a `<title>` tag within your `<Head>` component.

## Multiple Head instances

It's possible to have multiple instances of the `<Head>` component throughout your application. For example, your layout can set some default `<Head>` elements, and then your individual pages can overide those defaults.

::: code-group

```ts [Preact]
// layout.tsx
import { Head } from '@wreathe-js/preact'

<Head>
  <title>My app</title>
  <meta
    head-key="description"
    name="description"
    content="This is the default description"
  />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</Head>

// about.tsx
import { Head } from '@wreathe-js/preact'

<Head>
  <title>About - My app</title>
  <meta
    head-key="description"
    name="description"
    content="This is a page specific description"
  />
</Head>
```

```ts [React]
// layout.tsx
import { Head } from '@wreathe-js/react'

<Head>
  <title>My app</title>
  <meta
    head-key="description"
    name="description"
    content="This is the default description"
  />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</Head>

// about.tsx
import { Head } from '@wreathe-js/react'

<Head>
  <title>About - My app</title>
  <meta
    head-key="description"
    name="description"
    content="This is a page specific description"
  />
</Head>
```

```ts [vue]
// layout.vue
import { Head } from "@wreathe-js/vue";

<Head>
  <title>My app</title>
  <meta
    head-key="description"
    name="description"
    content="This is the default description"
  />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</Head>

// about.vue
import { Head } from "@wreathe-js/vue";

<Head>
  <title>About - My app</title>
  <meta
    head-key="description"
    name="description"
    content="This is a page specific description"
  />
</Head>
```

:::

Wreathe will only ever render one `<title>` tag; however, all other tags will be stacked since it's valid to have multiple instances of them. To avoid duplicate tags in your `<head>`, you can use the `head-key` property, which will make sure the tag is only rendered once. This is illustrated in the example above for the `<meta name="description">` tag.

The code example below contains the HTML created by the example above.

```html
<head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>About - My app</title>
  <meta name="description" content="This is a page specific description" />
</head>
```

## Head extension

When building a real application, it can sometimes be helpful to create a custom head component that extends Wreathe's `<Head>` component. This gives you a place to set app-wide defaults, such as appending the app name to the page title.

::: code-group

```ts [Preact]
// appHead.tsx
import { Head } from '@wreathe-js/preact'

const Site = ({ title, children }) => {
  return (
    <Head>
      <title>{title ? `${title} - My App` : "My App"}</title>
      {children}
    </Head>
  )
}

export default Site;
```

```ts [React]
// appHead.tsx
import { Head } from '@wreathe-js/react'

const Site = ({ title, children }) => {
  return (
    <Head>
      <title>{title ? `${title} - My App` : "My App"}</title>
      {children}
    </Head>
  )
}

export default Site;
```

```ts [vue]
// appHead.vue
<script setup lang="ts">
import { Head } from '@wreathe-js/vue'

defineProps({ title: String })
</script>

<template>
  <Head :title="title ? `${title} - My App` : 'My App'">
    <slot />
  </Head>
</template>
```

:::

Once you have created the custom component, you may simply start using the custom component in your pages.

```ts
import AppHead from './appHead'

<AppHead title="About">
```
