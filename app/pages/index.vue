<template>
  <ClientOnly>
    <div class="editor-container max-w-3xl mx-auto my-8 flex flex-col">
      <ExportButtons
        :editor="editor"
        class="mt-4 self-end"
      />
      <Toolbar :editor="editor" />
      <editor-content
        :editor="editor"
        class="prose max-w-none"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Color } from '@tiptap/extension-color'
import { TextStyleKit } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import { common, createLowlight } from 'lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import Commands from '~/extensions/Commands'
import suggestion from '~/extensions/Suggestion'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlock from '~/components/CodeBlock.vue'
import Image from '@tiptap/extension-image'
import ExportButtons from '~/components/ExportButtons.vue'
import { initialContent } from '~/data/initialContent'
import { ImageEditorNode } from '~/extensions/ImageEditor'
import { myQuote } from '~/extensions/myQuote'
import { Conclusion } from '~/extensions/conclusion'

const lowlight = createLowlight(common)

const editor = useEditor({
  content: initialContent,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }

    }),
    Color,
    Image,
    TextStyleKit,
    ImageEditorNode,
    CodeBlockLowlight.extend({
      addNodeView() {
        return VueNodeViewRenderer(CodeBlock)
      }
    }).configure({ lowlight }),
    Commands.configure({
      suggestion
    }),
    Placeholder.configure({
      placeholder: 'Введите \'/\' для блока команд'
    }),
    myQuote,
    Conclusion
  ]
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
