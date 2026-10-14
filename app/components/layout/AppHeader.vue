<script setup lang="ts">
const { t } = useLocale()
const route = useRoute()
const titleMap: Record<string, string> = {
  '/': 'nav.overview',
  '/problems/record': 'nav.problemRecording',
  '/collaborative-care': 'nav.collaborativeCare',
  '/tasks': 'nav.tasks',
  '/documents': 'nav.documents',
  '/settings': 'nav.settings'
}

const title = computed(() => t(titleMap[route.path] || 'app.title'))
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-brand-border bg-brand-card/95 backdrop-blur">
    <div class="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-brand-teal">
          Hospital at Home
        </p>
        <h1 class="text-lg font-bold text-brand-navy">
          {{ title }}
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <TranslationBar />
        <div class="text-right">
          <p class="text-xs text-brand-muted">
            {{ t('layout.userRole') }}
          </p>
          <p class="text-sm font-medium text-brand-text">
            {{ t('layout.userAccount') }}
          </p>
        </div>
        <div class="h-9 w-9 rounded-full bg-brand-navy/10 text-center text-sm font-bold leading-9 text-brand-navy">
          C
        </div>
      </div>
    </div>
  </header>
</template>
