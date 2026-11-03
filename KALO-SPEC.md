# KALO — Especificación Técnica y de Producto (V1 MVP & Roadmap)

> **Kalo** (*Kilo* + *Caloría* = *Kilocaloría*)  
> Software libre (FOSS) y offline-first de valoración y diagnóstico clínico-nutricional para estudiantes y profesionales de la nutrición en América Latina.

---

## 1. Visión y Propósito del Producto

### El Problema
Las plataformas comerciales dominantes en México y Latinoamérica (**Nutrimind**, **Avena Health**) imponen barreras importantes para estudiantes de nutrición, pasantes de servicio social y recién egresados:
1. **Costos recurrentes elevados**: Suscripciones de $400 a $800+ MXN mensuales.
2. **Dependencia estricta de la nube**: Inutilizables en centros de salud rurales, hospitales públicos (IMSS, ISSSTE) o consultorios sin conexión WiFi estable.
3. **Opacidad clínica**: Algoritmos de "caja negra" que no citan las fuentes bibliográficas ni permiten auditar las ecuaciones utilizadas.
4. **Dispersión de herramientas**: Para una valoración integral, el profesional recurre a múltiples calculadoras dispersas en la web o excels manuales desactualizados.

### La Solución Kalo
Una **PWA offline-first, moderna y de código abierto** que unifica la evaluación nutricional integral basada en el modelo clínico **ABCD** (Antropometría, Bioquímica, Clínica y Dietética), con rigor bibliográfico explícito, diseño limpio inspirado en Apple Human Interface Guidelines y privacidad absoluta (los datos viven en el dispositivo del usuario).

---

## 2. Stack Tecnológico y Arquitectura

### Stack
* **Entorno & Build**: Vite 8+ con React 19.3+ y TypeScript 7.0+ (Strict Mode sin `any`).
* **Estilos & UI**: Tailwind CSS, Lucide React (iconografía) y componentes accesibles inspirados en Apple HIG / Radix.
* **Estado Global Reactivo**: Zustand (para el estado de la sesión activa y cálculos efímeros entre pantallas).
* **Almacenamiento Local (Offline-First)**: IndexedDB gestionado con **Dexie.js** (sin límite de 5 MB, consultas indexadas y soporte reactivo con `useLiveQuery`).
* **Testing**: Vitest 5+ (pruebas unitarias de fórmulas puras con tiempo de ejecución < 500 ms) + Playwright (pruebas E2E de flujos clínicos).
* **CI/CD**: GitHub Actions para validación automática de tipos, linter, pruebas y compilación en cada commit.

### Arquitectura de Software: Vertical Feature Slicing
El proyecto organiza el código en módulos verticales por especialidad clínica en lugar de carpetas horizontales genéricas:

```text
src/
├── features/
│   ├── energy/              # GET, TMB (Mifflin, Valencia, Harris-B), ETA, NAF, Peso Ajustado
│   ├── anthropometry/       # IMC, ICC, ICE, Pliegues (JP3, Faulkner), AMB
│   ├── biochemistry/        # Rangos laboratoriales, semáforo clínico, HOMA-IR, Albuminuria
│   ├── cardiovascular/      # Framingham 10 años, Índice Aterogénico, No-HDL, Conicidad
│   ├── diabetes/            # TyG Index, Carga Glucémica, Criterios Síndrome Metabólico ATP-III
│   ├── renal/               # CKD-EPI 2021, ajuste proteico KDOQI, balance hídrico, PRAL, remojo
│   ├── pregnancy/           # Ganancia de peso IOM 2009, adición calórica T1-T3, IDR gestacional
│   ├── hydration/           # Requerimiento hídrico por peso/GET, tasa de sudoración ACSM
│   └── patients/            # Catálogo de pacientes en Dexie, historial de visitas y consultas
├── shared/
│   ├── db/                  # Esquema centralizado de Dexie.js (KaloDB)
│   ├── components/          # Layout (AppLayout, Navbar), Botones, Inputs, Cards accesibles
│   └── utils/               # Formateadores de fechas, números clínicos y validadores
└── router/                  # React Router configurado con carga perezosa (lazy loading)
```

---

## 3. Alcance del MVP (Fase 1: Suite de Diagnóstico Clínico ABCD)

