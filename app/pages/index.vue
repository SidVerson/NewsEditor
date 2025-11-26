<template>
  <ClientOnly>
    <div class="editor-container max-w-3xl mx-auto my-8 flex flex-col">
      <ExportButtons
        :editor="editor"
        class="mt-4 self-end"
      />
      <Toolbar :editor="editor" />
      <drag-handle
        v-if="editor"
        :editor="editor"
      >
        <div class="custom-drag-handle" />
      </drag-handle>
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
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3'
import NodeRange from '@tiptap/extension-node-range'

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
    Conclusion,
    NodeRange.configure({
      // allow to select only on depth 0
      // depth: 0,
      key: null
    })
  ]

})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
::selection {
  background-color: #70cff850;
}

.ProseMirror {
  padding: 1rem 1rem 1rem 0;

  * {
    margin-top: 0.75em;
  }

  > * {
    margin-left: 3rem;
  }

  .ProseMirror-widget * {
    margin-top: auto;
  }

  ul,
  ol {
    padding: 0 1rem;
  }
}

.ProseMirror-noderangeselection {
  *::selection {
    background: transparent;
  }

  * {
    caret-color: transparent;
  }
}

.ProseMirror-selectednode,
.ProseMirror-selectednoderange {
  position: relative;

  &::before {
    position: absolute;
    pointer-events: none;
    z-index: -1;
    content: '';
    top: -0.25rem;
    left: -0.25rem;
    right: -0.25rem;
    bottom: -0.25rem;
    background-color: #70cff850;
    border-radius: 0.2rem;
  }
}

.custom-drag-handle {
  &::after {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1.25rem;
    content: '⠿';
    font-weight: 700;
    cursor: grab;
    background: #0d0d0d10;
    color: #0d0d0d50;
    border-radius: 0.25rem;
  }
}
</style>
