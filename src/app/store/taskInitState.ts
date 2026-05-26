import { Task } from "src/app/services/abstract.task.service";
import { LoadState } from "./load-state";

export const taskInitState: LoadState<Task> = {
  data: [],
  loading: false,
  error: '',
};
