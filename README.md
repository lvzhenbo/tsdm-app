# TSDM-APP

这是一个跨平台的第三方[天使动漫论坛](https://www.tsdm39.com)APP。

这不是一个严肃规范的项目，而是一个用来学习的自娱自乐项目，但不代表封闭，欢迎PR和Issue。

所谓跨平台是能力，但基于各种限制，目前只实现了安卓平台（功能完整）和Web平台（无权限相关功能）。

主要技术栈：`Ionic` `Capacitor` `Vue3` `Vite` `TypeScript`

## 推荐 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Ionic](https://marketplace.visualstudio.com/items?itemName=ionic.ionic).

额外插件：[Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) + [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind)

## 项目开始

> 推荐使用pnpm

### Web部分

| 说明               | 命令              |
| ------------------ | ----------------- |
| 安装               | `pnpm install`    |
| 开发               | `pnpm dev`        |
| 预览               | `pnpm preview`    |
| 生产（带类型检查） | `pnpm build`      |
| 生产（只编译）     | `pnpm build-only` |
| 类型检查           | `pnpm type-check` |
| ESLint             | `pnpm lint`       |
| Prettier           | `pnpm format`     |

### 安卓部分

| 说明                       | 命令                 |
| -------------------------- | -------------------- |
| 打开项目                   | `pnpm android:open`  |
| 开发运行                   | `pnpm android:dev`   |
| Web资源同步                | `pnpm android:copy`  |
| APK打包签名                | `pnpm android:build` |
| Web资源和Capacitor插件同步 | `pnpm android:sync`  |
