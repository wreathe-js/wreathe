// @ts-nocheck
import { Fragment } from 'preact'

import Footer from '@/views/components/footer'
import Header from '@/views/components/header'

export default function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </Fragment>
  )
}
