import {
  Component,
  computed,
  inject,
  injectAsync,
  Injector,
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

import { BecomeVisibleDirective } from '@directives/become-visible-directive';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { HeaderComponent } from '@components/shared/header/header.component';
import { ScrollTopComponent } from '@components/shared/scroll-top/scroll-top.component';
import { successModalEvent } from '@components/shared/base-dialog/base-dialog.component';
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonSpinner } from '@ionic/angular';
import { add } from 'ionicons/icons';
import { injectInfiniteQuery, injectMutation } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { openDeleteModal, openEditModal } from '@components/shared/modalUtills';

const limit = 5;

@Component({
  selector: 'app-board',
  imports: [
    TaskCardComponent,
    IonButton,
    IonIcon,
    DragDropModule,
    BecomeVisibleDirective,
    SearchInputComponent,
    HeaderComponent,
    ScrollTopComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
  ],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  hasMoreTasks = true;
  addIcon = add;
  menuIsOpen = signal<{ [key: number]: boolean }>({});
  restart = signal(false);
  requestId = signal<string>(crypto.randomUUID());
  currPage = 0;
  searchValue = signal<string | null>(null);
  showModal = signal<boolean>(false);
  TASK_STATUSES = [...TASK_STATUSES];
  becomeVisible = viewChild.required<BecomeVisibleDirective>(BecomeVisibleDirective);
  private readonly injector = inject(Injector);
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

  async deleteTask(task: Task): Promise<void> {
    const dialog = await openDeleteModal(
      this.injector,
      `Are you sure that you want to delete task with id  ${task.id}?`,
      'Delete task',
    );
    this.dismissMenu();
    const isSussessMoadalEvent = await this.isSussessMoadalEvent(dialog);
    if (isSussessMoadalEvent) {
      this.deleteTaskMutation.mutate(task, {
        onSuccess: () => {
          this.dialogCallBackFunction(
            dialog,
            'Task deleted',
            `Task with id ${task.id} successfully deleted`,
          );
        },
        onError: async () => {
          (await this.messageService()).errorEvent.next({
            summary: 'Error',
            detail: `Task with id: ${task.id} can not be deleted`,
          });
        },
      });
    }
  }

  async openTaskDialog(task?: Partial<Task>): Promise<void> {
    const dialog = await openEditModal(this.injector, task, !task ? 'Create task' : 'Edit task');
    this.dialogCallBackFunction(dialog);
  }

  private async isSussessMoadalEvent(dialog: HTMLIonModalElement): Promise<boolean> {
    const { role } = await dialog.onWillDismiss();
    return role === successModalEvent;
  }

  async dialogCallBackFunction(
    dialog: HTMLIonModalElement,
    summary?: string,
    detail?: string,
  ): Promise<void> {
    this.dismissMenu();
    const isSussessMoadalEvent = await this.isSussessMoadalEvent(dialog);
    if (isSussessMoadalEvent) {
      this.resetTaskFilters();
    }
    if (summary && detail) {
      (await this.messageService()).successEvent.next({ summary, detail });
    }
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
