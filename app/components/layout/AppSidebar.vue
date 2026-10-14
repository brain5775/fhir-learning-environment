<script setup lang="ts">
const { t, locale } = useLocale()
const emit = defineEmits<{
  navigate: []
}>()

const route = useRoute()

const navItems = [
  { to: '/', label: '總覽', english: 'Overview', icon: 'i-lucide-layout-dashboard' },
  { to: '/problems/record', label: '問題狀況紀錄', english: 'Problem Recording', icon: 'i-lucide-stethoscope' },
  { to: '/collaborative-care', label: '偕同照護', english: 'Collaborative Care', icon: 'i-lucide-users', planned: true },
  { to: '/tasks', label: '任務與追蹤', english: 'Tasks & Follow-up', icon: 'i-lucide-list-checks', planned: true },
  { to: '/documents', label: '文件與規範', english: 'Documents & Definitions', icon: 'i-lucide-file-text', planned: true },
  { to: '/settings', label: '系統設定', english: 'Settings', icon: 'i-lucide-settings', planned: true }
]

// Remove icon class unused warning by rendering textual initials is not needed.
</script>

<template>
  <nav
    aria-label="主要導覽"
    class="space-y-1"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-navy/10 focus-visible:outline-2 focus-visible:outline-brand-navy"
      :class="route.path === item.to ? 'bg-brand-navy text-white' : 'text-brand-text'"
      @click="emit('navigate')"
    >
      <span class="flex min-w-0 items-center gap-3">
        <UIcon
          :name="item.icon"
          class="text-base shrink-0"
          aria-hidden="true"
        />
        <span class="min-w-0">
          <span class="block font-medium">{{ locale === 'zh' ? item.label : item.english }}</span>
          <span class="block text-xs opacity-75">{{ locale === 'zh' ? item.english : item.label }}</span>
        </span>
      </span>
      <span
        v-if="item.planned"
        class="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
      >
        {{ t('index.planned') }}
      </span>
    </NuxtLink>
  </nav>
</template>
