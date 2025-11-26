import { VueRenderer } from '@tiptap/vue-3'
import type { Instance as TippyInstance } from 'tippy.js'
import tippy from 'tippy.js'
import type { Editor, Range } from '@tiptap/core'
import CommandsList from '~/components/CommandsList.vue'

interface SuggestionItem {
  name: string
  description: string
  icon: string
  command: (props: { editor: Editor, range: Range }) => void
}

interface SuggestionProps {
  query: string
  editor: Editor
  range: Range
  clientRect: () => DOMRect
}

const items: SuggestionItem[] = [
  {
    name: 'Текст',
    description: 'Просто начните писать обычный текст.',
    icon: 'mdi:text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    }
  },
  {
    name: 'Заголовок 1',
    description: 'Большой заголовок раздела.',
    icon: 'mdi:format-header-1',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    }
  },
  {
    name: 'Заголовок 2',
    description: 'Средний заголовок раздела.',
    icon: 'mdi:format-header-2',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    }
  },
  {
    name: 'Заголовок 3',
    description: 'Маленький заголовок раздела.',
    icon: 'mdi:format-header-3',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    }
  },
  {
    name: 'Маркированный список',
    description: 'Создать простой маркированный список.',
    icon: 'mdi:format-list-bulleted',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    }
  },
  {
    name: 'Нумерованный список',
    description: 'Создать список с нумерацией.',
    icon: 'mdi:format-list-numbered',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    }
  },
  {
    name: 'Цитата',
    description: 'Добавить цитату.',
    icon: 'mdi:format-quote-close',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    }
  },
  {
    name: 'Блок кода',
    description: 'Добавить блок кода с подсветкой синтаксиса',
    icon: 'mdi:code-tags',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('codeBlock').run()
    }
  },
  {
    name: 'Изображение',
    description: 'Редактировать изображение',
    icon: 'mdi:image',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'imageEditor',
          attrs: {}
        })
        .run()
    }
  },
  {
    name: 'Разделитель',
    description: 'Вставить горизонтальную линию.',
    icon: 'mdi:minus',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    }
  },
  {
    name: 'Моя цитата',
    description: 'Вставить кастомную цитату.',
    icon: 'mdi:format-quote-close',
    command: ({ editor, range }) => {
      const author = prompt('Автор цитаты:')
      const title = prompt('Должность/титул автора:')

      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setQuote({ author, title })
        .run()
    }
  },
  {
    name: 'Заключение',
    description: 'Добавить блок заключения.',
    icon: 'mdi:check-circle-outline',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setConclusion()
        .run()
    }
  }
]

export const suggestion = {
  items: ({ query }: { query: string }): SuggestionItem[] => {
    return items.filter(item =>
      item.name.toLowerCase().startsWith(query.toLowerCase())
    )
  },

  render: () => {
    let component: VueRenderer
    let popup: TippyInstance[]

    return {
      onStart: (props: SuggestionProps) => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        })
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown(props.event)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}

export default suggestion
