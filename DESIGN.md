# KALO — Sistema de Diseño y Guía de Interfaz (DESIGN.md)

> **Kalo** (*Kilo* + *Caloría* = *Kilocaloría*)  
> Sistema de diseño visual, arquitectura de información y patrones de interfaz para la suite clínica Kalo.

---

## 1. Filosofía de Diseño

El diseño de Kalo se rige por cuatro principios fundamentales:

1. **Inspiración Apple Human Interface Guidelines (HIG)**:
   * Fondos neutros cálidos (`#F2F2F7`), tarjetas elevadas blancas (`#FFFFFF`), bordes sutiles y esquinas generosamente redondeadas (`12px` a `16px`).
   * Eliminación de modales intrusivos o alertas emergentes en favor de retroalimentación en línea (*inline feedback*) y *Progressive Disclosure* (revelar información compleja solo cuando el usuario la solicita).
2. **Rigor Clínico y Legibilidad Numérica**:
   * Separación estricta entre **texto narrativo** (sans-serif) y **valores numéricos de laboratorio o cálculo** (monoespaciado tabular). Los números clínicos deben ser inequívocos a simple vista.
3. **Semáforo Clínico Universal**:
   * Códigos de color consistentes para toda la aplicación (Verde = Normal / Adecuado, Ámbar = Atención / Límite, Rojo = Riesgo Alto / Crítico). Cada color de estado cumple con ratios de contraste WCAG 2.1 AA (≥ 4.5:1 en texto normal).
4. **Mobile-First para Consulta Real**:
   * Diseñado principalmente para pantallas móviles de 390 px (iPhone / Android en consultorio o servicio social), escalando con fluidez a tablets (768 px) y escritorios (1280 px). Todos los elementos táctiles respetan el área mínima de toque de **44 × 44 px**.

---

## 2. Tipografía y Jerarquía

Kalo utiliza una combinación tipográfica pensada para interfaces médicas de alta densidad de datos:

### Familias Tipográficas
* **Fuente Principal (Cuerpo e Interfaz)**:  
  `-apple-system, BlinkMacSystemFont, "SF Pro Text", "IBM Plex Sans", sans-serif`.  
  *Uso: Títulos, etiquetas de campos, instrucciones clínicas, navegación.*
* **Fuente Numérica y Clínica (Valores de Laboratorio y Fórmulas)**:  
  `"IBM Plex Mono", "SF Mono", "Fira Code", monospace`.  
  *Uso: Kilocalorías, gramos de macronutrientes, TFG, IMC, perímetros y rangos.*  
  *Regla técnica:* Siempre aplicar `font-feature-settings: "tnum" 1` para garantizar alineación tabular de cifras decimales.

### Escala Tipográfica

| Token / Rol | Tamaño | Peso | Line-Height | Uso principal |
|---|---|---|---|---|
| `Large Title` | 28 px (`1.75rem`) | 700 (Bold) | 34 px | Encabezado principal del Dashboard |
| `Title 1` | 22 px (`1.375rem`) | 600 (Semibold) | 28 px | Título de módulo / pantalla activa |
| `Title 2` | 17 px (`1.0625rem`) | 600 (Semibold) | 22 px | Título de sección dentro de una tarjeta |
| `Body Principal` | 15 px (`0.9375rem`) | 400 (Regular) | 20 px | Texto explicativo, entradas de formularios |
| `Callout / Meta` | 13 px (`0.8125rem`) | 500 (Medium) | 18 px | Subtítulos, citas de fuentes `@source` |
| `Caption / Label` | 11 px (`0.6875rem`) | 600 (Semibold) | 14 px | Etiquetas ALL CAPS (`tracking: 0.06em`), badges |
| `Clinical Value XL`| 40 px (`2.5rem`) | 700 (Mono Bold) | 40 px | Gran cifra diagnóstica (ej. IMC 23.4) |
| `Clinical Value L` | 28 px (`1.75rem`) | 700 (Mono Bold) | 28 px | Valor energético principal (ej. 2,150 kcal) |
| `Clinical Value M` | 18 px (`1.125rem`) | 600 (Mono Semibold)| 22 px | Métricas secundarias (g de proteína, ICC) |

