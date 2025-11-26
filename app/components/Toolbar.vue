<template>
  <bubble-menu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    :should-show="shouldShow"
    class="flex bg-white rounded-md shadow-md p-1 mb-2.5"
  >
    <div class="flex items-center relative">
      <button
        :class="{ 'bg-gray-100/80': showContentTypeMenu }"
        class="flex items-center text-sm px-2.5 py-1.5 rounded hover:bg-gray-100/80"
        @click="toggleContentTypeMenu"
      >
        {{ currentContentType }}
        <Icon
          name="mdi:chevron-down"
          class="w-3.5 h-3.5 ml-1"
        />
      </button>
      <div
        v-if="showContentTypeMenu"
        class="absolute top-full left-0 bg-white rounded-md shadow-md z-10 py-1.5 min-w-[140px]"
      >
        <button
          v-for="type in contentTypes"
          :key="type.name"
          :class="{
            'bg-gray-100/80 rounded': editor.isActive(type.name, type.attrs)
          }"
          class="flex items-center justify-center w-full text-left px-3 py-2 hover:bg-gray-100/80 rounded"
          @click="setContentType(type.command)"
        >
          <div
            class="border border-gray-200 rounded-full w-5 h-5 grid place-items-center"
          >
            <Icon
              :name="type.icon"
              class="w-2.5 h-2.5"
            />
          </div>
          <span class="flex-grow text-sm ml-2">{{ type.label }}</span>
        </button>
      </div>
    </div>
    <div class="w-px my-auto h-8 bg-gray-200/70 mx-1" />
    <div class="flex items-center space-x-2">
      <button
        v-for="action in textActions"
        :key="action.name"
        :class="{
          'bg-gray-100/80 text-gray-900': editor.isActive(action.name)
        }"
        :title="action.label"
        class="rounded hover:bg-gray-100/80 w-8 h-8 grid place-items-center"
        @click="action.command()"
      >
        <Icon
          :name="action.icon"
          class="h-5 w-5"
        />
      </button>
    </div>
    <div class="flex items-center relative">
      <button
        :class="{ 'bg-gray-100/80 text-gray-900': showColorMenu }"
        class="rounded hover:bg-gray-100/80 w-8 h-8 grid place-items-center"
        title="Text color"
        @click="toggleColorMenu"
      >
        <Icon
          name="material-symbols-light:format-color-text"
          class="w-5 h-5"
        />
      </button>
      <div
        v-if="showColorMenu"
        class="absolute top-full left-0 bg-white rounded-md shadow-md z-10 py-1.5"
      >
        <button
          v-for="color in colors"
          :key="color.name"
          :class="{
            'bg-gray-100/80': editor.isActive('textStyle', {
              color: color.value
            })
          }"
          class="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100/80 rounded"
          @click="setTextColor(color.value)"
        >
          <span
            class="w-4 h-4 rounded-full mr-2 border-2 border-gray-200"
            :style="{ backgroundColor: color.value }"
          />
          <span class="text-sm font-medium text-gray-600">{{
            color.name
          }}</span>
        </button>
      </div>
    </div>
  </bubble-menu>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

interface ContentType {
  name: string
  label: string
  icon: string
  command: () => void
  attrs?: Record<string, unknown>
}

interface TextAction {
  name: string
  label: string
  icon: string
  command: () => void
}

interface Color {
  name: string
  value: string
}

const props = defineProps<{
  editor?: Editor
}>()

const showContentTypeMenu = ref(false)
const showColorMenu = ref(false)

const shouldShow = (props: {
  editor: Editor
  view: EditorView
  state: EditorState
  oldState?: EditorState
  from: number
  to: number
}) => {
  const { state, from } = props
  const { doc, selection } = state
  const { empty } = selection

  if (empty) return false

  const nodeAtSelection = doc.nodeAt(from)
  if (nodeAtSelection && nodeAtSelection.type.name === 'imageEditor') {
    return false
  }

  return true
}

