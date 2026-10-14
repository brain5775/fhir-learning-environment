<script setup lang="ts">
const { t } = useLocale()
definePageMeta({
  title: '總覽'
})

const modules = computed(() => [
  {
    title: t('nav.problemRecording'),
    description: t('problems.record.pageTitle') + ': ' + t('problems.record.generateHint'),
    to: '/problems/record',
    status: t('index.primaryFlow')
  },
  {
    title: t('nav.collaborativeCare'),
    description: t('collaborativeCare.description'),
    to: '/collaborative-care',
    status: t('index.planned')
  },
  {
    title: t('nav.tasks'),
    description: t('tasks.description'),
    to: '/tasks',
    status: t('index.planned')
  },
  {
    title: t('nav.documents'),
    description: t('documents.description'),
    to: '/documents',
    status: t('index.planned')
  }
])
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-teal">
        Hospital at Home
      </p>
      <h1 class="mt-2 text-3xl font-bold text-brand-navy">
        {{ t('index.heroTitle') }}
      </h1>
      <p class="mt-3 max-w-3xl text-brand-muted">
        {{ t('index.heroText') }}
      </p>
      <div class="mt-5">
        <NuxtLink
          to="/problems/record"
          class="inline-flex rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-navy"
        >
          {{ t('index.enterProblemRecording') }}
        </NuxtLink>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <NuxtLink
        v-for="module in modules"
        :key="module.to"
        :to="module.to"
        class="rounded-xl border border-brand-border bg-brand-card p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand-navy"
      >
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-lg font-bold text-brand-navy">{{ module.title }}</h2>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="module.status === t('index.primaryFlow') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
          >
            {{ module.status }}
          </span>
        </div>
        <p class="mt-2 text-sm text-brand-muted">{{ module.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
