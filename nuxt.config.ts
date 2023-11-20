// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/supabase',
        'nuxt-swiper',
        '@vueuse/nuxt',
        '@nuxtjs/google-fonts',
        '@nuxt/image',
        '@vueuse/motion/nuxt',
    ],
    css: ['@fortawesome/fontawesome-svg-core/styles.css', '@/assets/scss/style.scss'],
    build: {
        transpile: [
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/vue-fontawesome',
            'mathlive',
            '@cortex-js/compute-engine',
            'polish-plurals',
        ],
    },
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon/favicon.ico' }],
        },
    },
    devtools: { enabled: false },
    components: [
        {
            // Disable adding prefixes to components names
            path: '~/components',
            pathPrefix: false,
        },
    ],
    googleFonts: {
        families: {
            Poppins: [300, 400, 500, 600, 700],
            Merriweather: {
                wght: [400, 700],
                ital: [400],
            }
        },
        display: 'swap'
    },
})
