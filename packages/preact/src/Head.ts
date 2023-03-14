import HeadContext from './HeadContext'
import { cloneElement } from 'preact'
import { useContext, useEffect, useMemo } from 'preact/hooks'

export type HeadManager = {
  forceUpdate: () => void
  createProvider: () => {
    update: HeadManagerOnUpdate
    disconnect: () => void
  }
}

export type HeadManagerOnUpdate = (elements: string[]) => void

type WreatheHeadProps = {
  title?: string
  children?: preact.ComponentChildren
}

type WreatheHead = preact.FunctionComponent<WreatheHeadProps>

const Head: WreatheHead = ({ children, title }) => {
  const headManager = useContext(HeadContext)
  const provider = useMemo(() => headManager.createProvider(), [headManager])

  useEffect(() => {
    return () => {
      provider.disconnect()
    }
  }, [provider])

  function isUnaryTag(node: any) {
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
  }

  function renderTagStart(node: any) {
    const attrs = Object.keys(node.props).reduce((carry, name) => {
      if (['head-key', 'children', 'dangerouslySetInnerHTML'].includes(name)) {
        return carry
      }
      const value = node.props[name]
      if (value === '') {
        // rome-ignore lint: temp
        return carry + ` ${name}`
      } else {
        // rome-ignore lint: temp
        return carry + ` ${name}="${value}"`
      }
    }, '')
    return `<${node.type}${attrs}>`
  }

  function renderTagChildren(node: any) {
    return typeof node.props.children === 'string'
      ? node.props.children
      : node.props.children.reduce(
          (html: any, child: any) => html + renderTag(child),
          ''
        )
  }

  function renderTag(node: any) {
    let html = renderTagStart(node)
    if (node.props.children) {
      html += renderTagChildren(node)
    }
    if (node.props.dangerouslySetInnerHTML) {
      html += node.props.dangerouslySetInnerHTML.__html
    }
    if (!isUnaryTag(node)) {
      html += `</${node.type}>`
    }
    return html
  }

  function ensureNodeHasWreatheProp(node: any) {
    return cloneElement(node, {
      wreathe:
        node.props['head-key'] !== undefined ? node.props['head-key'] : '',
    })
  }

  function renderNode(node: any) {
    return renderTag(ensureNodeHasWreatheProp(node))
  }

  function renderNodes(nodes: any) {
    const computed = (Array.isArray(nodes) ? nodes : [nodes])
      .filter((node) => node)
      .map((node) => renderNode(node))
    if (title && !computed.find((tag) => tag.startsWith('<title'))) {
      computed.push(`<title wreathe>${title}</title>`)
    }
    return computed
  }

  provider.update(renderNodes(children))

  return null
}

export default Head
