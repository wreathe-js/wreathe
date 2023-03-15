# Manual visits

In addition to [creating links](/guide/basic-usage/links), it's also possible to manually make Wreathe visits / requests programatically via JavaScript. This is accomplished via the `router.visit()` method.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.visit(url, {
  method: 'get',
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
})
```

However, it's generally more convenient to use one of Wreathe's shortcut request methods instead. These methods share all the same options as `router.visit()`.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

The `reload()` method is simply a shorthand method that automatically visits the current page with `preserveState` and `preserveScroll` both set to `true`, making it a convenient method to invoke when you would like to simply reload the current page's data.

## Method

When making manual visits, you may use the `method` option to set the request's HTTP method to `get`, `post`, `put`, `patch` or `delete`. The default method is `get`.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.visit(url, { method: 'post' })
```

::: warning

Uploading files via `put` or `patch` is not supported in Laravel. Instead, make the request via `post`, including a `_method` field set to `put` or `patch`. This is called [form method spoofing](https://laravel.com/docs/master/routing#form-method-spoofing).

:::

## Data

You may use the `data` option to add data to the request.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.visit('/users', {
  method: 'post',
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
})
```

For convenience, the `get()`, `post()`, `put()` and `patch()` methods all accept `data` as their second argument.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', {
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

## Custom headers

The `headers` option allows you to add custom headers to a request.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', data, {
  headers: {
    'Custom-Header': 'value',
  },
})
```

::: warning

The headers Wreathe uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

:::

## File uploads

When making visits / requests that include files, Wreathe will automatically convert the request data into a `FormData` object. If you would like the visit to always use a `FormData` object, you can force this using the `forceFormData` option.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/companies', data, {
  forceFormData: true,
})
```

For more information on uploading files, please consult the dedicated [file uploads](/guide/basic-usage/file-uploads) documentation.

## Browser history

When making visits, Wreathe automatically adds a new entry into the browser history. However, it's also possible to replace the current history entry by setting the `replace` option to `true`.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.get('/users', { search: 'John' }, { replace: true })
```

::: warning

Visits made to the same URL automatically set `replace` to `true`.

:::

## State preservation

By default, page visits to the same page create a fresh page component instance. This causes any local state, such as form inputs, scroll positions and focus states to be lost.

However, in some situations, it's necessary to preserve the page component state. For example, when submitting a form, you need to preserve your form data in the event that form validation fails on the server.

You can instruct Wreathe to preserve the component's state by setting the `preserveState` option to `true`.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.get('/users', { search: 'John' }, { preserveState: true })
```

You can also lazily evaluate the `preserveState` option based on the response by providing a callback to the `preserveState` option.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', data, {
  preserveState: (page) => Object.keys(page.props.errors).length,
})
```

For convenience, the `post`, `put`, `patch`, `delete`, and `reload` methods all set the `preserveState` option to `true` by default.

## Scroll preservation

When navigating between pages, Wreathe mimics default browser behaviour by automatically resetting the scroll position of the document body (as well as any [scroll regions](/advanced-usage/scroll-management#scroll-regions) you've defined) back to the top of the page. However, you may use the `preserveScroll` option to disable this behaviour.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.visit(url, { preserveScroll: true })
```

You can also lazily evaluate the `preserveScroll` option based on the response by providing a callback.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', data, {
  preserveScroll: (page) => Object.keys(page.props.errors).length,
})
```

For more information regarding this feature, please consult the [scroll management](/advanced-usage/scroll-management) documentation.

## Partial reloads

The `only` option allows you to request a subset of the props (data) from the server on subsequent visits to the same page, thus making your application more efficient since it does not need to retrieve data that the page is not interested in refreshing.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.visit('/users', { search: 'John' }, { only: ['users'] })
```

For more information on this feature, please consult the [partial reloads](/advanced-usage/partial-reloads) documentation.

## Visit cancellation

You can cancel a visit using a cancel token, which Wreathe automatically generates and provides via the `onCancelToken()` callback prior to making the visit.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Cancel the visit...
this.cancelToken.cancel()
```

The `onCancel()` and `onFinish()` event callbacks will be executed when a visit is cancelled.

## Event callbacks

In addition to Wreathe's [global events](/advanced-usage/events), Wreathe also provides a number of per-visit event callbacks.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
})
```

Returning `false` from the `onBefore()` callback will cause the visit to be cancelled.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.delete(`/users/${user.id}`, {
  onBefore: () => confirm('Are you sure you want to delete this user?'),
})
```

It's also possible to return a promise from the `onSuccess()` and `onError()` callbacks. When doing so, the "finish" event will be delayed until the promise has resolved.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post(url, {
  onSuccess: () => {
    return Promise.all([
      this.doThing(),
      this.doAnotherThing()
    ])
  }
  onFinish: visit => {
    // This won't be called until doThing()
    // and doAnotherThing() have finished.
  },
})
```
