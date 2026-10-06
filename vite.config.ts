import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

const { dependencies } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __PACKAGE_VERSIONS__: JSON.stringify({
      echarts: dependencies.echarts,
      nivo: dependencies['@nivo/sankey'],
      plotly: dependencies['plotly.js-dist-min'],
      recharts: dependencies.recharts,
      visx: dependencies['@visx/sankey'],
      'ant-design': dependencies['@ant-design/plots'],
    }),
  },
  build: { chunkSizeWarningLimit: 1500 },
})
