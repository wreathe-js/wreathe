# File uploads

## `FormData` conversion

When making Wreathe requests that include files (even nested files), Wreathe will automatically convert the request data into a `FormData` object. This conversion is necessary in order to submit a `multipart/form-data` request via XHR.

If you would like the request to always use a `FormData` object regardless of whether a file is present in the data, you may provide the `forceFormData` option when making the request.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post('/users', data, {
  forceFormData: true,
})
```

You can learn more about the `FormData` interface via its [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## File upload example

Let's examine a complete file upload example using Wreathe. This example includes both a `name` text input and an `avatar` file input.

::: code-group

```ts [Preact]
import { useForm } from '@wreathe-js/preact'

const { data, setData, post, progress } = useForm({
  name: null,
  avatar: null,
})

function submit(e) {
  e.preventDefault()
  post('/users')
}

return (
  <form onSubmit={submit}>
    <input
      type="text"
      value={data.name}
      onChange={(e) => setData('name', e.target.value)}
    />
    <input
      type="file"
      value={data.avatar}
      onChange={(e) => setData('avatar', e.target.files[0])}
    />
    {progress && (
      <progress value={progress.percentage} max="100">
        {progress.percentage}%
      </progress>
    )}
    <button type="submit">Submit</button>
  </form>
)
```

```ts [React]
import { useForm } from '@wreathe-js/react'

const { data, setData, post, progress } = useForm({
  name: null,
  avatar: null,
})

function submit(e) {
  e.preventDefault()
  post('/users')
}

return (
  <form onSubmit={submit}>
    <input
      type="text"
      value={data.name}
      onChange={(e) => setData('name', e.target.value)}
    />
    <input
      type="file"
      value={data.avatar}
      onChange={(e) => setData('avatar', e.target.files[0])}
    />
    {progress && (
      <progress value={progress.percentage} max="100">
        {progress.percentage}%
      </progress>
    )}
    <button type="submit">Submit</button>
  </form>
)
```

```ts [Vue]
<script setup lang="ts">
import { useForm } from '@wreathe-js/vue'

const form = useForm({
  name: null,
  avatar: null,
})

function submit() {
  form.post('/users')
}
</script>

<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.name" />
    <input type="file" @input="form.avatar = $event.target.files[0]" />
    <progress v-if="form.progress" :value="form.progress.percentage" max="100">
      {{ form.progress.percentage }}%
    </progress>
    <button type="submit">Submit</button>
  </form>
</template>
```

:::

This example uses the Wreathe [form helper](/guide/basic-usage/forms#form-helper) for convenience, since the form helper provides easy access to the current upload progress. However, you are free to submit your forms using [manual Wreathe visits](/guide/basic-usage/manual-visits) as well.

## Multipart limitations

Uploading files using a `multipart/form-data` request is not natively supported in some languages for the `PUT`, `PATCH`, or `DELETE` methods. The simplest workaround for this limitation is to simply upload files using a `POST` request instead.

However, some frameworks, such as Laravel and Rails, support form method spoofing, which allows you to upload the files using `POST`, but have the framework handle the request as a `PUT` or `PATCH` request. This is done by including a `_method` attribute in the data of your request.

```ts
import { router } from '@wreathe-js/<preact|react|vue>'

router.post(`/users/${user.id}`, {
  _method: 'put',
  avatar: form.avatar,
})
```
