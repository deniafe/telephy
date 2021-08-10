import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: true,
    themes: {
      light: {
        background: '#f5f6fa',
        primary: '#00a2ff',
        accent: '#ffffff',
        appBlue: '#00a2ff',
        appDeepBlue: '#f1f1f1',
        deepestBlue: '#ebebeb',
        appGreen: '#25d4bf',
        appYellow: '#e3b329',
        appPink: '#ff4e5f',
        appWhite: '#212121',
        appTextGrey: '#a0a7bb',
        appDeepGrey: '#424242',
      },
      dark: {
        background: '#150e3a',
        primary: '#00a2ff',
        accent: '#191547',
        secondary: '#161244',
        appBlue: '#00a2ff',
        appDeepBlue: '#120b30',
        deepestBlue: '#0b061f',
        appGreen: '#25d4bf',
        appYellow: '#e3b329',
        appPink: '#ff4e5f',
        appWhite: '#ffffff',
        appTextGrey: '#a0a7bb',
        appDeepGrey: '#424242',
      },
    },
  },
})
