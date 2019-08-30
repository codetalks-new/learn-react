
## 本 Demo 知识要点


### JSX 及其等价物

1. jsx

```jsx
const heading = <h1 className="site-heading">Hello, React</h1>
```

```js
const heading = React.createElement('h1', { className: 'site-heading' }, 'Hello, React!')
```
注意:
1. `className` 而不是 `class` 属性,因为 `class` 是 js 的保留字.
2. JSX 中的属性和方法都是 camelCase 的.也就是说 js 中的 `onclick` 应该写成 `onClick`
3. 自闭合标签必须要以 斜杠结尾 如: `<img/>`
4. JSX 中通过 `{}` 插入 JS 表达式.

### 基于类的组件 

1. 一个简单的 CBC示例:

```jsx
import React, { Component } from "react";

export default class ClassBasedComp extends Component {
  render() {
    return <div className="ClassBasedComp">I'm A Class Based Components</div>;
  }
}

```

2. 一个简单的 FC 示例:

```jsx
import React from "react";

const BasicFc = () => {
  return <div>I'm a Basic Functional Component</div>;
};
export default BasicFc;

```