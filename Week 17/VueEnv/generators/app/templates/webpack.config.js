const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader'
            ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CopyPlugin({
          patterns: [
              // 此处的to是携带格式的，不处理为[name].[ext]会直接带上from里的src/
              { from: 'src/*.html', to: '[name].[ext]' }
          ]
      })
    ],
    mode: 'development'
}