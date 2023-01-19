import { Fragment } from 'react'
import { Head } from '@wreathe-js/react'

import Layout from '@/views/layouts/default'

const Home = ({ versions }) => {
  return (
    <Fragment>
      <Head title="Home" />
      <h1>Quick start</h1>
      <p>
        Welcome to the Wreathe/React starter preset, with Laravel{' '}
        {versions.laravel} & PHP {versions.php}!
      </p>

      <h2>Conventions</h2>
      <p>
        The preset is using{' '}
        <a href="https://laravel-vite.dev/guide/extra-topics/inertia.html#conventions">
          Laravel Vite conventions
        </a>{' '}
        for a consistent and organized architecture:
      </p>
      <ul role="list">
        <li>
          File and directory names use <code>kebab-case</code> instead of{' '}
          <code>StudlyCase</code>
        </li>
        <li>
          Main entrypoint is <code>resources/application/main.tsx</code>
        </li>
        <li>
          SSR entrypoint is <code>resources/application/ssr.tsx</code>
        </li>
      </ul>

      <h3>Pages & Layouts</h3>
      <ul role="list">
        <li>
          Components are placed in the folder{' '}
          <code>resources/views/components</code>
        </li>
        <li>
          Layouts are placed in the folder <code>resources/views/layouts</code>
        </li>
        <li>
          Pages are placed in the folder <code>resources/views/pages</code>
        </li>
      </ul>

      <h3>Typescript Typings</h3>
      <p>
        Default typings can be found and extended in{' '}
        <code>resources/types/wreathe.d.ts</code>
      </p>

      <h3>Routes</h3>
      <p>
        Default routes can be modified in <code>routes/web.php</code>
      </p>

      <h3>Shared props</h3>
      <p>
        Default shared props can be modified in{' '}
        <code>app/Http/Middleware/HandleWreatheRequests.php</code>
      </p>

      <h3>Server-side rendering (SSR)</h3>
      <p>
        Default enabled can be modified in <code>config/wreathe.php</code>
      </p>
    </Fragment>
  )
}

Home.layout = (page) => <Layout children={page} />

export default Home
