import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  signal,
  viewChildren,
} from '@angular/core';
import { AREAS, Area } from './areas.data';
import { AskDemoComponent } from './ask-demo/ask-demo.component';

@Component({
  selector: 'app-developer-page',
  standalone: true,
  imports: [AskDemoComponent],
  templateUrl: './developer-page.component.html',
  styleUrl: './developer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperPageComponent {
  readonly areas = AREAS;
  readonly selectedId = signal<Area['id']>('fe');
  readonly selected = computed(() => this.areas.find((a) => a.id === this.selectedId())!);

  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  select(id: Area['id']): void {
    this.selectedId.set(id);
  }

  /** Navegación por teclado del tablist (patrón WAI-ARIA). */
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const count = this.areas.length;
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % count,
      ArrowLeft: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = targets[event.key];
    if (next === undefined) return;

    event.preventDefault();
    this.select(this.areas[next].id);
    this.tabs()[next]?.nativeElement.focus();
  }
}
