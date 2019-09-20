import React, { Component, ChangeEvent, FormEvent } from "react";
import { StoreContext, StoreType } from "../store";
import { makeTodo } from "../models";
import { Actions } from "../actions";
import { Form, Card, Input, Button } from "antd";
import { FormComponentProps } from "antd/lib/form";

export interface TodoFormProps extends FormComponentProps {}

const hasErrors = (fieldErros: any) => Object.keys(fieldErros).some(key => fieldErros[key]);

class RawTodoForm extends Component<TodoFormProps> {
  static contextType = StoreContext;
  readonly state = {
    name: ""
  };
  componentDidMount() {
    // 开始时禁用提交按钮
    this.props.form.validateFields();
  }

  submitForm = (e: FormEvent) => {
    e.preventDefault();
    const { validateFields, setFieldsValue } = this.props.form;
    validateFields((err, values) => {
      if (err) {
        console.error("表单验证错误");
        return;
      }
      console.info("表单值:", values);
      this.addNewTodo(values["name"]);
      setFieldsValue({ name: "" });
      validateFields();
    });
  };

  addNewTodo = (name: string) => {
    const todo = makeTodo(name);
    const { dispatch } = this.context as StoreType;
    dispatch(Actions.addTodo({ todo: todo }));
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { name } = this.state;
    const nameError = isFieldTouched("name") && getFieldError("name");
    return (
      <Card bordered={false}>
        <Form layout="inline" onSubmit={this.submitForm} style={{ marginTop: 8 }} hideRequiredMark>
          <Form.Item validateStatus={nameError ? "error" : ""} help={nameError || ""}>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入待办事项名称" }]
            })(<Input autoComplete="off" placeholder="待办事项" />)}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.submitForm}
              style={{ marginLeft: "8px" }}
              disabled={hasErrors(getFieldsError())}
            >
              添加
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export const TodoForm = Form.create({})(RawTodoForm);
