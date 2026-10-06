declare const __PACKAGE_VERSIONS__: Record<'echarts' | 'nivo' | 'plotly' | 'recharts' | 'visx' | 'ant-design', string>
declare module 'plotly.js-dist-min' {
  import * as Plotly from 'plotly.js'
  export default Plotly
}
