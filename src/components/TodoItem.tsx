import React, { Component, ChangeEvent, Fragment } from "react";
import { Todo, Status, BUILTIN_TAGS } from "../models";
import { StoreContext, StoreType } from "../store";
import { Actions } from "../actions";

export interface TodoItemProps {
  todo: Todo;
}

export class TodoItem extends Component<TodoItemProps> {
  static contextType = StoreContext;
  state = {
    showTagSelect: false
  };
  toggleTags = () => {
    this.setState({
      showTagSelect: !this.state.showTagSelect
    });
  };
  onSelectTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    if (tag) {
      const todo = this.props.todo;
      const { dispatch } = this.context as StoreType;
      dispatch(Actions.addTag({ todo, tag }));
    }
    this.toggleTags();
  };

  removeTag = (tag: string) => {
    const todo = this.props.todo;
    const { dispatch } = this.context as StoreType;
    dispatch(Actions.removeTag({ todo, tag }));
  };

  removeTodo = () => {
    const { dispatch } = this.context as StoreType;
    const { todo } = this.props;
    dispatch(Actions.removeTodo({ todo }));
  };

  renderActions = (status: Status) => {
    const todo = this.props.todo;
    const { dispatch } = this.context as StoreType;
    const updateStatus = (targetStatus: Status) => {
      dispatch(Actions.updateStatus({ todo, targetStatus }));
    };
    // status -> action -> targetStatus

    const statusTransitionMap = {
      [Status.CREATED]: [["开始处理", Status.DOING], ["删除", Status.DELETED]],
      [Status.DOING]: [["完成", Status.FINISHED], ["暂停", Status.PAUSE], ["删除", Status.DELETED]],
      [Status.PAUSE]: [["开始处理", Status.DOING], ["删除", Status.DELETED]],
      [Status.FINISHED]: [["删除", Status.DELETED]]
    };

    const actionStatusArray: [string, Status][] = (statusTransitionMap as any)[status];
    if (actionStatusArray) {
      return actionStatusArray.map(([action, targetStatus]) => (
        <button key={action} onClick={() => updateStatus(targetStatus)}>
          {action}
        </button>
      ));
    } else {
      return <Fragment />;
    }
  };
  render() {
    const todo = this.props.todo;
    const phase = todo.phases[todo.phases.length - 1];
    console.info(`Render TodoItem ${todo.name}`);
    const options = [
      <option value="" key="empty">
        ---
      </option>
    ];
    for (const tag of BUILTIN_TAGS) {
      options.push(
        <option value={tag} key={tag}>
          {tag}
        </option>
      );
    }
    const tags = [];
    for (const tag of Array.from(todo.tags)) {
      tags.push(
        <span className="todo-tag" key={tag}>
          {tag}
          <button className="tag-remove-button" onClick={() => this.removeTag(tag)}>
            X
          </button>
        </span>
      );
    }
    const firstPhase = todo.phases[0];
    return (
      <tr className="todo">
        <td className="todo-created">{firstPhase.from.toLocaleTimeString()}</td>
        <td className="todo-name">{todo.name}</td>
        <td className="todo-tags">
          {tags}
          {this.state.showTagSelect ? (
            <label>
              选择标签:<select onChange={this.onSelectTag}>{options}</select>
            </label>
          ) : (
            <button onClick={this.toggleTags} className="tag-add-button">
              ＋
            </button>
          )}
        </td>
        <td className="todo-status">{phase.status}</td>
        <td className="todo-actions">{this.renderActions(phase.status)}</td>
      </tr>
    );
  }
}
