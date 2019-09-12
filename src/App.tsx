import React, { Component } from "react";
import "./App.css";

const ThemeContext = React.createContext("light");
const LangContext = React.createContext("中文");
const Button = () => (
  <ThemeContext.Consumer>
    {theme => (
      <LangContext.Consumer>
        {lang => (
          <button>
            主题色为:{theme}, 当前语言为: {lang}
          </button>
        )}
      </LangContext.Consumer>
    )}
  </ThemeContext.Consumer>
);

const ThemedButton = () => <Button />;

class MyText extends Component {
  static contextType = ThemeContext;
  render() {
    const theme = this.context;
    console.warn("current theme:", theme);
    return <span>当前主题色:{theme}</span>;
  }
}

const Toolbar = () => (
  <div>
    <ThemedButton />
    <MyText />
  </div>
);

const App: React.FC = () => (
  <div className="App">
    <ThemeContext.Provider value="dark">
      <LangContext.Provider value="中文">
        <Toolbar />
      </LangContext.Provider>
    </ThemeContext.Provider>
  </div>
);

export default App;
