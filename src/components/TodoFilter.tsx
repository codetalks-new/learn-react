import React, { Component } from "react";

import { StoreContext, StoreType } from "../store";

import { Status } from "../models";

import { Actions } from "../actions";
import { Radio, Button, Row, Col } from "antd";
import Text from "antd/lib/typography/Text";

interface TodoFilterProps {
  filterStatus: Status | null | undefined;
  filterByStatus: (status: Status | null) => void;
}

export class TodoFilter extends Component<TodoFilterProps> {
  render() {
    const filterByStatus = (status: Status | null) => {
      this.props.filterByStatus(status);
    };
    const statusKeys = Object.keys(Status);
    const { filterStatus } = this.props;
    const buttons = statusKeys.map(key => {
      const status = (Status as any)[key];
      const active = filterStatus === status;
      return (
        <Button
          key={status}
          onClick={() => filterByStatus(status)}
          className={active ? "active" : ""}
        >
          {status}
        </Button>
      );
    });
    const showAll = !filterStatus;
    return (
      <Row>
        <Col span={4}>
          <Text strong>按状态筛选:</Text>
        </Col>
        <Col>
          <Button.Group>
            <Button
              key="all"
              onClick={() => filterByStatus(null)}
              className={showAll ? "active" : ""}
            >
              所有
            </Button>
            {buttons}
          </Button.Group>
        </Col>
      </Row>
    );
  }
}
