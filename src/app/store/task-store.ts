import {
  createAction,
  createReducer,
  on,
  props,
} from '@ngrx/store';
import { Task, TaskStatus } from 'src/app/services/abstract.task.service';
import { taskInitState } from './taskInitState';
import { LoadState } from './load-state';

export const loadTasks = createAction('[Tasks] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ data: Task[] }>(),
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>(),
);

export const appendTasks = createAction(
  '[Tasks] Add Tasks',
  props<{ data: Task[] }>(),
);

export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ task: Task }>(),
);

export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ data: Task }>(),
);

export const saveTask = createAction(
  '[Tasks] Save Task',
  props<{ data: Task }>(),
);

export const dragTask = createAction(
  '[Tasks] Drag Task',
  props<{ data: Task; taskOrder: number; taskStatus: TaskStatus}>(),
);

export const TasksReducer = createReducer(
  taskInitState,

  on(loadTasks, (state) => ({ ...state, loading: true })),

  on(loadTasksSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),

  on(loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(appendTasks, (state, { data }) => {
    return { ...state, loading: false, data: [...state.data, ...data] };
  }),

  on(deleteTask, (state, { task }) => {
    return {
      ...state, data: state.data.map((t) => {
        if (t.taskStatus === task.taskStatus && t.taskOrder > task.taskOrder) {
          return { ...t, taskOrder: t.taskOrder - 1 };
        }
        return t;
    }).filter((t) => task.id !== t.id) };
  }),

  on(updateTask, (state, { data }) => {
    return {
      ...state,
      data: state.data.map((task) => {
        return task.id !== data.id
          ? task
          : { ...task, ...data, version: task.version + 1 };
      }),
    };
  }),

  on(saveTask, (state, { data }) => {
    return {
      ...state,
      data: [data, ...state.data.map(t => {
        if (t.taskStatus === data.taskStatus) {
          return { ...t, taskOrder: t.taskOrder + 1, version: 1 };
        }
        return t;
      })]
    }
  }),
  on(dragTask, (state, { data, taskOrder, taskStatus }) => {
    if (data.taskStatus === taskStatus) {
      const delta = taskOrder < data.taskOrder ? 1 : -1;
      return {
        ...state,
        data: state.data.map((task) => {
          if (taskStatus !== task.taskStatus) {
            return task;
          }
          if (task.id === data.id) {
            return { ...task, taskOrder };
          }
          if (isBetween(task.taskOrder, data.taskOrder, taskOrder)) {
            return {...task, taskOrder: task.taskOrder + delta}
          }
          return task;
        }),
      };
    }
    return {
      ...state,
      data: state.data.map((task) => {
        if (task.id == data.id) {
          return { ...task, taskOrder, taskStatus };
        }
        if (
          task.taskStatus === data.taskStatus &&
          task.taskOrder >= data.taskOrder
        ) {
          return { ...task, taskOrder: task.taskOrder - 1 };
        }
        if (task.taskStatus === taskStatus && task.taskOrder >= taskOrder) {
          return { ...task, taskOrder: task.taskOrder + 1 };
        }
        return task;
      }),
    };
  }),
);

function isBetween(mid: number, min: number, max: number): boolean {
  if (min < max)
    return mid > min && mid <= max;
  return mid < min && mid >= max;
}


export interface AppState {
  tasks: LoadState<Task>
}


