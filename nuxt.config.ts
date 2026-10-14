// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-Hant'
      }
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      hah: {
        appName: 'HaH 醫院居家照護系統',
        patientId: '7158c01b-32ba-4fbd-a038-201a0a2a4e2a',
        fhir: {
          baseUrl: 'https://hapi.fhir.org/baseR4',
          observationTemplateUrl:
            'https://hapi.fhir.org/baseR4/DocumentReference/0ccce64d-f9a9-4141-a78d-3552f74f32cf',
          detailCsvUrl:
            'https://hapi.fhir.org/baseR4/DocumentReference/8059f10e-a0a7-4e61-82bc-627edda1f23c',
          problemDetailCodeSystemBase: 'https//misac/codesystem/patient_problem_detail_code'
        }
      }
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  vite: {
    server: {
      allowedHosts: [
        '.ngrok-free.app' // Allows any active ngrok URL
      ]
    }
  }
})
