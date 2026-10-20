# Portfolio · Developer (Angular 21)

Página de portfolio con tres áreas (Frontend, Backend e IA) y una demo animada, «Pregúntale a mi portfolio».

## Arrancar

Requisitos: Node.js 20.19+, 22.12+ o 24+.

```bash
npm install
npm start          # http://localhost:4200
```

Si `npm install` falla con `Cannot read properties of null (reading 'edgesOut')`, es un bug de npm con las peer dependencies. Ejecuta `npm install --legacy-peer-deps`.

Otros comandos:

```bash
npm run build      # build de producción en dist/
npm test           # tests con Vitest
```

## Estructura

```
src/
├── index.html                                 Fuentes (Space Grotesk + JetBrains Mono) y metadatos
├── styles.scss                                Estilos globales mínimos
└── app/
    ├── app.routes.ts                          Ruta '' → DeveloperPageComponent
    └── developer-page/
        ├── developer-page.component.{ts,html,scss}   Hero, áreas (tabs accesibles) y contacto
        ├── areas.data.ts                              Contenido de las tres áreas
        └── ask-demo/
            ├── ask-demo.component.{ts,html,scss}      Pipeline animado, respuesta en streaming y log
            ├── ask.service.ts                         Fuente de eventos SIMULADA
            └── ask.models.ts                          Tipos y contrato AskEvent
```

## Pendiente de rellenar

Todo lo que va `[ENTRE CORCHETES]` en `areas.data.ts`, `ask.service.ts` y `developer-page.component.html`: tecnologías de backend e IA, enlaces y email.

## Cómo funciona la demo

- `AskService.ask(id)` devuelve un `Observable<AskEvent>` que emite cambios de etapa, líneas de log y trozos de texto.
- El componente lo consume con `switchMap`, de modo que una pregunta nueva cancela la anterior, y vuelca cada evento en signals.
- Usa detección de cambios `OnPush` y respeta `prefers-reduced-motion`.

## Conectar un backend real

El componente solo depende del contrato `AskEvent`. Para pasar de la simulación a algo real basta con reimplementar `ask()`. Un ejemplo con SSE, suponiendo que el backend emite eventos con ese mismo formato JSON:

```ts
ask(id: string): Observable<AskEvent> {
  return new Observable<AskEvent>((subscriber) => {
    const source = new EventSource(`/api/ask?q=${encodeURIComponent(id)}`);
    source.onmessage = (msg) => subscriber.next(JSON.parse(msg.data) as AskEvent);
    source.addEventListener('end', () => { source.close(); subscriber.complete(); });
    source.onerror = (err) => { source.close(); subscriber.error(err); };
    return () => source.close(); // cancelación desde switchMap
  });
}
```

Cuando esté conectado, quita la etiqueta «demo simulada» de la página.
