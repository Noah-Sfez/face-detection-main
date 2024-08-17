const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
    entry: "./src/script.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "dist"),
            },
            {
                directory: path.join(__dirname, "models"),
                publicPath: "/models",
            },
        ],
        open: true, // Ouvrir automatiquement le navigateur
        port: 9000, // Optionnel: spécifie le port
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer"),
            vm: require.resolve("vm-browserify"),
            path: require.resolve("path-browserify"),
            fs: false, // Utilisé pour désactiver fs car non supporté dans le navigateur
        },
    },
    mode: argv.mode === "production" ? "production" : "development", // Utilisation du mode en fonction de l'environnement
});
