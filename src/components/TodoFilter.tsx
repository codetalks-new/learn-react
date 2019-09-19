import React, { Component } from "react";

import { StoreContext, StoreType } from "../store";

import { Status } from "../models";

import { Actions } from "../actions";

export class TodoFilter extends Component {
  static contextType = StoreContext;
  render() {
    const { dispatch, getState } = this.context as StoreType;
    const state = getState();

    const filterByStatus = (status: Status | null) => {
      dispatch(Actions.filterByStatus({ filterStatus: status }));
    };
    const statusKeys = Object.keys(Status);
    const buttons = statusKeys.map(key => {
      const status = (Status as any)[key];
      const active = state.filterStatus === status;
      return (
        <button
          key={status}
          onClick={() => filterByStatus(status)}
          className={active ? "active" : ""}
        >
          {status}
        </button>
      );
    });
    const showAll = !state.filterStatus;
    return (
      <div>
        <h3>按状态筛选:</h3>
        <button key="all" onClick={() => filterByStatus(null)} className={showAll ? "active" : ""}>
          所有
        </button>
        {buttons}
      </div>
    );
  }
}