const contentTypes: ContentType[] = [
  {
    name: 'paragraph',
    label: 'Текст',
    icon: 'mdi:text',
    command: () => props.editor?.chain().focus().setParagraph().run()
  },
  {
    name: 'heading',
    label: 'Заголовок 1',
    icon: 'mdi:format-header-1',
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    attrs: { level: 1 }
  },
  {
    name: 'heading',
    label: 'Заголовок 2',
    icon: 'mdi:format-header-2',
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    attrs: { level: 2 }
  },
  {
    name: 'heading',
    label: 'Заголовок 3',
    icon: 'mdi:format-header-3',
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    attrs: { level: 3 }
  },
  {
    name: 'bulletList',
    label: 'Маркированный список',
    icon: 'material-symbols-light:format-list-bulleted',
    command: () => props.editor?.chain().focus().toggleBulletList().run()
  },
  {
    name: 'orderedList',
    label: 'Нумерованный список',
    icon: 'material-symbols-light:format-list-numbered',
    command: () => props.editor?.chain().focus().toggleOrderedList().run()
  },
  {
    name: 'codeBlock',
    label: 'Код',
    icon: 'mdi:code-tags',
    command: () => props.editor?.chain().focus().toggleCodeBlock().run()
  },
  {
    name: 'blockquote',
    label: 'Цитата',
    icon: 'mdi:format-quote-close',
    command: () => props.editor?.chain().focus().toggleBlockquote().run()
  },
  {
    name: 'Моя цитата',
    icon: 'mdi:minus',
    command: () => {
      const author = prompt('Автор цитаты:')
      const title = prompt('Должность/титул автора:')

      props.editor?.chain().focus().setQuote({ author, title }).run()
    }
  }
]

const textActions: TextAction[] = [
  {
    name: 'bold',
    label: 'Жирный',
    icon: 'material-symbols-light:format-bold',
    command: () => props.editor?.chain().focus().toggleBold().run()
  },
  {
    name: 'italic',
    label: 'Курсив',
    icon: 'material-symbols-light:format-italic',
    command: () => props.editor?.chain().focus().toggleItalic().run()
  },
  {
    name: 'strike',
    label: 'Перечеркнутый',
    icon: 'material-symbols-light:format-strikethrough',
    command: () => props.editor?.chain().focus().toggleStrike().run()
  },
  {
    name: 'bulletList',
    label: 'Маркированный список',
    icon: 'material-symbols-light:format-list-bulleted',
    command: () => props.editor?.chain().focus().toggleBulletList().run()
  },
  {
    name: 'orderedList',
    label: 'Нумерованный список',
    icon: 'material-symbols-light:format-list-numbered',
    command: () => props.editor?.chain().focus().toggleOrderedList().run()
  }
]

const colors: Color[] = [
  { name: 'По умолчанию', value: 'inherit' },
  { name: 'Серый', value: '#6B7280' },
  { name: 'Коричневый', value: '#92400E' },
  { name: 'Оранжевый', value: '#EA580C' },
  { name: 'Желтый', value: '#CA8A04' },
  { name: 'Зеленый', value: '#16A34A' },
  { name: 'Синий', value: '#2563EB' },
  { name: 'Фиолетовый', value: '#9333EA' },
  { name: 'Розовый', value: '#DB2777' },
  { name: 'Красный', value: '#DC2626' }
]

const currentContentType = computed(() => {
  if (props.editor?.isActive('heading', { level: 1 })) return 'Заголовок 1'
  if (props.editor?.isActive('heading', { level: 2 })) return 'Заголовок 2'
  if (props.editor?.isActive('heading', { level: 3 })) return 'Заголовок 3'
  if (props.editor?.isActive('bulletList')) return 'Маркированный список'
  if (props.editor?.isActive('orderedList')) return 'Нумерованный список'
  if (props.editor?.isActive('codeBlock')) return 'Код'
  if (props.editor?.isActive('blockquote')) return 'Цитата'
  return 'Текст'
})

const toggleContentTypeMenu = () => {
  showContentTypeMenu.value = !showContentTypeMenu.value
  showColorMenu.value = false
}

const toggleColorMenu = () => {
  showColorMenu.value = !showColorMenu.value
  showContentTypeMenu.value = false
}

const setContentType = (command: () => void) => {
  command()
  showContentTypeMenu.value = false
}

const setTextColor = (color: string) => {
  props.editor?.chain().focus().setColor(color).run()
  showColorMenu.value = false
}
</script>
