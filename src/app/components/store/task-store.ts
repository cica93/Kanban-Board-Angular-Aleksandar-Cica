import {
  createAction,
  createReducer,
  on,
  props,
} from '@ngrx/store';
import { Task } from 'src/app/services/abstract.task.service';
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
  props<{ taskId: number }>(),
);

export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ data: Task }>(),
);

export const saveTask = createAction(
  '[Tasks] Save Task',
  props<{ data: Task }>(),
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
    return { ...state, loading: false, data: [...state.data, ...data]};
  }),

  on(deleteTask, (state, { taskId }) => {
    return { ...state, data: state.data.filter((task) => task.id !== taskId) };
  }),

  on(updateTask, (state, { data }) => {
    return {
      ...state,
      data: state.data.map((task) => {
        return task.id !== data.id ? task : { ...task, ...data }
      }),
    };
  }),

  on(saveTask, (state, { data }) => {
    return {
      ...state,
      data: [data,...state.data],
    };
  }),
);

export interface AppState {
  tasks: LoadState<Task>
}


