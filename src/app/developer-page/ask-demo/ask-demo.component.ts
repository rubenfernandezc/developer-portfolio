import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  AskEvent,
  LOG_COLORS,
  LogLine,
  PIPELINE_NODES,
  STATUS_LABELS,
  Stage,
} from './ask.models';
import { AskService } from './ask.service';

const MAX_LOG_LINES = 8;

@Component({
  selector: 'app-ask-demo',
  standalone: true,
  templateUrl: './ask-demo.component.html',
  styleUrl: './ask-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AskDemoComponent {
  private readonly askService = inject(AskService);
  private readonly asks$ = new Subject<string>();

  readonly nodes = PIPELINE_NODES;
  readonly logColors = LOG_COLORS;
  readonly questions = this.askService.questions;

  readonly stage = signal<Stage>('idle');
  readonly questionId = signal<string | null>(null);
  readonly answer = signal('');
  readonly logs = signal<LogLine[]>([]);

  readonly busy = computed(() => this.stage() !== 'idle' && this.stage() !== 'done');
  readonly activeNodeId = computed(() => (this.stage() === 'stream' ? 'front' : this.stage()));
  readonly statusLabel = computed(() => STATUS_LABELS[this.stage()]);
  readonly questionLabel = computed(
    () => this.questions.find((q) => q.id === this.questionId())?.label ?? '—',
  );
  readonly showCursor = computed(() => this.stage() !== 'done');

  constructor() {
    // switchMap: si llega otra pregunta, cancela la anterior en curso.
    this.asks$
      .pipe(
        tap((id) => {
          this.questionId.set(id);
          this.answer.set('');
          this.logs.set([]);
        }),
        switchMap((id) => this.askService.ask(id)),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.apply(event));

    // Arranca sola para que la página "se mueva" nada más cargar.
    timer(900)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.asks$.next('stack'));
  }

  run(id: string): void {
    if (!this.busy()) this.asks$.next(id);
  }

  /** Paquete viajando hacia el siguiente nodo (petición de ida). */
  isForward(index: number): boolean {
    const next = this.nodes[index + 1];
    return !!next && this.stage() === next.id;
  }

  /** Paquetes de vuelta mientras la respuesta se renderiza en streaming. */
  isReturning(index: number): boolean {
    return index < this.nodes.length - 1 && this.stage() === 'stream';
  }

  private apply(event: AskEvent): void {
    switch (event.type) {
      case 'stage':
        this.stage.set(event.stage);
        break;
      case 'log':
        this.logs.update((lines) => [...lines, event.line].slice(-MAX_LOG_LINES));
        break;
      case 'chunk':
        this.answer.update((text) => text + event.text);
        break;
    }
  }
}
