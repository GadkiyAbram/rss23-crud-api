import path from 'path';
import Dotenv from 'dotenv-webpack';
import {fileURLToPath} from 'url';
import * as dotenv from 'dotenv';
import pkg from 'webpack';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const {DefinePlugin} = pkg;

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'production',
    entry: './src/index.ts',
    target: ['node18.0'],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'swc-loader'
                },
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve('./node_modules')
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
            '.cjs': ['.cjs', '.cts'],
            '.mjs': ['.mjs', '.mts']
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        library: {
            type: 'module',
        }
    },
    experiments: {
        outputModule: true,
    },
    plugins: [
        new Dotenv(),
        new DefinePlugin({
            'process.env.PORT': JSON.stringify(process.env.PORT)
        }),
        new NodePolyfillPlugin()
    ]
}