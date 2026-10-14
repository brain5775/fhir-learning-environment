<template>
  <div class="inline-flex items-center overflow-hidden rounded-lg border border-brand-border bg-white text-xs font-semibold shadow-sm">
    <button
      type="button"
      class="px-3 py-1.5 transition-colors"
      :class="locale === 'zh' ? 'bg-brand-navy text-white' : 'text-brand-text hover:bg-brand-navy/10'"
      @click="setLocale('zh')"
    >
      中文
    </button>
    <button
      type="button"
      class="px-3 py-1.5 transition-colors"
      :class="locale === 'en' ? 'bg-brand-navy text-white' : 'text-brand-text hover:bg-brand-navy/10'"
      @click="setLocale('en')"
    >
      English
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useLocale()
</script>