---

## 3. Paleta de Color y Tokens Semánticos

### Colores Base del Sistema
* **Fondo de Aplicación (`--color-bg`)**: `#F2F2F7` (Gris Apple sistema 6).
* **Superficie de Tarjetas (`--color-surface`)**: `#FFFFFF` (Blanco puro).
* **Superficie Elevada / Inputs (`--color-surface-subtle`)**: `#F9F9F9`.
* **Borde General (`--color-border`)**: `#E5E5EA` (Borde nítido, no intrusivo).
* **Borde Secundario (`--color-border-subtle`)**: `#F2F2F7`.

### Texto y Contraste
* **Texto Primario (`--color-text-primary`)**: `#1C1C1E` (Contraste 14.5:1 sobre blanco ✅).
* **Texto Secundario (`--color-text-secondary`)**: `#48484A` (Contraste 8.5:1 sobre blanco ✅).
* **Texto Terciario / Metadatos (`--color-text-tertiary`)**: `#636366` (Contraste 5.9:1 sobre blanco ✅).
* **Texto Decorativo / Deshabilitado**: `#AEAEB2`.

### Acción Primaria
* **Azul Kalo (`--color-primary`)**: `#007AFF` (Azul iOS característico).
* **Azul Primario Hover**: `#0062CC`.
* **Azul Primario Sutil (Pills / Badges)**: `#EBF3FF` con texto `#004A99`.

### Semáforo Clínico Universal (Diagnóstico y Adecuación)

```text
[ Verde: Normal / Óptimo ] ─── [ Ámbar: Atención / Límite ] ─── [ Rojo: Crítico / Riesgo ]
       #34C759                         #FF9500                         #FF3B30
```

| Estado | Color Icono/Borde | Fondo Sutil (10%) | Texto con Contraste AA | Criterio de uso |
|---|---|---|---|---|
| **Normal / Adecuado** | `#34C759` | `#EDFBF1` | `#1D7833` (5.2:1 ✅) | Adecuación 95–105%, Lab normal, Sin riesgo CV |
| **Atención / Límite** | `#FF9500` | `#FFF8EB` | `#995900` (5.4:1 ✅) | Adecuación 90–94% o 106–110%, Sobrepeso, Lab limítrofe |
| **Riesgo / Crítico** | `#FF3B30` | `#FFF0EF` | `#99231C` (5.8:1 ✅) | Adecuación <90% o >110%, Obesidad, Lab crítico, Alto riesgo |

### Acentos de Especialidades Médicas
* **Púrpura Antropometría / Pediatría**: Fondo `#F5F0FF`, Acento `#7C3AED`.
* **Teal Salud Renal / Hidratación**: Fondo `#EDFCFA`, Acento `#1A9B8A`.
* **Ámbar METs / Actividad Física**: Fondo `#FFF8EB`, Acento `#FF9500`.
* **Esmeralda Bioquímica / Lab**: Fondo `#EDFBF1`, Acento `#28A046`.

---

## 4. Sistema Espacial y Elevación

* **Escala de Espaciado (Base 4 px)**:
  * `4px` (micro), `8px` (gap iconos/texto), `12px` (padding interno compacto), `16px` (padding estándar de tarjetas), `20px` (separación entre secciones), `24px` (márgenes laterales de pantalla), `32px` (separación de grupos lógicos).
* **Radios de Borde**:
  * Botones e inputs: `10px`.
  * Tarjetas estándar: `12px` a `16px`.
  * Paneles principales: `20px`.
  * Pills / Chips / Avatares: `9999px` (Full pill).
* **Sombras (Estilo Apple: Difusas y de baja opacidad)**:
  * Tarjeta plana: `0 1px 3px rgba(0, 0, 0, 0.08)`.
  * Tarjeta flotante / Dropdown: `0 4px 12px rgba(0, 0, 0, 0.08)`.
  * Botón primario presionado: `active:scale-95 transition-transform duration-100`.

