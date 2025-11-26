<template>
  <NodeViewWrapper
    data-type="conclusion"
    class="bg-[#E7E6E6] rounded-[20px] p-[20px] my-[16px]"
  >
    <span class="text-[20px] leading-[32px] font-semibold text-[#BB2619] mb-[10px]">Заключение</span>

    <NodeViewContent
      as="p"
      class="text-[20px] leading-[30px] text-[#514D4D]"
    />
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({
  ...nodeViewProps
})
</script>
