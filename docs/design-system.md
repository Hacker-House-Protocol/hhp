# Design System — Hacker House Protocol

## Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0D0B2B` | Background principal. Nunca fondo blanco. |
| `surface` | `#1A1740` | Cards, modales, panels secundarios |
| `border` | `#2E2A5A` | Separadores, bordes de cards, líneas de sección |
| `primary` | `#6B00C9` | CTAs, botones principales, highlights |
| `text` | `#F0EFF8` | Texto principal sobre fondo oscuro |
| `muted` | `#7B7A8E` | Labels, metadata, texto de apoyo |

### Colores de Arquetipo
| Arquetipo | Hex | Uso |
|---|---|---|
| Visionary 💡 | `#990070` | Bordes de avatar, badges, highlights |
| Strategist ♟ | `#8B78E6` | Bordes de avatar, badges, highlights |
| Builder ⚙️ | `#6EE76E` | Bordes de avatar, badges, highlights |

## Tipografía

| Rol | Fuente | Tamaño / Peso |
|---|---|---|
| Display / Headings | Space Grotesk | 24–48px / Bold |
| Body | Inter Regular | 14–16px / Regular |
| Wallet / código on-chain | JetBrains Mono | 12–14px / Regular |

## Espaciado y Bordes

- **Base unit**: 4px. Grid de 8px para el layout.
- **Border radius**: 8px cards · 4px badges · 999px pills/botones
- Cards siempre con `border: 1px solid #2E2A5A`
- `box-shadow: none` — el contraste de color hace el trabajo visual
- Íconos: **Lucide Icons** o **Phosphor Icons** — stroke, no fill

## Componentes Base

### Botón Primario
```
background: #6B00C9
border-radius: 999px (pill)
hover: #5500A0
sin sombras
```

### Botón Secundario
```
border: 1px solid #6B00C9
background: transparent
color: #6B00C9
border-radius: 999px
```

### Card
```
background: #1A1740
border: 1px solid #2E2A5A
border-radius: 8px
padding: 16px
sin sombras
```

### Badge / Pill
```
border-radius: 4px
padding: 4px 10px
font-size: 12px
colores por contexto
```

### Input
```
background: #0D0B2B
border: 1px solid #2E2A5A
focus: border-color #6B00C9
border-radius: 8px
```

### Bottom Sheet
```
overlay: rgba(0,0,0,0.6)
panel desde abajo
border-radius: 16px top
patrón estilo Nomadtable
```

### Progress Bar
```
track: #2E2A5A
fill: #6B00C9
border-radius: 999px
height: 8px
```

### Avatar con Borde de Arquetipo
```
imagen circular o cuadrada redondeada
border: 2–3px solid [color del arquetipo]
```

## Cypher Kittens — Avatares

GIFs animados pre-armados en variantes de color y expresión. El builder elige uno durante el onboarding. Son el elemento de identidad visual más reconocible de la plataforma.

- MVP: colección pre-armada de GIFs seleccionables
- V2: minteable como NFT personalizable
- El kitten del Hack Space actúa como mascota del equipo
