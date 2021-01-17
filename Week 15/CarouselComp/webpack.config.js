module.exports = {
    entry : "./AnimationDemo.js",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", {
                            pragma: "createElement"
                        }]]
                    }
                }
            }
        ]
    },
    mode: "development" // 发布时改成production
}
