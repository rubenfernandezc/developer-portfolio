export interface Area {
  id: 'fe' | 'be' | 'ia';
  code: string;
  name: string;
  status: string;
  inProduction: boolean;
  color: string;
  kicker: string;
  headline: string;
  body: string;
  proofs: string[];
}

export const AREAS: readonly Area[] = [
  {
    id: 'fe',
    code: '01 / FE',
    name: 'Frontend',
    status: 'En producción · 5 años',
    inProduction: true,
    color: '#2DD4BF',
    kicker: 'ÁREA PRINCIPAL',
    headline: 'Interfaces con estado predecible',
    body: 'Angular, NgRx y RxJS en un producto con tráfico real y arquitectura separada para móvil y escritorio. Integraciones con terceros en iframes y WebViews.',
    proofs: [
      'Casos resueltos en producción (ver Casos)',
      'Testing E2E con Cypress, de mi etapa como QA',
      'Esta propia página: estado, animación y streaming',
    ],
  },
  {
    id: 'be',
    code: '02 / BE',
    name: 'Backend',
    status: 'En proceso',
    inProduction: false,
    color: '#F5A524',
    kicker: 'EN APRENDIZAJE',
    headline: 'Del consumidor de APIs al que las diseña',
    body: 'Años integrando APIs desde el frontend me han enseñado qué hace buena a una. Ahora estoy construyendo las mías. [Tecnologías que estás usando].',
    proofs: ['[Backend de tu proyecto propio: qué hace]', '[Curso, repo o ejercicio concreto]'],
  },
  {
    id: 'ia',
    code: '03 / AI',
    name: 'Inteligencia artificial',
    status: 'En proceso',
    inProduction: false,
    color: '#B39DFA',
    kicker: 'EN APRENDIZAJE',
    headline: 'IA aplicada a producto',
    body: 'Estoy construyendo una plataforma propia que genera vídeos de mascotas con IA, de la interfaz al flujo de generación.',
    proofs: [
      'Proyecto propio: vídeos de mascotas con IA',
      '[Modelo o API que usas]',
      '[Enlace a la demo o al repo]',
    ],
  },
];
