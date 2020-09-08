const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimize = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        }
    };

    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin(),
        ];
    }

    return config;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        'bundle/index': ['@babel/polyfill', './index.tsx'],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.tsx', '.ts'],
    },
    mode: 'development',

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: optimize(),
    devServer: {
        port: 4200,
        hot: isDev
    },

    // Plugins
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './imgs/',
                    to: './dist/imgs/',
                }
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],

    // Loader
    module: {
        rules: [

            // Sass loader
            {
                test: /\.sass$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: isDev,
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ]
            },

            // Image loader
            {
                test: /\.(jpeg|jpg|png|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'imgs',
                    name: '[name].[ext]',
                }

            },

            // Fonts loader
            {
                test: /\.(ttf|woff|woff2|svg|eot)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                }
            },

            // Babel loader
            {
                test: /\.(jsx|tsx|js|ts)$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ],

                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                        ]
                    }
                }
            }
        ]
    }
};