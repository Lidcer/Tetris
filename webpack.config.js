const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";


const config = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "public"),
    },
    devServer: {
        open: true,
        host: "localhost",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
            static: path.join(__dirname, "public"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
        

        
    } else {
        config.mode = "development";
    }
    return config;
};
