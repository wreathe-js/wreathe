export default {
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  // @ts-expect-error TS(7023): 'data' implicitly has return type 'any' because it... Remove this comment to see the full error message
  data() {
    return {
      // @ts-expect-error TS(2339): Property '$headManager' does not exist on type '{ ... Remove this comment to see the full error message
      provider: this.$headManager.createProvider(),
    }
  },
  beforeUnmount() {
    // @ts-expect-error TS(2339): Property 'provider' does not exist on type '{ prop... Remove this comment to see the full error message
    this.provider.disconnect()
  },
  methods: {
    isUnaryTag(node: any) {
      return (
        [
          'area',
          'base',
          'br',
          'col',
          'embed',
          'hr',
          'img',
          'input',
          'keygen',
          'link',
          'meta',
          'param',
          'source',
          'track',
          'wbr',
        ].indexOf(node.type) > -1
      )
    },
    renderTagStart(node: any) {
      node.props = node.props || {}
      node.props.wreathe =
        node.props['head-key'] !== undefined ? node.props['head-key'] : ''
      const attrs = Object.keys(node.props).reduce((carry, name) => {
        const value = node.props[name]
        if (['key', 'head-key'].includes(name)) {
          return carry
        } else if (value === '') {
          return carry + ` ${name}`
        } else {
          return carry + ` ${name}="${value}"`
        }
      }, '')
      return `<${node.type}${attrs}>`
    },
    renderTagChildren(node: any) {
      return typeof node.children === 'string'
        ? node.children
        : node.children.reduce(
            (html: any, child: any) => html + this.renderTag(child),
            ''
          )
    },
    renderTag(node: any) {
      if (node.type.toString() === 'Symbol(Text)') {
        return node.children
      } else if (node.type.toString() === 'Symbol()') {
        return ''
      } else if (node.type.toString() === 'Symbol(Comment)') {
        return ''
      }
      let html = this.renderTagStart(node)
      if (node.children) {
        html += this.renderTagChildren(node)
      }
      if (!this.isUnaryTag(node)) {
        html += `</${node.type}>`
      }
      return html
    },
    addTitleElement(elements: any) {
      if (
        // @ts-expect-error TS(2339): Property 'title' does not exist on type '{ isUnary... Remove this comment to see the full error message
        this.title &&
        !elements.find((tag: any) => tag.startsWith('<title'))
      ) {
        // @ts-expect-error TS(2339): Property 'title' does not exist on type '{ isUnary... Remove this comment to see the full error message
        elements.push(`<title wreathe>${this.title}</title>`)
      }
      return elements
    },
    renderNodes(nodes: any) {
      return this.addTitleElement(
        nodes
          .flatMap((node: any) =>
            node.type.toString() === 'Symbol(Fragment)' ? node.children : node
          )
          .map((node: any) => this.renderTag(node))
          .filter((node: any) => node)
      )
    },
  },
  render() {
    // @ts-expect-error TS(2339): Property 'provider' does not exist on type '{ prop... Remove this comment to see the full error message
    this.provider.update(
      // @ts-expect-error TS(2339): Property 'provider' does not exist on type '{ prop... Remove this comment to see the full error message
      this.renderNodes(this.$slots.default ? this.$slots.default() : [])
    )
  },
}
