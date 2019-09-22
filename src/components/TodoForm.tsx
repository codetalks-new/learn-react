import React, { Component, ChangeEvent, FormEvent } from "react";
import { StoreContext, StoreType } from "../store";
import { makeTodo, BuiltinTag, Todo, makeBuiltinTags, TodoX } from "../models";
import { Actions } from "../actions";
import { Form, Card, Input, Button, Modal, Checkbox } from "antd";
import { FormComponentProps } from "antd/lib/form";

export interface CreateTodoFormProps extends FormComponentProps {
  visible: boolean;
  onHideModal: () => void;
}

class CreateForm extends Component<CreateTodoFormProps> {
  static contextType = StoreContext;
  componentDidMount() {
    // 开始时禁用提交按钮
    this.props.form.validateFields();
  }

  onOk = () => {
    const { validateFields, resetFields } = this.props.form;
    validateFields((err, values) => {
      if (err) {
        console.error("表单验证错误");
        return;
      }
      console.info("表单值:", values);
      this.addNewTodo(values);
      resetFields();
      this.props.onHideModal();
    });
  };

  addNewTodo = (values: any) => {
    const { name, important, urgent } = values;
    const tags = makeBuiltinTags({ important, urgent });
    const todo = makeTodo({ name, tags });
    const { dispatch } = this.context as StoreType;
    dispatch(Actions.addTodoAsync(todo));
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { visible, onHideModal } = this.props;
    const nameError = isFieldTouched("name") && getFieldError("name");
    return (
      <Modal
        destroyOnClose
        title="新建待办事项"
        visible={visible}
        onOk={this.onOk}
        onCancel={onHideModal}
      >
        <Form.Item validateStatus={nameError ? "error" : ""} help={nameError || ""}>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入待办事项名称" }]
          })(<Input autoComplete="off" placeholder="待办事项" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("important", { valuePropName: "checked", initialValue: false })(
            <Checkbox>重要</Checkbox>
          )}
          {getFieldDecorator("urgent", { valuePropName: "checked", initialValue: false })(
            <Checkbox>紧急</Checkbox>
          )}
        </Form.Item>
      </Modal>
    );
  }
}

export const CreateTodoForm = Form.create<CreateTodoFormProps>({})(CreateForm);

export interface UpdateTodoFormProps extends FormComponentProps {
  todo: Todo;
  visible: boolean;
  onHideModal: () => void;
}

class UpdateForm extends Component<UpdateTodoFormProps> {
  static contextType = StoreContext;
  componentDidMount() {
    // 开始时禁用提交按钮
    this.props.form.validateFields();
  }

  onOk = () => {
    const { validateFields, resetFields } = this.props.form;
    validateFields((err, values) => {
      if (err) {
        console.error("表单验证错误");
        return;
      }
      console.info("表单值:", values);
      this.updateTodo(values);
      resetFields();
      this.props.onHideModal();
    });
  };

  updateTodo = (values: any) => {
    const { name, important, urgent } = values;
    const tags = makeBuiltinTags({ important, urgent });
    const newTodo = { ...this.props.todo, ...makeTodo({ name, tags }) };
    const { dispatch } = this.context as StoreType;
    dispatch(Actions.updateTodoAsync(newTodo));
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { visible, onHideModal } = this.props;
    const nameError = isFieldTouched("name") && getFieldError("name");
    const todox = new TodoX(this.props.todo);
    return (
      <Modal
        destroyOnClose
        title="编辑待办事项"
        visible={visible}
        onOk={this.onOk}
        onCancel={onHideModal}
      >
        <Form.Item validateStatus={nameError ? "error" : ""} help={nameError || ""}>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入待办事项名称" }],
            initialValue: todox.todo.name
          })(<Input autoComplete="off" placeholder="待办事项" />)}
        </Form.Item>
        <Form.Item validateStatus="" help="">
          {getFieldDecorator("important", {
            valuePropName: "checked",
            initialValue: todox.isImportant
          })(<Checkbox>重要</Checkbox>)}
          {getFieldDecorator("urgent", { valuePropName: "checked", initialValue: todox.isUrgent })(
            <Checkbox>紧急</Checkbox>
          )}
        </Form.Item>
      </Modal>
    );
  }
}

export const UpdateTodoForm = Form.create<UpdateTodoFormProps>({})(UpdateForm);