### Principio de Uso: "Calculadora Rápida Primero"
El nutriólogo puede abrir Kalo y usar **cualquier módulo de inmediato sin necesidad de registrar o seleccionar un paciente**.  
Si durante o al final de la consulta decide guardar los datos, un botón persistente de acción permite:
* Asociar los resultados a un paciente existente de su base local.
* Crear un paciente nuevo al vuelo sin perder los cálculos realizados.

### Módulos del MVP

#### Nivel 1: Módulos Clínicos Generales (Uso diario en toda consulta)
1. **Requerimiento Energético (GET / TMB)**:
   * Fórmulas: Mifflin-St Jeor (1990), Valencia (INNSZ 1994, México), Harris-Benedict (revisión Roza & Shizgal 1984), Katch-McArdle y Cunningham (atletas), Schofield (OMS 1985).
   * Ajuste por NAF (1.2 a 1.9) y ETA (10% automático).
   * Detección automática de IMC > 30 y cálculo de **Peso Ideal (Hamwi 1964)** y **Peso Ajustado (ASPEN 2016)**.
   * Factores de estrés metabólico (cirugía, sepsis, traumatismo, fiebre con DuBois +13%/°C).
2. **Antropometría y Composición Corporal**:
   * IMC con clasificación OMS (delgadez severa a obesidad III).
   * Perímetros: ICC (puntos de corte OMS 0.95 ♂ / 0.85 ♀), ICE (corte universal 0.50 Ashwell).
   * Pliegues cutáneos: Jackson-Pollock 3 pliegues (Pecho/Abdomen/Muslo ♂ y Tríceps/Suprailiaco/Muslo ♀) con ecuación de Siri (1961); Faulkner 4 pliegues para deportistas.
   * Reserva proteica somática: Área Muscular del Brazo (AMB) y Circunferencia Muscular (CMB) según Frisancho (1981).
3. **Riesgo Cardiovascular y Metabólico**:
   * Riesgo coronario a 10 años mediante **Framingham Risk Score** (Wilson 1998, tablas completas con y sin tratamiento antihipertensivo).
   * Marcadores lipídicos: Índice Aterogénico (CT/HDL de Castelli / NOM-037), Colesterol No-HDL.
   * Adiposidad central: Índice de Conicidad (Valdez 1991).
   * Tamizaje de resistencia a la insulina: **Índice TyG** (Simental-Mendía & Guerrero-Romero) sin requerir insulinemia.
   * Diagnóstico de **Síndrome Metabólico** (ATP-III / NCEP: evaluación de los 5 criterios).
4. **Laboratorios y Bioquímica**:
   * Semáforo universal de analitos clínicos contra rangos de referencia (ADA, NOM, Harrison).
   * **HOMA-IR** (Matthews 1985) con clasificación de resistencia insulínica.

#### Nivel 2: Módulos Clínicos Especializados (Visibles como herramientas avanzadas)
5. **Nefrología y Salud Renal**:
   * Filtrado Glomerular Estimado: **CKD-EPI 2021** (sin corrección de raza) y estadios KDIGO (G1 a G5).
   * Clasificación de Albuminuria (A1, A2, A3).
   * Prescripción proteica por estadio ERC (KDOQI 2020: 0.6–0.8 g/kg en conservadora vs 1.2 g/kg en diálisis).
   * Ratio Fósforo/Proteína (tamizaje de sobrecarga de fósforo inorgánico).
   * Estimador de reducción de potasio por técnica culinaria (remojo simple 30%, doble cocción 50%, remojo + doble cocción 70%).
   * Carga Ácida Renal Potencial (**PRAL Score** de Remer & Manz 1995).
6. **Embarazo y Lactancia**:
   * Curva de ganancia de peso gestacional según IMC pregestacional por semana (IOM 2009).
   * Adición calórica por trimestre (T1: +0 kcal, T2: +340 kcal, T3: +450 kcal) y lactancia (+500 kcal exclusiva).
   * IDR ajustadas obstétricas (hierro, ácido fólico, yodo, calcio, DHA).
   * Algoritmo escalonado de manejo dietético de náuseas y vómito (ACOG 2021).
7. **Hidratación y Balance Hídrico**:
   * Requerimiento basal (35 ml/kg en adulto, 30 ml/kg en adulto mayor, 1 ml/kcal de GET o fórmula por edad Chernoff).
   * Tasa de sudoración post-ejercicio y reposición al 150% (protocolo ACSM 2007).
   * Ajustes clínicos por fiebre (+150 ml/°C sobre 37°C), pérdidas gastrointestinales (+500 ml) y calor.

