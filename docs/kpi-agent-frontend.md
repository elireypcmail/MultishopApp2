# Guía para agente frontend – KPIs

Documento pensado para un **agente frontend** (por ejemplo otro cliente web) que necesita consumir los endpoints KPI principales:

- `GET /kpi/data`
- `GET /kpi/data/summary`
- `GET /kpi/statistical`

La referencia técnica completa está en `docs/API.md`. Aquí nos centramos en **cómo usarlos desde el frontend** (filtros típicos, gráficos, tarjetas KPI y manejo de errores).

---

## 1. Contexto general

- **Base URL API**: `{HOST}/api/v1` (ejemplo local: `http://localhost:5000/api/v1`).
- **Prefijo KPI**: todas las rutas aquí descritas están bajo `/kpi`.
- **Autenticación**: normalmente con header  
  `Authorization: Bearer <token>`.

En los ejemplos se asume:

- `{BASE_URL} = http://localhost:5000/api/v1`
- Headers comunes:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 2. `GET /kpi/data` – Serie temporal para gráficos

**Objetivo**: obtener una **serie de puntos en el tiempo** para un KPI financiero/operativo, lista para graficar (línea, barra, área).

### 2.1. Parámetros

**Obligatorios (querystring)**:

- `schema`: string – schema del cliente, por ejemplo `"J123456789"` o `"12345678"`.
- `from`: string – fecha inicio (`YYYY-MM-DD`).
- `to`: string – fecha fin (`YYYY-MM-DD`).
- `kpi`: string – uno de:

  - `venta`
  - `utilidad`
  - `ticketVenta`
  - `costosVenta`
  - `porcentajeUtilidad`
  - `margenGanancia`
  - `unidadesVendidas`
  - `facturasEmitidas`
  - `unidadesEnBolsa`
  - `valorPromedioUnidad`
  - `clientesAtendidos`
  - `clientesFrecuentes`

**Opcionales**:

- `table`: string – tabla (por defecto `ventas`).
- `codemp`: string – empresa específica.
- `nomempc`: string – sucursal específica.

### 2.2. Ejemplo de llamada

**URL de ejemplo** (ventas totales, 01–31 enero):

```text
GET {BASE_URL}/kpi/data?schema=12345678&from=2024-01-01&to=2024-01-31&kpi=venta
```

Con filtros por sucursal:

```text
GET {BASE_URL}/kpi/data?schema=12345678&from=2024-01-01&to=2024-01-31&kpi=venta&nomempc=Sucursal%20Centro
```

### 2.3. Respuesta (para graficar)

```json
{
  "representation": "dias",
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-01-15",
  "fechaFinSolicitada": "2024-02-01",
  "rangoLimitado": true,
  "data": [
    { "periodo": "2024-01-01", "valor": 1500.5 },
    { "periodo": "2024-01-02", "valor": 2100.0 }
  ],
  "totalGeneral": 3600.5,
  "promedioDiario": 240.03
}
```

- `representation`:
  - `dias`: usar eje X de fechas diarias.
  - `semanas`: agrupar por semana.
  - `meses`: agrupar por mes.
  - `anual`: agrupar por año.
- `data[*].periodo`: string (fecha/semana/mes/año) -> se puede parsear a `Date`.
- `data[*].valor`: número -> valor del KPI.

**Uso típico en frontend**:

- Eje X: `new Date(item.periodo)` o directamente string según la lib de gráficos.
- Eje Y: `Number(item.valor)`.
- Tarjeta superior con:
  - `totalGeneral`
  - `promedioDiario`

### 2.4. Manejo de errores

- `400` → errores de validación:

```json
{ "error": "schema, from, to and kpi are required" }
```

```json
{ "error": "KPI no válido. Permitidos: venta, utilidad, ..." }
```

- `500` → error genérico:

```json
{ "error": "Error al obtener datos del KPI" }
```

En el frontend, mapear esto a mensajes tipo:

- “Verifique las fechas y el KPI seleccionado.”
- “Ocurrió un error al cargar el gráfico, intente nuevamente.”

---

## 3. `GET /kpi/data/summary` – Tarjetas KPI

**Objetivo**: obtener solo **total general** y **promedio diario** de un KPI para mostrar en tarjetas/indicadores, sin serie temporal.

### 3.1. Parámetros

Los mismos que `/kpi/data`:

- Obligatorios: `schema`, `from`, `to`, `kpi`.
- Opcionales: `table`, `codemp`, `nomempc`.

### 3.2. Ejemplo de llamada

```text
GET {BASE_URL}/kpi/data/summary?schema=12345678&from=2024-01-01&to=2024-01-31&kpi=utilidad
```

### 3.3. Respuesta

```json
{
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-01-31",
  "totalGeneral": 9876.54,
  "promedioDiario": 318.6
}
```

**Uso típico**:

- Card “Utilidad total” → `totalGeneral`.
- Card “Utilidad promedio diaria” → `promedioDiario`.
- Mostrar rango en subtítulo: `fechaInicio` – `fechaFin`.

