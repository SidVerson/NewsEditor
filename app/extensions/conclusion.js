import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ConclusionComponent from './ConclusionComponent.vue'

export const Conclusion = Node.create({
  name: 'conclusion',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="conclusion"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'conclusion' }, 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(ConclusionComponent)
  },

  addCommands() {
    return {
      setConclusion: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [
            {
              type: 'text',
              text: 'Текст заключения...'
            }
          ]
        })
      }
    }
  },
})