---

## 5. Sistema de Botones: Jerarquía, Colores, Funcionalidad y Diseño

Los botones en Kalo siguen la jerarquía visual de **Apple Human Interface Guidelines**: cada variante comunica claramente el nivel de importancia y la consecuencia de la acción.

### 5.1 Jerarquía de Botones

```text
[ Primario (Solid Accent) ] ──> Acción principal / Guardar / Confirmar (1 por vista)
[ Secundario (Subtle Tint) ] ─> Acción de apoyo relevante / Asociar / Ver más
[ Terciario (Outline) ] ─────> Acción neutra / Exportar / Copiar
[ Ghost / Texto ] ───────────> Acción discreta / Cancelar / Limpiar
[ Destructivo (Red) ] ───────> Acción irreversible / Eliminar paciente o consulta
[ Stepper / Icon-only ] ─────> Controles de porción (+ / -) y utilidades (X, Menú)
```

---

### 5.2 Especificación por Variante

#### 1. Botón Primario (`.btn-primary`)
* **Propósito**: Para la acción más importante que culmina un flujo clínico (ej. *"Guardar Consulta"*, *"Calcular GET"*, *"Guardar Paciente"*).  
* **Regla**: **Máximo un botón primario por tarjeta o sección visible** para no competir por la atención del profesional.
* **Estilo Visual**:
  * Fondo: `#007AFF` (Azul Apple).
  * Texto: `#FFFFFF` (Semibold `15px`).
  * Hover: Fondo `#0062CC`.
  * Active / Pressed: Fondo `#004A99` con micro-escala `scale-95`.
  * Focus Visible: `outline: 2px solid #007AFF; outline-offset: 2px`.
  * Sombra: `0 1px 2px rgba(0, 122, 255, 0.20)`.

#### 2. Botón Secundario / Tonal (`.btn-secondary`)
* **Propósito**: Para acciones complementarias frecuentes que requieren buena visibilidad sin opacar la acción principal (ej. *"Asignar a Paciente"*, *"Cambiar Fórmula"*, *"Nuevo Registro"*).
* **Estilo Visual**:
  * Fondo: `#EBF3FF` (Azul sutil al 10%).
  * Texto: `#0062CC` (Azul oscuro legible con ratio de contraste > 6:1 ✅).
  * Hover: Fondo `#D6E7FF`.
  * Active / Pressed: Fondo `#ADC9FF` con micro-escala `scale-95`.
  * Focus Visible: `outline: 2px solid #007AFF; outline-offset: 2px`.

#### 3. Botón Terciario / Contorno (`.btn-outline`)
* **Propósito**: Para acciones neutras o de navegación externa (ej. *"Imprimir / Guardar en PDF"*, *"Consultar Referencias"*, *"Copiar Resultado"*).
* **Estilo Visual**:
  * Fondo: Transparente.
  * Borde: `1px solid #E5E5EA`.
  * Texto: `#1C1C1E` (Texto primario, Medium o Semibold `15px`).
  * Hover: Fondo `#F2F2F7` y borde `#D1D1D6`.
  * Active / Pressed: Fondo `#E5E5EA` con micro-escala `scale-95`.

#### 4. Botón Ghost / Texto (`.btn-ghost`)
* **Propósito**: Para acciones de bajo impacto o reversión (ej. *"Limpiar campos"*, *"Cancelar"*, *"Ver fórmula completa"*).
* **Estilo Visual**:
  * Fondo: Transparente (sin borde).
  * Texto: `#636366` (Texto terciario), cambiando a `#1C1C1E` en hover.
  * Hover: Fondo `#F2F2F7` sutil.
  * Active / Pressed: Fondo `#E5E5EA`.

