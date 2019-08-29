# React + TypeScript 实践入门

## 环境
1. `React>=16.9`

2. `TypeScript>=3.6.2`

3. `VS Code >=1.37.1`

4. `yarn >= 1.17.3`

5. `node >= 10.13.0`

### VS Code + Chrome 调试支持
1. 安装 [Chrome Debugger Extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 插件 
   
2. 启动配置参考  `.vscode/launch.json`
   
3. 设置断点,按 F5 即可调试.

### 配置 Prettier
1. 安装 [Prettier](https://prettier.io/docs/en/editors.html)
2. Pretter 的配置可以在 VS Code 的 Settings 里面配置.

### 运行测试
1. `yarn test` 
2. `jest` 默认运行上次提交之后有修改文件的相关测试.
3. 直接将测试代码写在 `it()` 全局函数或 `test()` 函数块里就好了. 也可以用 `describe()` 把这些 测试放在一个分组里.
4. `jest` 自带了 `expect()` 全局函数用作断言语句.
5. 简单的 Component 的测试参考  `App.test.tsx`
6. 测试代码文件推荐跟源文件代码放在同一目录下. 支持 `.test.ts` 后缀 `.spec.ts` 后缀,(说明: ts 可以,那么 ,tsx,js,jsx 也可以.),或者放在 `__test__` 目录下.
7. `xit()` 表示此测试暂时排序.
8. `fit()` 表示暂时只运行此测试. `focus it`
9. `yarn test -- --coverage` 可以输出测试覆盖率报告.
10. 其他配置可以参考 `jest` 相关文档,然后在 `package.json` 中配置.

`test --env=node` 速度比较快.
但是以下API 需要 `jsdom`
- 所有的浏览器特有的全局对象如 `window`,`document`
- `ReactDOM.render()`
- `TestUtils.renderIntoDocument()`
- Enzyme 中的  `mount()` 

不过下面的 API不需要 `jsdom`
- `TestUtils.createRenderer()`
- Enzyme 中的 `shallow()`
- 快照测试也不需要 `jsdom`

最后可以安装 VS Code 的 [Jest 插件](https://github.com/orta/vscode-jest)

## 各分支对应 Demo 索引

1. [demo-try](https://github.com/banxi1988/learn-react/tree/demo-try)


## 以下是项目初始说明

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn  build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
