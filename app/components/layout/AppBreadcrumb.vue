<script setup lang="ts">
const { t } = useLocale()
const route = useRoute()

const crumbs = computed(() => {
  const path = route.path
  const labels: Record<string, string> = {
    '/': t('nav.overview'),
    '/problems/record': t('nav.problemRecording'),
    '/collaborative-care': t('nav.collaborativeCare'),
    '/tasks': t('nav.tasks'),
    '/documents': t('nav.documents'),
    '/settings': t('nav.settings')
  }
  if (path === '/') return [{ label: t('nav.overview'), to: '/' }]
  return [
    { label: 'HaH', to: '/' },
    { label: labels[path] || path, to: path }
  ]
})
</script>

<template>
  <nav
    :aria-label="t('layout.navigation')"
    class="px-6 pb-3 text-xs text-brand-muted"
  >
    <ol class="flex flex-wrap items-center gap-2">
      <li
        v-for="(crumb, index) in crumbs"
        :key="crumb.to"
        class="flex items-center gap-2"
      >
        <NuxtLink
          :to="crumb.to"
          class="hover:text-brand-navy focus-visible:underline"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-if="index < crumbs.length - 1"
          aria-hidden="true"
        >/</span>
      </li>
    </ol>
  </nav>
</template>