#### 5. Botón Destructivo (`.btn-destructive`)
* **Propósito**: Reservado estrictamente para acciones irreversibles que eliminan información (ej. *"Eliminar Paciente"*, *"Borrar Consulta"*).
* **Estilo Visual (Estado normal)**:
  * Fondo: `#FFF0EF` (Rojo sutil al 10%).
  * Borde: `1px solid #FFBCBA`.
  * Texto: `#FF3B30` (Rojo Apple exacto, ratio > 4.5:1 ✅).
  * Hover: Fondo `#FFDEDD`.
  * Active / Pressed: Fondo `#FF6360`, texto `#FFFFFF`.
* **Estado de Confirmación Definitiva** (cuando el diálogo pide reconfirmar):
  * Fondo: `#FF3B30` sólido, texto `#FFFFFF`.

#### 6. Botones de Incremento / Steppers (`.btn-stepper`)
* **Propósito**: Para manipulación rápida y precisa de valores numéricos continuos (ej. subir/bajar raciones del SMAE, semanas de embarazo, pliegues).
* **Estilo Visual**:
  * Dimensiones: `36 × 36 px` (en móvil se expande el touch target invisible a 44 px).
  * Radio: `10px`.
  * Botón Menos (`−`): Fondo `#F2F2F7`, texto `#1C1C1E` (`17px font-semibold`). Deshabilitado si llega a 0 (`text-[#C7C7CC]`).
  * Botón Más (`+`): Fondo `#007AFF`, texto `#FFFFFF` (`17px font-semibold`).
  * Cifra central: Ancho fijo `min-w-[28px]`, fuente monoespaciada tabular `font-semibold text-[17px]`.

---

### 5.3 Tabla Comparativa de Estados de Botones

| Variante | Default (Bg / Text / Border) | Hover | Active (Touch) | Disabled |
|---|---|---|---|---|
| **Primario** | `#007AFF` / `#FFFFFF` / Ninguno | `#0062CC` / `#FFFFFF` | `#004A99` / `scale-95` | `#E5E5EA` / `#AEAEB2` / `cursor-not-allowed` |
| **Secundario** | `#EBF3FF` / `#0062CC` / Ninguno | `#D6E7FF` / `#004A99` | `#ADC9FF` / `scale-95` | `#F2F2F7` / `#C7C7CC` / `cursor-not-allowed` |
| **Outline** | `Transparent` / `#1C1C1E` / `#E5E5EA` | `#F2F2F7` / `#1C1C1E` / `#D1D1D6` | `#E5E5EA` / `scale-95` | `Transparent` / `#C7C7CC` / `#E5E5EA` |
| **Ghost** | `Transparent` / `#636366` / Ninguno | `#F2F2F7` / `#1C1C1E` | `#E5E5EA` / `scale-95` | `Transparent` / `#C7C7CC` |
| **Destructivo** | `#FFF0EF` / `#FF3B30` / `#FFBCBA` | `#FFDEDD` / `#CC2F26` | `#FF3B30` / `#FFFFFF` / `scale-95`| `#F2F2F7` / `#C7C7CC` / `#E5E5EA` |

---

### 5.4 Funcionalidad, Microinteracciones y Accesibilidad

1. **Touch Targets de 44 px (Apple HIG / WCAG 2.5.5)**:  
   Todo botón accesible en móvil tiene una altura mínima de **44 px** (`min-h-[44px]`). En controles compactos como steppers de 36 px o botones de cerrar de 30 px, se utiliza padding exterior para que la caja táctil interactiva cumpla con el estándar mínimo de 44 × 44 px.
2. **Retroalimentación Táctil Inmediata**:  
   Cada botón tiene configurada la clase `active:scale-95 transition-all duration-100 ease-out`. Al ser presionado con el dedo en un dispositivo móvil o clic en escritorio, se contrae ligeramente al 95% de su tamaño, simulando la respuesta física de un botón de iOS.
3. **Estado de Carga (*Loading State*)**:  
   Cuando un botón inicia una operación asíncrona (ej. calcular un reporte pesado o persistir en IndexedDB):
   * Se deshabilita (`disabled`) para evitar doble clic.
   * Se añade `aria-busy="true"`.
   * El texto o icono se sustituye por un spinner circular SVG discreto de 16 px sin modificar el ancho total del botón (evitando brincos visuales de layout).
