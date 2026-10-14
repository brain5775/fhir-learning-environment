import { messages, type Locale } from '~/utils/i18n'

export const useLocale = () => {
  const locale = useState<Locale>('locale', () => 'zh')

  if (import.meta.client) {
    onMounted(() => {
      const saved = window.localStorage.getItem('locale')
      if (saved === 'zh' || saved === 'en') locale.value = saved
    })
  }

  const setLocale = (value: Locale) => {
    locale.value = value
    if (import.meta.client) window.localStorage.setItem('locale', value)
  }

  const t = (key: string, vars?: Record<string, string>) => {
    let value = messages[locale.value]?.[key] ?? messages.zh[key] ?? key
    if (vars) {
      Object.entries(vars).forEach(([name, replacement]) => {
        value = value.replace(`{${name}}`, replacement)
      })
    }
    return value
  }

  return { locale, setLocale, t }
}
