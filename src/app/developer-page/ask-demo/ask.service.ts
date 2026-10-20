import { Injectable } from '@angular/core';
import { Observable, concat, from, interval, timer } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { AskEvent, LogTag, Question } from './ask.models';

const log = (tag: LogTag, text: string): AskEvent => ({ type: 'log', line: { tag, text } });

/**
 * Servicio SIMULADO. Emite la misma secuencia de eventos que emitiría
 * un backend real con streaming. Para conectarlo de verdad, sustituye
 * `ask()` por una llamada HTTP/SSE que devuelva Observable<AskEvent>.
 */
@Injectable({ providedIn: 'root' })
export class AskService {
  readonly questions: readonly Question[] = [
    { id: 'stack', label: '¿Qué stack usas?' },
    { id: 'bug', label: 'Un bug difícil' },
    { id: 'next', label: '¿Qué estás aprendiendo?' },
  ];

  private readonly answers: Record<string, string> = {
    stack:
      'En el día a día, Angular, NgRx y RxJS en un monorepo con aplicaciones separadas para móvil y escritorio. Para testing E2E, Cypress, de mi etapa como QA.',
    bug:
      'Un vídeo que no entraba en pantalla completa dentro del iframe de un proveedor. La Permissions Policy no delegaba el permiso; lo resolví añadiéndolo al atributo allow del loader.',
    next:
      'Backend e IA. Mi laboratorio es un proyecto propio: una plataforma que genera vídeos de mascotas con IA. [Añade aquí las tecnologías concretas].',
  };

  ask(id: string): Observable<AskEvent> {
    const chunks = this.toChunks(this.answers[id] ?? '', 3);
    const after = (ms: number, ...events: AskEvent[]) =>
      timer(ms).pipe(concatMap(() => from(events)));

    return concat(
      from<AskEvent[]>([
        { type: 'stage', stage: 'front' },
        log('front', 'click → dispatch(ask)'),
        log('front', 'store: status = loading'),
      ]),
      after(700, { type: 'stage', stage: 'back' }, log('back', 'POST /api/ask')),
      after(450, log('back', 'contexto: perfil + casos')),
      after(350, { type: 'stage', stage: 'ia' }, log('ia', 'generando respuesta…')),
      after(800, { type: 'stage', stage: 'stream' }, log('front', 'stream → render por tokens')),
      interval(22).pipe(
        take(chunks.length),
        map((i): AskEvent => ({ type: 'chunk', text: chunks[i] })),
      ),
      from<AskEvent[]>([{ type: 'stage', stage: 'done' }, log('front', 'store: status = done')]),
    );
  }

  private toChunks(text: string, size: number): string[] {
    const out: string[] = [];
    for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
    return out;
  }
}
