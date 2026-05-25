import { Injectable, inject } from "@angular/core";
import { mergeMap, map, catchError, of } from "rxjs";
import { TaskService } from "src/app/services/task.service";
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { loadTasks, loadTasksFailure, loadTasksSuccess } from "./task-store";
import { Task } from "src/app/services/abstract.task.service";

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTowns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      mergeMap(() =>
        this.taskService.get("",[], undefined, 20,0).pipe(
          map((tasks: Task[]) => loadTasksSuccess({ data: tasks })),
          catchError((error) => of(loadTasksFailure({ error: error.message })))
        )
      )
    )
  );
}
