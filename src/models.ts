export enum BuiltinTag {
  IMPORTANT = "重要",
  NOTIMPORTANT = "不重要",
  URGENT = "紧急",
  NOTURGENT = "不紧急"
}

const tagColorMap = new Map<string, string>();
const tagColors = ["magenta", "red", "valcano", "orange", "gold", "lime", "green"];
export const randTagColor = (tag: string): string => {
  let color = tagColorMap.get(tag);
  if (!color) {
    const index = (Math.random() * 100) | 0 % tagColors.length;
    color = tagColors[index];
    tagColorMap.set(tag, color);
  }
  return color;
};

export const tagToColor = (tag: string): string => {
  switch (tag) {
    case BuiltinTag.IMPORTANT:
      return "gold";
    case BuiltinTag.URGENT:
      return "red";
    case BuiltinTag.NOTURGENT:
      return "blue";
    case BuiltinTag.NOTIMPORTANT:
      return "cyan";
    default:
      return randTagColor(tag);
  }
};

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

export const statusTransitionMap: Map<Status, [string, Status][]> = new Map([
  [Status.CREATED, [["开始处理", Status.DOING], ["删除", Status.DELETED]]],
  [Status.DOING, [["完成", Status.FINISHED], ["暂停", Status.PAUSE], ["删除", Status.DELETED]]],
  [Status.PAUSE, [["开始处理", Status.DOING], ["删除", Status.DELETED]]],
  [Status.FINISHED, [["删除", Status.DELETED]]]
]);

export const statusToButtonType = (status: Status) => {
  switch (status) {
    case Status.DELETED:
      return "danger";
    case Status.FINISHED:
      return "primary";
    case Status.PAUSE:
      return "dashed";
    default:
      return "default";
  }
};

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

/**
 * 针对 Todo模型的包装类,因为 Todo 最好是保持可序列化
 * 但是面向对象的操作很多时候由于是封装性看起来更直观
 */
export class TodoX {
  constructor(public todo: Todo) {}

  get phases() {
    return this.todo.phases;
  }

  get currentPhase() {
    const phases = this.phases;
    return phases[phases.length - 1];
  }
  get firstPhase() {
    return this.phases[0];
  }
  get currentStatus() {
    return this.currentPhase.status;
  }

  get createdAt() {
    return this.firstPhase.from;
  }

  get currentAvailableActions() {
    return statusTransitionMap.get(this.currentStatus);
  }
}
