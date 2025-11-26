<template>
  <NodeViewWrapper
    data-type="quote"
  >
    <svg
      class="mb-[20px]"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="23"
      viewBox="0 0 30 23"
      fill="none"
    >
      <g clip-path="url(#clip0_22585_26334)">
        <path
          d="M14.7698 5.44156e-08L14.7698 7.20383C14.7698 9.16487 14.3696 11.1259 13.5692 13.087C12.7887 15.028 11.7882 16.8389 10.5676 18.5198C9.36693 20.1807 8.12627 21.5715 6.84559 22.6921L0.00195319 19.2102C0.8424 17.7694 1.5928 16.0986 2.25315 14.1975C2.9135 12.2965 3.24368 9.9653 3.24368 7.20383L3.24368 9.55918e-08L14.7698 5.44156e-08ZM29.6577 1.22965e-09L29.6577 7.20383C29.6577 9.16487 29.2575 11.1259 28.4571 13.087C27.6767 15.028 26.6761 16.8389 25.4555 18.5198C24.2548 20.1807 23.0142 21.5715 21.7335 22.6921L14.8899 19.2102C15.7303 17.7694 16.4807 16.0986 17.1411 14.1975C17.8014 12.2965 18.1316 9.9653 18.1316 7.20383L18.1316 4.24058e-08L29.6577 1.22965e-09Z"
          fill="#BB2619"
        />
      </g>
      <defs>
        <clipPath id="clip0_22585_26334">
          <rect
            width="30"
            height="23"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
    <NodeViewContent class="mb-[16px] text-[#111010] text-[24px] leading-[32px] italic font-medium" />
    <div class="flex items-center gap-[16px]">
      <UAvatar
        src="https://github.com/benjamincanac.png"
        class="h-[56px] w-[56px] !rounded-full !m-0 avatar"
      />
      <div class="flex flex-col gap-[4px]">
        <p class="text-[18px] leading-[28px] text-[#101828] font-semibold !m-0">
          {{ author }}
        </p>
        <p class="text-[16px] leading-[24px] text-[#71696A] !m-0">
          {{ title }}
        </p>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({
  ...nodeViewProps
})

const author = computed(() => props.node.attrs.author)
const title = computed(() => props.node.attrs.title)
</script>

<style scoped>
.quote-block {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 1rem 0;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
}

.quote-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.author {
  font-weight: 600;
  color: #111827;
}

.title {
  font-style: italic;
  color: #6b7280;
}

.content {
  color: #374151;
  font-style: italic;
}

.author-info {
  margin-top: 0.5rem;
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
