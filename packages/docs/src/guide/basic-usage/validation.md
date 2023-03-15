# Validation

## How it works

Handling server-side validation errors in Wreathe works differently than a classic XHR-driven form that requires you to catch the validation errors from `422` responses and manually update the form's error state - because Wreathe never receives `422` responses. Instead, Wreathe operates much more like a standard full page form submission. Here's how:

First, you [submit your form](/guide/basic-usage/forms) using Wreathe. If there are server-side validation errors, you don't return those errors as a `422` JSON response. Instead, you redirect (server-side) the user back to the form page they were previously on, flashing the validation errors in the session. Some frameworks, such as Laravel, do this automatically.

Next, any time these validation errors are present in the session, they automatically get shared with Wreathe, making them available client-side as page props which you can display in your form. Since props are reactive, they are automatically shown when the form submission completes.

Finally, since Wreathe apps never generate `422` responses, Wreathe needs another way to determine if a response includes validation errors. To do this, Wreathe checks the `page.props.errors` object for the existence of any errors. In the event that errors are present, the request's `onError()` callback will be called instead of the `onSuccess()` callback.

## Sharing errors

In order for your server-side validation `errors` to be available client-side, your server-side framework must share them via the errors prop. Wreathe's first-party adapters, such as the Laravel adapter, do this automatically. For others, you may need to do this manually. Please refer to your specific server-side adapter documentation for more information.

## Displaying errors

Since validation errors are made available client-side as page component props, you can conditionally display them based on their existence. Remember, when using our first-party server adapters (such as the Laravel adapter), the `errors` prop will automatically be available to your page.

::: code-group

```ts [Preact]
import { useState } from "preact/hooks";
import { router, usePage } from "@wreathe-js/preact";

export default function Edit() {
  const { errors } = usePage().props;

  const [values, setValues] = useState({
    first_name: null,
    last_name: null,
    email: null,
  });

  function handleChange(e) {
    setValues((values) => ({
      ...values,
      [e.target.id]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.post("/users", values);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label for="first_name">First name:</label>
      <input
        id="first_name"
        value={values.first_name}
        onChange={handleChange}
      />
      {errors.first_name && <div>{errors.first_name}</div>}
      <label for="last_name">Last name:</label>
      <input id="last_name" value={values.last_name} onChange={handleChange} />
      {errors.last_name && <div>{errors.last_name}</div>}
      <label for="email">Email:</label>
      <input id="email" value={values.email} onChange={handleChange} />
      {errors.email && <div>{errors.email}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

```ts [React]
import { useState } from "react";
import { router, usePage } from "@wreathe-js/react";

export default function Edit() {
  const { errors } = usePage().props;

  const [values, setValues] = useState({
    first_name: null,
    last_name: null,
    email: null,
  });

  function handleChange(e) {
    setValues((values) => ({
      ...values,
      [e.target.id]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.post("/users", values);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label for="first_name">First name:</label>
      <input
        id="first_name"
        value={values.first_name}
        onChange={handleChange}
      />
      {errors.first_name && <div>{errors.first_name}</div>}
      <label for="last_name">Last name:</label>
      <input id="last_name" value={values.last_name} onChange={handleChange} />
      {errors.last_name && <div>{errors.last_name}</div>}
      <label for="email">Email:</label>
      <input id="email" value={values.email} onChange={handleChange} />
      {errors.email && <div>{errors.email}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

```ts [Vue]
<script setup lang="ts">
import { reactive } from 'vue'
import { router } from '@wreathe-js/vue'

defineProps({ errors: Object })

const form = reactive({
  first_name: null,
  last_name: null,
  email: null,
})

function submit() {
  router.post('/users', form)
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="first_name">First name:</label>
    <input id="first_name" v-model="form.first_name" />
    <div v-if="errors.first_name">{{ errors.first_name }}</div>
    <label for="last_name">Last name:</label>
    <input id="last_name" v-model="form.last_name" />
    <div v-if="errors.last_name">{{ errors.last_name }}</div>
    <label for="email">Email:</label>
    <input id="email" v-model="form.email" />
    <div v-if="errors.email">{{ errors.email }}</div>
    <button type="submit">Submit</button>
  </form>
</template>
```

:::

::: warning

When using the Vue adapter, you may also access the errors via the `$page.props.errors` object.

:::

## Repopulating input

While handling errors in Wreathe is similar to full page form submissions, Wreathe offers even more benefits. In fact, you don't even need to manually repopulate old form input data.

When validation errors occur, the user is typically redirected back to the form page they were previously on. And, by default, Wreathe automatically preserves the [component state](/guide/basic-usage/manual-visits#state-preservation) for `post`, `put`, `patch`, and `delete` requests. Therefore, all the old form input data remains exactly as it was when the user submitted the form.

So, the only work remaining is to display any validation errors using the `errors` prop.

## Error bags

::: warning

If you're using the [form helper](/guide/basic-usage/forms#form-helper), it's not necessary to use error bags since validation errors are automatically scoped to the form object making the request.

:::

For pages that have more than one form, it's possible to encounter conflicts when displaying validation errors if two forms share the same field names. For example, imagine a "create company" form and a "create user" form that both have a `name` field. Since both forms will be displaying the `page.props.errors.name` validation error, generating a validation error for the `name` field in either form will cause the error to appear in both forms.

To solve this issue, you can use "error bags". Error bags scope the validation errors returned from the server within a unique key specific to that form. Continuing with our example above, you might have a `createCompany` error bag for the first form and a `createUser` error bag for the second form.

Specifying an error bag will cause the validation errors to come back from the server within `page.props.errors.createCompany` and `page.props.errors.createUser`.
