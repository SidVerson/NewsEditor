import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MyQuoteComponent from '~/components/MyQuoteComponent.vue'

export const myQuote = Node.create({
  name: 'quote',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      author: {
        default: null
      },
      title: {
        default: null
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="quote"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'quote' }, 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(MyQuoteComponent)
  },

  addCommands() {
    return {
      setQuote: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
          content: [
            {
              type: 'text',
              text: 'Введите текст цитаты...'
            }
          ]
        })
      }
    }
  }
})