### Gestión de Pacientes e Historial en Dexie
* **Tabla `pacientes`**: Identificador autoincremental, nombre, sexo biológico, fecha de nacimiento/edad, notas.
* **Tabla `consultas`**: FK hacia paciente, fecha de consulta, peso, talla, resultados calculados (GET, IMC, composición, diagnósticos asociados).
* **Búsqueda instantánea local**: Búsqueda por nombre sin latencia de red.

### Exportación en el MVP: Hoja de Valoración Clínica
* **Estrategia técnica**: Hoja de estilos optimizada para impresión nativa (`@media print`) y vista previa en pantalla.
* Permite al profesional presionar un botón *"Imprimir / Guardar en PDF"* para generar un documento limpio sin dependencias pesadas:
  * Encabezado con datos del paciente y fecha de consulta.
  * Resumen antropométrico y diagnóstico de IMC.
  * Meta energética diaria (GET) recomendada y peso meta/ajustado.
  * Estratificación de riesgo clínico (cardiovascular, metabólico o renal si aplica).

---

## 4. Fase 2: Planeador Dietético y SMAE (Roadmap)

La Fase 2 transforma a Kalo de una suite de valoración a un **sistema integral de prescripción dietética**.

### 1. El Cuadro Dieto-Sintético y Distribución de Raciones (El núcleo del nutriólogo)
* Definición de la meta energética y distribución de macronutrientes (% Hidratos de Carbono, % Proteínas, % Lípidos) con cálculo automático de gramos y calorías.
* **Planeador de Equivalentes Numéricos del SMAE (5ª Edición)**:
  * Reparto de porciones por grupo: Verduras, Frutas, Cereales (con/sin grasa), Leguminosas, AOA (muy bajo, bajo, moderado y alto aporte de grasa), Leche (descremada, semidescremada, entera, con azúcar), Aceites y grasas, Azúcares.
  * **Semáforo de adecuación en tiempo real**: Validación porcentual (meta 95–105%) de energía y macronutrientes conforme se modifican los equivalentes.
* **Distribución por Tiempos de Comida**:
  * Asignación de raciones a Desayuno, Colación 1, Comida, Colación 2 y Cena.
  * Saldo restante del día en tiempo real para evitar exceder el presupuesto.

### 2. Catálogo Abierto de Alimentos de Referencia
* Dataset curado de los alimentos de mayor consumo en México por grupo SMAE con medidas caseras estándar (tazas, piezas, cucharadas, gramos netos).
* Ficha de intercambio: lista de opciones equivalentes para que el paciente sepa cómo sustituir alimentos sin alterar sus calorías.

### 3. Generación Avanzada de Menú en PDF
* Generación de la **Guía Alimentaria del Paciente** lista para imprimir o compartir vía WhatsApp:
  * Plan por tiempos de comida con raciones claras.
  * Lista de equivalentes sugeridos y recomendaciones generales.

---

## 5. Fase 3: Sincronización en la Nube y Colaboración Comunitaria

1. **Sincronización Opcional con Supabase**:
   * Respaldo cifrado en la nube y sincronización multidispositivo mediante autenticación de usuario.
   * Conservación del modo offline mediante sincronización bidireccional (IndexedDB ↔ PostgreSQL).
2. **Expediente Clínico Digital conforme a NOM-004-SSA3**:
   * Antecedentes heredo-familiares, patológicos y no patológicos.
3. **Plataforma Abierta de Alimentos**:
   * Repositorio comunitario abierto en GitHub para validar y enriquecer el catálogo nutricional latinoamericano.

---

## 6. Métricas de Éxito y Calidad de Software para el Portafolio

1. **Velocidad y Peso**:
   * Bundle inicial < 300 KB gzipped.
   * Primer render interactivo (FID/INP) < 50 ms.
2. **Cobertura de Pruebas**:
   * 100% de funciones de cálculo clínico cubiertas por pruebas unitarias en Vitest.
   * 2 pruebas E2E con Playwright validando el flujo de cálculo rápido y la persistencia en IndexedDB.
3. **CI/CD Continuo**:
   * Verificación automática de TypeScript estricto, ESLint y suite de tests en GitHub Actions.
4. **Accesibilidad WCAG 2.1 AA**:
   * Contraste superior a 4.5:1 en textos estándar y 3:1 en gráficos de semáforo.
   * Soporte total de navegación por teclado y etiquetas `aria-*` en resultados calculados en tiempo real.
