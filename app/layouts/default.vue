<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const { t } = useLocale()
const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

definePageMeta?.({})
</script>

<template>
  <div class="min-h-screen bg-brand-bg text-brand-text">
    <div class="lg:hidden">
      <header class="sticky top-0 z-40 flex items-center justify-between border-b border-brand-border bg-brand-card px-4 py-3 shadow-sm">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="rounded-md border border-brand-border p-2 focus-visible:outline-2 focus-visible:outline-brand-navy"
            :aria-label="t('layout.openNavigation')"
            @click="mobileMenuOpen = true"
          >
            <UIcon
              name="i-lucide-menu"
              class="text-xl"
              aria-hidden="true"
            />
          </button>
          <div>
            <p class="text-sm font-bold text-brand-navy">
              {{ t('app.title') }}
            </p>
            <p class="text-xs text-brand-muted">
              {{ route.meta?.title || 'Hospital at Home' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <TranslationBar />
          <span class="text-xs text-brand-muted">
            {{ t('layout.mobileUser') }}
          </span>
        </div>
      </header>

      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-50 flex"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-slate-900/40"
          @click="closeMobileMenu"
        />
        <aside class="relative z-10 h-full w-72 max-w-[85vw] bg-brand-card p-4 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <p class="text-lg font-bold text-brand-navy">
              {{ t('layout.navigation') }}
            </p>
            <button
              type="button"
              class="rounded-md p-2 text-brand-muted hover:bg-slate-100"
              aria-label="關閉導覽"
              @click="closeMobileMenu"
            >
              <UIcon
                name="i-lucide-x"
                class="text-xl"
                aria-hidden="true"
              />
            </button>
          </div>
          <AppSidebar @navigate="closeMobileMenu" />
        </aside>
      </div>
    </div>

    <div class="hidden lg:flex">
      <aside class="fixed inset-y-0 left-0 z-30 w-64 border-r border-brand-border bg-brand-card">
        <div class="flex h-full flex-col">
          <div class="border-b border-brand-border px-5 py-5">
            <p class="text-xl font-bold text-brand-navy">
              HaH
            </p>
            <p class="mt-1 text-xs text-brand-muted">
              {{ t('nav.overview') }} / {{ t('app.title') }}
            </p>
          </div>
          <div class="flex-1 overflow-y-auto px-3 py-4">
            <AppSidebar />
          </div>
          <div class="border-t border-brand-border px-5 py-4 text-xs text-brand-muted">
            {{ t('layout.fhirEnvironment') }}
          </div>
        </div>
      </aside>

      <div class="ml-64 flex min-h-screen flex-1 flex-col">
        <AppHeader />
        <AppBreadcrumb />
        <main class="flex-1 p-4 md:p-6">
          <slot />
        </main>
      </div>
    </div>

    <div class="lg:hidden">
      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
