import React, { Component, ChangeEvent, FormEvent } from "react";
import { StoreContext, StoreType } from "../store";
import { makeTodo } from "../models";
import { Actions } from "../actions";

export interface TodoFormProps {}

export class TodoForm extends Component<TodoFormProps> {
  static contextType = StoreContext;
  readonly state = {
    name: ""
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  submitForm = (e: FormEvent) => {
    e.preventDefault();
    const todo = makeTodo(this.state.name);
    const { dispatch } = this.context as StoreType;
    dispatch(Actions.addTodo({ todo: todo }));
    this.setState({
      name: ""
    });
  };

  render() {
    const { name } = this.state;
    return (
      <form onSubmit={this.submitForm} style={{ marginTop: "8px" }}>
        <label>事项名称:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
          autoComplete="off"
        />
        <input type="button" value="添加" onClick={this.submitForm} style={{ marginLeft: "8px" }} />
      </form>
    );
  }
}
