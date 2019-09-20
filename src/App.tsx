import React from "react";
import "./App.css";
import { Layout } from "antd";
import { TodoApp } from "./TodoApp";

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header>
        <h1 className="header-title">
          欢来到 <i>代码会说话</i> 的编程实验室
        </h1>
      </Header>
      <Content>
        <h2>[React &TypeScript](12) 集成 Ant Design 美化UI</h2>
        <TodoApp />
      </Content>
      <Footer>
        <footer> TS不仅帮你声明类型,还提供创建类型的助手 </footer>
      </Footer>
    </Layout>
  );
};

export default App;
