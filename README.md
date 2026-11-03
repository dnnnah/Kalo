# Kalo — Suite Clínica de Valoración y Diagnóstico Nutricional

> **Kalo** (*Kilo* + *Caloría* = *Kilocaloría*)  
> Software libre (FOSS) y offline-first de valoración y diagnóstico clínico-nutricional para estudiantes y profesionales de la nutrición en América Latina. Basado en el modelo de evaluación **ABCD** (Antropometría, Bioquímica, Clínica y Dietética).

---

## Propósito y Filosofía

Las herramientas comerciales dominantes en México y Latinoamérica suelen imponer costos recurrentes elevados, dependencia absoluta de internet y opacidad en sus algoritmos médicos.

**Kalo** resuelve este problema ofreciendo:
1. **100% Offline-First y Privado**: Funciona sin conexión a internet en consultorios rurales, clínicas y hospitales públicos (IMSS, ISSSTE). Los datos nunca salen del dispositivo del usuario (almacenamiento en IndexedDB con Dexie.js).
2. **Rigor Clínico Transparente**: Cada fórmula y punto de corte médico incluye su cita bibliográfica directa (`@source`).
3. **Principio «Calculadora Rápida Primero»**: Utiliza cualquier módulo de diagnóstico al instante sin obligar a registrar un paciente previo. La persistencia es opcional y a un solo clic.
4. **Diseño Inspirado en Apple HIG**: Interfaces limpias, modo oscuro nativo, semáforo clínico accesible (WCAG 2.1 AA) y cifras numéricas en fuente monoespaciada tabular.

---

## Stack Tecnológico

* **Núcleo & Entorno**: React 19.3, Vite 8 y TypeScript 7.0 (Strict Mode sin `any`).
* **Estilos & UI**: Tailwind CSS, Lucide React (iconografía) y componentes accesibles inspirados en Apple Human Interface Guidelines.
* **Persistencia Local**: IndexedDB gestionado con **Dexie.js** (sin límite de 5 MB, soporte reactivo con `useLiveQuery`).
* **Estado Global**: Zustand.
* **Testing**:
  * **Vitest 5**: Pruebas unitarias de fórmulas clínicas puras (tiempo de ejecución < 500 ms).
  * **Playwright**: Pruebas de integración E2E de flujos clínicos completos en desktop y mobile.
* **CI/CD**: GitHub Actions para validación automática de tipos, tests y compilación en cada push o PR.

---

## Arquitectura: Vertical Feature Slicing

```text
src/
├── features/
│   ├── energy/              # GET, TMB (Valencia, Mifflin, Harris-B), ETA, NAF, Peso Ajustado
│   ├── anthropometry/       # IMC, ICC, ICE, Pliegues (JP3, Faulkner), AMB
│   ├── biochemistry/        # Rangos laboratoriales, semáforo clínico, HOMA-IR, Albuminuria
│   ├── cardiovascular/      # Framingham 10 años, Índices lipídicos, TyG
│   ├── diabetes/            # Síndrome Metabólico ATP-III, Carga Glucémica
│   ├── renal/               # CKD-EPI 2021, ajuste proteico KDOQI, PRAL
│   ├── pregnancy/           # Ganancia gestacional IOM 2009, adición calórica T1-T3
│   ├── hydration/           # Requerimiento hídrico, tasa de sudoración ACSM
│   ├── dashboard/           # Vista principal con accesos rápidos
│   └── patients/            # Catálogo de pacientes en Dexie e historial
├── shared/
│   ├── db/                  # Esquema centralizado de Dexie.js (KaloDB)
│   ├── components/          # AppLayout, Botones, Inputs, Cards y Chips Apple HIG
│   ├── types/               # Tipos comunes y entidades clínicas
│   └── utils/               # Formateadores numéricos y validadores
└── router/                  # React Router configurado con carga limpia
```

---

## Inicio Rápido

### Prerrequisitos
* Node.js 20+ (recomendado v22 o superior)
* npm 10+

### Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/dnnnah/Kalo.git
cd Kalo

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo local con Vite |
| `npm run build` | Valida tipos con `tsc -b` y compila para producción |
| `npm test` | Ejecuta la suite de pruebas unitarias clínicas con Vitest |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo/watch |
| `npm run test:e2e` | Ejecuta la suite de pruebas E2E con Playwright |

---

## Reglas Clínicas de Contribución

1. **Rigor Bibliográfico Obligatorio**: Todo cálculo clínico nuevo debe incluir en el código un comentario `@source` con la cita médica oficial (autor, revista/organismo, año, DOI).
2. **Funciones Puras**: Cada fórmula matemática es una función pura, inmutable y aislada en `formulas.ts`.
3. **100% Cobertura en Fórmulas**: Toda función de cálculo debe contar con su correspondiente test unitario en `formulas.test.ts` con valores numéricos reales documentados.
4. **TypeScript Estricto**: Prohibido el uso de `any`, `unknown` sin narrowing, o `as Type` sin guardia de tipo.
5. **Ergonomía Táctil y Accesibilidad**: Touch targets mínimos de 44 × 44 px en pantallas móviles y contraste WCAG 2.1 AA en semáforos de diagnóstico.

---

## Roadmap

- [x] **Fase 1 (MVP)**:
  - [x] Arquitectura base, sistema de diseño Apple HIG y almacenamiento offline con Dexie.js (`KaloDB`).
  - [x] Módulo core de Requerimiento Energético (GET/TMB): Valencia México, Mifflin-St Jeor, Harris-Benedict, Schofield y Katch-McArdle.
  - [x] Corrección por obesidad con Peso Ideal (Hamwi 1964) y Peso Ajustado (ASPEN 2016).
  - [x] Factor de estrés por fiebre (DuBois +13%/°C sobre 37°C) y factores clínicos.
  - [x] Pipeline de CI con GitHub Actions y pruebas E2E con Playwright.
  - [ ] Módulos de Antropometría, Bioquímica, Cardiovascular y Renal.
- [ ] **Fase 2**: Planeador Dietético con distribución SMAE (5ª Edición) y cuadro dieto-sintético interactivo.
- [ ] **Fase 3**: Sincronización en la nube opcional y catálogo comunitario de alimentos latinoamericanos.

---

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
