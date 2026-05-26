import { Action, ActionReducer } from "@ngrx/store";
import { LoadState } from "./load-state";
import { TasksReducer } from "./task-store";
import { Task } from "src/app/services/abstract.task.service";

export interface AppStore {
    tasks: ActionReducer<LoadState<Task>, Action>;
}

export const appStore: AppStore = {
    tasks: TasksReducer
};