4. **Accesibilidad en Botones de Solo Icono**:  
   Todo botón que no incluya texto visible (ej. botón de menú hamburguesa, botón `X` de cerrar cajón o botón de imprimir) incluye obligatoriamente un atributo `aria-label="Descripción de la acción"` y un span oculto `.sr-only` para lectores de pantalla.
5. **Navegación por Teclado**:  
   Todos los botones son elementos nativos `<button>` o `<Link>`, activables con `Enter` y `Espacio`, con anillo de foco visible `focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2`.

---

## 6. Anatomía de Otros Componentes Clínicos

### 1. El Campo Numérico Clínico (`<Campo />`)
* Altura mínima obligatoria: **44 px** para garantizar usabilidad con pulgar.
* Etiqueta clara superior en texto secundario (`13px`).
* Valor en fuente monoespaciada con la unidad de medida (`kg`, `cm`, `mg/dL`) anclada a la derecha en gris terciario.
* Validación reactiva instantánea (*onChange*, nunca bloquear al usuario con alertas modales).

### 2. El Chip de Resultado Diagnóstico (`<ResultadoChip />`)
* Tarjeta compacta con micro-etiqueta en ALL CAPS.
* Cifra diagnóstica en fuente mono destacada.
* Badge de semáforo con fondo sutil y texto de alto contraste.
* Cita bibliográfica al pie en tamaño micro (10 px) acompañada del icono de libro `BookOpen` de Lucide.

### 3. Toggles Segmentados (en lugar de dropdowns)
* Para opciones binarias o ternarias (ej. Sexo biológico: *Masculino / Femenino*, Fórmula TMB: *Valencia / Mifflin / Harris-B*), **nunca usar `<select>` nativos ocultos**.
* Usar un control segmentado en contenedor gris con selector blanco deslizable. Touch target: 44 px.

### 4. Barra de Visualización de Rangos (ej. Barra de IMC)
* Gradiente horizontal continuo que representa los rangos clínicos (Bajo azul → Normal verde → Sobrepeso ámbar → Obesidad rojo).
* Marcador circular negro de posición exacta con animación suave (`duration-500 ease-out`).

---

## 7. Mapa de Pantallas, Secciones y Flujos de Navegación

### Arquitectura de Navegación

```text
[ Desktop: Sidebar Fijo 220px ]          [ Mobile: Header + Bottom Tab Bar + Drawer ]
├── GENERAL                              ├── Tab 1: Inicio (Dashboard)
│   ├── Inicio (Dashboard)               ├── Tab 2: GET / TMB (Calculadora)
│   └── Pacientes (Historial local)      ├── Tab 3: Antropometría
├── EVALUACIÓN CLÍNICA (ABCD)            └── Tab 4: Menú Completo (Drawer lateral)
│   ├── GET / TMB
│   ├── Antropometría & Composición
│   ├── Laboratorios & Bioquímica
│   ├── Riesgo Cardiovascular (Framingham)
│   └── Diabetes & Síndrome Metabólico
├── ESPECIALIDADES
│   ├── Nutrición Renal
│   ├── Embarazo & Lactancia
│   └── Hidratación Deportiva & Clínica
└── REFERENCIAS Y AJUSTES
    ├── Tablas de Referencia (IDR, METs, Lab)
    └── Configuración
```

---

### Descripción de Pantallas del MVP

#### 1. Dashboard Principal (`/`)
* **Hero Card**: Tarjeta destacada azul para iniciar inmediatamente el cálculo de GET/TMB.
* **Grid de Módulos Clínicos**: Acceso rápido organizado en tarjetas con icono, descripción y color de acento.
* **Sección Pacientes Recientes**: Lista viva leída directamente de Dexie.js con nombre, última fecha de consulta e inicial con avatar de color.
* **Acceso Directo a Referencias**: Banner para consultar valores IDR, factores de actividad y tablas OMS.

