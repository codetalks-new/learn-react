import React, { Component } from "react";

const config = {
  theme: "dark",
  lang: "中文"
};

const UIConfigContext = React.createContext(config);

// I love china!
const Button = () => (
  <UIConfigContext.Consumer>
    {config => (
      <button>
        主题色:{config.theme},语言:{config.lang}
      </button>
    )}
  </UIConfigContext.Consumer>
);

const RoundButton = () => <Button />;

class ToolBar extends Component {
  static contextType = UIConfigContext;
  render() {
    const { theme, lang } = this.context;
    return <RoundButton />;
  }
}

const App: React.FC = () => (
  <div className="App">
    <div style={{ marginTop: 20, marginRight: 20, float: "right" }}>
      <div className="App-head">
        <UIConfigContext.Provider value={config}>
          <ToolBar />
        </UIConfigContext.Provider>
        <h1>欢迎来到 CodeTalks 的 编程实验室, </h1>
        <p>[React & TypeScript] (1) Context, 用规范的方式做正确的事,真难!</p>
        <p>- by 代码会说话 2019-09-13</p>
        <p>中秋节快乐</p>
      </div>
    </div>
  </div>
);

export default App;
