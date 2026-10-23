import {defineConfig} from '@playwright/test';
const ci=!!process.env.CI,webkit=process.env.PW_WEBKIT==='1';
export default defineConfig({testDir:'tests',workers:1,webServer:{command:'npm run dev -- --port 5187 --strictPort',url:'http://127.0.0.1:5187',reuseExistingServer:!ci},use:{browserName:webkit?'webkit':'chromium',baseURL:'http://127.0.0.1:5187',launchOptions:{...(webkit?{}:ci?{channel:'chrome'}:{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}}});