#### 2. Calculadora Energética (`/calculadora`)
* **Sección 1: Datos Base**: Peso, talla, edad, sexo biológico.
* **Sección 2: Selección de Fórmula**: Selector segmentado destacando *Valencia (México)* y *Mifflin-St Jeor*.
* **Sección 3: Factores de Ajuste**: Selector de actividad física (NAF) y condiciones de estrés metabólico (con slider de temperatura si hay fiebre).
* **Tarjeta de Resultado**: Cifras en vivo de TMB, ETA y GET total. Si el IMC supera 30, muestra la alerta visual y el cálculo con peso ajustado.
* **Barra de Acción Flotante**: Botón primario *"Asignar a Paciente"* y botón outline *"Imprimir Valoración"*.

#### 3. Antropometría y Composición Corporal (`/antropometria`)
* **Medidas Básicas**: IMC en tiempo real con barra gráfica OMS.
* **Perímetros**: Relación Cintura-Cadera (ICC) y Cintura-Estatura (ICE) con semáforo de riesgo.
* **Pliegues Cutáneos (Progressive Disclosure)**: Panel colapsable para introducir pliegues de Jackson-Pollock 3P o Faulkner 4P. Calcula % grasa, masa grasa en kg y masa magra en kg.
* **Reserva Proteica**: Área Muscular del Brazo (AMB) con clasificación de depleción proteica.

#### 4. Riesgo Cardiovascular y Diabetes (`/cardiovascular` y `/diabetes`)
* **Calculadora Framingham**: Evaluación del riesgo coronario a 10 años en porcentaje y categoría clínica.
* **Perfil Lipídico**: Cálculo automático de No-HDL e Índice Aterogénico.
* **Síndrome Metabólico**: Checklist automático de los 5 criterios ATP-III según los datos introducidos.
* **Índice TyG**: Tamizaje de resistencia a la insulina con triglicéridos y glucosa.

#### 5. Módulos de Especialidad (`/renal`, `/embarazo`, `/hidratacion`)
* **Renal**: Entrada de creatinina sérica → TFG instantánea por CKD-EPI 2021 + estadio KDIGO + prescripción de proteínas según KDOQI.
* **Embarazo**: Cálculo de ganancia ponderal esperada para la semana gestacional actual según el IMC previo.
* **Hidratación**: Cálculo de tasa de sudoración en atletas y reposición hídrica ajustada por pérdidas.

#### 6. Vista de Impresión / Guardar en PDF (`@media print`)
* Al presionar *"Imprimir / Exportar"*:
  * Se ocultan automáticamente la barra de navegación, menús, botones y elementos interactivos.
  * Se genera una **Hoja de Valoración del Estado Nutricional** limpia a dos columnas en formato Carta/A4:
    * Membrete superior: *"Kalo — Valoración Clínica Nutricional"*, fecha y nombre del paciente.
    * Bloque Antropométrico: Peso, talla, IMC, perímetros, % de grasa.
    * Bloque Energético: GET prescrito, fórmula seleccionada, peso meta.
    * Bloque de Diagnóstico y Riesgo: Interpretación clínica de alertas y recomendaciones.

---

## 8. Accesibilidad y Estándares de Calidad

* **Criterio WCAG 2.1 AA**:
  * Ningún estado depende exclusivamente del color: siempre se acompaña de texto descriptivo (ej. el semáforo rojo siempre dice *"Riesgo alto"* o *"Fuera de rango"*, no solo el círculo rojo).
  * Soporte completo de navegación con tecla `Tab`, indicadores de foco visibles (`outline: 2px solid #007AFF`) y atributos `aria-live="polite"` en los chips de resultado para lectura por VoiceOver/NVDA.
* **Modo Oscuro Automático**:
  * Se activa mediante `@media (prefers-color-scheme: dark)`.
  * Utiliza negros puros (`#000000`) y grises oscuros Apple (`#1C1C1E`) respetando el bajo consumo en pantallas OLED y reduciendo la fatiga visual en consultas nocturnas.
