import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html',
                shop: './shop.html',
                cart: './cart.html',
                category: './category.html',
                dashboard: './dashboard.html',
                history: './history.html',
                productDetails: './productDetails.html',
                user: './user.html'
            }
        }
    },
    server: {
        port: 3000
    }
}) 