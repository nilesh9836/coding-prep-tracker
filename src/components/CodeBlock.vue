<script setup>
import { ref, watchEffect, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('java', java)

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: 'java' }
})

const el = ref(null)

watchEffect(async () => {
  // reference props.code so this re-runs when it changes
  void props.code
  await nextTick()
  if (el.value) {
    delete el.value.dataset.highlighted
    hljs.highlightElement(el.value)
  }
})
</script>

<template>
  <pre class="code-block"><code ref="el" :class="`language-${language}`">{{ code }}</code></pre>
</template>

<style scoped>
.code-block {
  background: #0b0e17;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

.code-block :deep(code) {
  background: transparent;
  font-family: inherit;
}
</style>
