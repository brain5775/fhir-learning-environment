<script setup lang="ts">
const { t, locale } = useLocale()
useHead(() => ({
  title: t('app.title'),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: locale.value === 'en' ? 'en' : 'zh-Hant'
  }
}))
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
