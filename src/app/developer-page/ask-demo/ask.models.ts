export type Stage = 'idle' | 'front' | 'back' | 'ia' | 'stream' | 'done';

export type LogTag = 'front' | 'back' | 'ia';

export interface LogLine {
  tag: LogTag;
  text: string;
}

/**
 * Contrato de eventos entre la UI y la "fuente" de respuestas.
 * Hoy lo emite un servicio simulado; mañana puede venir de un backend
 * real (SSE / streaming HTTP) sin tocar el componente.
 */
export type AskEvent =
  | { type: 'stage'; stage: Stage }
  | { type: 'log'; line: LogLine }
  | { type: 'chunk'; text: string };

export interface Question {
  id: string;
  label: string;
}

export interface PipelineNode {
  id: Exclude<Stage, 'idle' | 'stream' | 'done'>;
  label: string;
  sub: string;
  color: string;
}

export const PIPELINE_NODES: readonly PipelineNode[] = [
  { id: 'front', label: 'Frontend', sub: 'Angular · store', color: '#2DD4BF' },
  { id: 'back', label: 'Backend', sub: 'API · contexto', color: '#F5A524' },
  { id: 'ia', label: 'IA', sub: 'LLM · stream', color: '#B39DFA' },
];

export const LOG_COLORS: Record<LogTag, string> = {
  front: '#2DD4BF',
  back: '#F5A524',
  ia: '#B39DFA',
};

export const STATUS_LABELS: Record<Stage, string> = {
  idle: 'ESPERANDO',
  front: 'PROCESANDO',
  back: 'CONSULTANDO API',
  ia: 'GENERANDO',
  stream: 'STREAMING',
  done: 'LISTO',
};
