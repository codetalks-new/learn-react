import React from "react";
import "./App.css";
import { Layout } from "antd";
import { TodoApp } from "./TodoApp";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header>
        <Title level={3} className="header-title">
          欢迎来到
          <Text code strong>
            代码会说话
          </Text>
          的编程实验室
        </Title>
      </Header>
      <Content>
        <Title level={3}>[React &TypeScript](12) 集成 Ant Design 美化UI</Title>
        <TodoApp />
      </Content>
      <Footer>
        <footer> TS不仅帮你声明类型,还提供创建类型的助手 </footer>
      </Footer>
    </Layout>
  );
};

export default App;
