import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'

module.exports = {
  plugins: [
    autoprefixer(),
    postcssPresetEnv({ stage: 1 })
  ]
}