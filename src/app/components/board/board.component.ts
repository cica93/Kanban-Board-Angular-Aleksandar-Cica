import {
  ApplicationRef,
  Component,
  ComponentRef,
  computed,
  inject,
  injectAsync,
  signal,
  viewChild,
} from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import {
  AbstractTaskService,
  Task,
  TASK_STATUSES,
  TaskStatus,
} from '@service/abstract.task.service';
import { TaskCardComponent } from '@components/board/task-card/task-card.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
  BecomeVisibleDirective,
  ModalDirective,
  destroy,
  SUBMIT_FORM_TOKEN_LOAD,
  ModalComponent,
  CollectionsComponent,
} from 'cica-ui';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { ScrollTopComponent } from '@components/shared/scroll-top/scroll-top.component';

import { injectInfiniteQuery, injectMutation } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { SvgIconDirective } from '@components/shared/svg-icon.directive';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';

const limit = 5;

@Component({
  selector: 'app-board',
  imports: [
    TaskCardComponent,
    DragDropModule,
    BecomeVisibleDirective,
    SearchInputComponent,
    ScrollTopComponent,
    CollectionsComponent,
    ModalDirective,
    SvgIconDirective,
    CrudButtonsComponent
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  providers: [
    {
      provide: SUBMIT_FORM_TOKEN_LOAD,
      useValue: () =>
        import('../board/task-card/task-form/task-form.component').then(
          (module) => module.TaskFormComponent,
        ),
    },
  ],
})
export class BoardComponent {
  hasMoreTasks = true;
  menuIsOpen = signal<{ [key: number]: boolean }>({});
  restart = signal(false);
  requestId = signal<string>(crypto.randomUUID());
  currPage = 0;
  searchValue = signal<string | null>(null);
  showModal = signal<boolean>(false);
  TASK_STATUSES = [...TASK_STATUSES];
  becomeVisible = viewChild.required<BecomeVisibleDirective>(BecomeVisibleDirective);
  private readonly appRef = inject(ApplicationRef);
  private readonly queryClient = inject(QueryClient);
  private readonly taskService = inject(AbstractTaskService);
  private readonly messageService = injectAsync(() =>
    import('@service/message.handler.service').then((a) => a.MessageHandlerService),
  );
  private readonly cdr = injectAsync(() =>
    import('@angular/core').then((a) => a.ChangeDetectorRef),
  );

  readonly tasksQuery = injectInfiniteQuery(() => ({
    queryKey: [
      'tasks',
      {
        search: this.searchValue(),
        requestId: this.requestId(),
        offset: this.currPage,
      },
    ],
    initialPageParam: this.currPage,

    queryFn: ({ pageParam }) => {
      return firstValueFrom(
        this.taskService.get(this.searchValue(), limit, pageParam * limit).pipe(
          tap((taskByStatus) => {
            if (taskByStatus.some((t) => t.tasks.length === limit)) {
              this.currPage++;
              this.hasMoreTasks = true;
            } else {
              this.hasMoreTasks = false;
            }
          }),
        ),
      );
    },

    getNextPageParam: () => {
      return this.hasMoreTasks ? this.currPage : undefined;
    },
  }));

  tasks = computed(() => {
    if (!this.tasksQuery.data()) {
      return [];
    }
    return this.tasksQuery.data()!.pages.reduce((acc, curr) => {
      if (acc.length !== 0) {
        return acc.map((taskByStatus, index) => ({
          status: taskByStatus.status,
          tasks: [...taskByStatus.tasks, ...curr[index]!.tasks],
        }));
      }
      return curr;
    }, []);
  });

  loadMore(): void {
    if (this.tasksQuery.hasNextPage() && !this.tasksQuery.isFetchingNextPage()) {
      this.tasksQuery.fetchNextPage();
    }
  }

  readonly deleteTaskMutation = injectMutation(() => ({
    mutationFn: ({ id, version }: Task) => firstValueFrom(this.taskService.delete(id, version)),
  }));

  async deleteTask(event: { task: Task; modal: ComponentRef<ModalComponent> }): Promise<void> {
    this.dismissMenu();
    this.deleteTaskMutation.mutate(event.task, {
      onSuccess: async () => {
        destroy(this.appRef, event.modal);
        (await this.messageService()).successEvent.next({
          summary: 'Success',
          detail: `Task with id: ${event.task.id} is deleted`,
        });
      },
      onError: async () => {
        (await this.messageService()).errorEvent.next({
          summary: 'Error',
          detail: `Task with id: ${event.task.id} can not be deleted`,
        });
      },
    });
  }

  async onEdit(): Promise<void> {
    this.dismissMenu();
    this.resetTaskFilters();

    (await this.messageService()).successEvent.next({
      summary: 'Task changed',
      detail: 'Success!',
    });
  }

  async onCreate(): Promise<void> {
    (await this.messageService()).successEvent.next({
      summary: 'Task created',
      detail: 'Success!',
    });
  }

  dismissMenu(): void {
    this.menuIsOpen.set({});
  }

  openMenu(taskId: number): void {
    this.menuIsOpen.set({ [taskId]: true });
  }

  resetTaskFilters(searchValue = ''): void {
    this.changeSearchValue(searchValue);
    this.requestId.set(crypto.randomUUID());
    this.queryClient.cancelQueries();
    this.queryClient.removeQueries();
  }

  changeSearchValue(searchValue: string | null) {
    this.searchValue.set(searchValue);
    this.currPage = 0;
  }

  onDrop(event: CdkDragDrop<Task[]>, status: TaskStatus): void {
    const task = event.item.data;
    const taskStatus = status;
    const taskOrder = event.currentIndex;

    this.taskService
      .drag({
        taskId: task.id,
        taskStatus,
        taskOrder,
        taskVersion: task.version,
      })
      .subscribe({
        next: () => {
          this.showMessage('Task status changed');
          if (event.previousContainer === event.container) {
            moveItemInArray(task, event.previousIndex, event.currentIndex);
          } else {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex,
            );
          }
          this.cdr().then((a) => a.detectChanges());
        },
      });
  }

  private async showMessage(summary: string): Promise<void> {
    (await this.messageService()).successEvent.next({
      summary,
      detail: 'Task status changed successfully',
    });
  }
}
