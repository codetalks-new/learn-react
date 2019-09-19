export enum BuiltinTag {
  IMPORTANT = "重要",
  NOTIMPORTANT = "不重要",
  URGENT = "紧急",
  NOTURGENT = "不紧急"
}

export const BUILTIN_TAGS = [
  BuiltinTag.IMPORTANT,
  BuiltinTag.NOTIMPORTANT,
  BuiltinTag.URGENT,
  BuiltinTag.NOTURGENT
];

export enum Status {
  CREATED = "创建",
  DOING = "处理中",
  PAUSE = "暂停处理",
  FINISHED = "已完成",
  DELETED = "已删除"
}

export interface Phase {
  from: Date;
  to?: Date;
  status: Status;
}
// redux 可序列化,不可变性

export interface Todo {
  name: string;
  tags: string[];
  phases: Phase[];
}

export const makeTodo = (name: string, tags: string[] = [], phases: Phase[] = []): Todo => {
  let phases_fallback = phases.length > 0 ? phases : [{ from: new Date(), status: Status.CREATED }];
  return {
    name,
    tags,
    phases: phases_fallback
  };
};