### 3.4. Errores

Iguales a `/kpi/data`:

- **400** → parámetros faltantes o KPI inválido.
- **500** → error interno.

---

## 4. `GET /kpi/statistical` – KPIs estadísticos (un solo dato)

**Objetivo**: mostrar **indicadores tipo “Top / Máximo / Inventario”** para el periodo completo (no serie).

### 4.1. Parámetros

**Obligatorios**:

- `schema`: string.
- `from`: string (`YYYY-MM-DD`).
- `to`: string (`YYYY-MM-DD`).
- `kpi`: uno de:
  - `diaMasExitoso`
  - `ventaMasExitosa`
  - `cajeroConMasVentas`
  - `productoMasVendidoUSD`
  - `productoMasVendidoUND`
  - `laboratorioMasVentasUSD`
  - `laboratorioMasVentasUND`
  - `valoresInventario`

**Opcionales**:

- `table`: string (por defecto `ventas`).
- `codemp`, `nomempc`: filtros de empresa/sucursal.

### 4.2. Ejemplos de uso por KPI

**Día más exitoso (tarjeta)**:

```text
GET {BASE_URL}/kpi/statistical?schema=12345678&from=2024-01-01&to=2024-01-31&kpi=diaMasExitoso
```

```json
{
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-01-31",
  "data": {
    "periodo": "2024-01-15",
    "total_ventas": "45230.50",
    "facturas": "128",
    "unidades": "342"
  }
}
```

**Venta más exitosa**:

```text
GET {BASE_URL}/kpi/statistical?schema=12345678&from=2024-01-01&to=2024-01-31&kpi=ventaMasExitosa
```

```json
{
  "data": {
    "id": "123",
    "fecha": "2025-01-15",
    "cod_clibs": "C001",
    "nom_clibs": "Cliente X",
    "total_ventas": "5200.00",
    "codemp": "001",
    "nomemp": "Sucursal Centro"
  }
}
```

**Producto más vendido (USD y UND)**  
Puedes llamar dos veces y unificar en una sola tarjeta:

```text
GET ...&kpi=productoMasVendidoUSD
GET ...&kpi=productoMasVendidoUND
```

Y en el frontend mostrar:

- Nombre/código producto.
- Monto en USD (`total_ventas`).
- Unidades (`unidades_vendidas`).

**Laboratorio con más ventas (USD y UND)**  
Mismo patrón que producto:

```text
GET ...&kpi=laboratorioMasVentasUSD
GET ...&kpi=laboratorioMasVentasUND
```

**Valores de inventario**:

```text
GET {BASE_URL}/kpi/statistical?schema=12345678&from=2024-01-01&to=2024-01-31&kpi=valoresInventario
```

```json
{
  "data": {
    "cantidad_und_inv": "5420",
    "total_usdca_inv": "125000.00",
    "total_usdcp_inv": "98000.00",
    "total_bsca_inv": "862500.00",
    "total_bscp_inv": "676200.00"
  }
}
```

### 4.3. Errores

- **400** `schema, from, to and kpi are required`
- **400** `KPI estadístico no válido. Permitidos: ...`
- **500** error interno.

---

## 5. Recomendaciones para el agente frontend

- **Reusar filtros**: siempre pasar `schema`, y si el usuario trabaja con empresas/sucursales, incluir `codemp`/`nomempc` en las tres rutas para mantener consistencia.
- **Sincronizar tarjetas y gráficos**:
  - Para un mismo KPI, usar:
    - `/kpi/data` para la gráfica.
    - `/kpi/data/summary` para las tarjetas numéricas.
    - `/kpi/statistical` para los indicadores de “top / máximo / inventario”.
- **Manejo de `representation`**:
  - Cambiar dinámicamente el tipo de gráfico (o el intervalo de labels) según `representation` (`dias`, `semanas`, `meses`, `anual`).

---

## 6. `GET /kpi/companies` – Poblar select de empresas

**Objetivo**: obtener la lista de empresas (`codemp`, `nomemp`) para poblar combos/selectores en el frontend.

### 6.1. Parámetros

- `schema` (requerido): schema del cliente.
- `table` (opcional): tabla, por defecto `ventas`.

### 6.2. Ejemplo de llamada

```text
GET {BASE_URL}/kpi/companies?schema=12345678
```

### 6.3. Respuesta

```json
{
  "data": [
    { "codemp": "001", "nomemp": "Sucursal Centro" },
    { "codemp": "002", "nomemp": "Sucursal Norte" }
  ]
}
```

**Uso típico en frontend**:

- Llenar un `<select>` de empresas:
  - `value` = `codemp`
  - `label` = `nomemp`
- Pasar el `codemp` seleccionado a:
  - `/kpi/data`, `/kpi/data/summary`, `/kpi/statistical`
  - u otros endpoints (`/kpi/branches`, etc.) para mantener consistencia de filtros.

