import instance from '@g/api'

export async function fetchKpiAndLastSync({
  category,
  instanciaUser,
  typeCompanies,
  from,
  to,
  kpiSelected,
  criterio,
}) {
  if (!instanciaUser) {
    throw new Error('Instancia de usuario no disponible')
  }

  const fromDate = new Date(from).toLocaleDateString('en-CA')
  const toDate = new Date(to).toLocaleDateString('en-CA')

  const isCustomKpi = category === 'Estadísticos' || kpiSelected === 'flujoDeCaja'
  const endpoint = isCustomKpi ? '/graphs/custom' : '/graphs/filter-data'

  const filterDataBody = {
    schema: instanciaUser,
    fechaInicio: fromDate,
    fechaFin: toDate,
    kpi: kpiSelected,
    typeCompanies: typeCompanies || '',
  }

  const customKpiBody = {
    schema: instanciaUser,
    table: 'ventas',
    fechaInicio: fromDate,
    fechaFin: toDate,
    kpi: kpiSelected,
    ...(kpiSelected === 'ProductosTOP' || kpiSelected === 'LaboratorioConMasVentas'
      ? { criterio }
      : {}),
  }

  const [dataResponse, lastDateResponse] = await Promise.all([
    instance.post(endpoint, isCustomKpi ? customKpiBody : filterDataBody),
    instance.post('/clients/lastDateSincro', { cliente: instanciaUser }),
  ])

  const data = dataResponse.data
  const lastSyncDate = lastDateResponse.data?.data ?? null

  // console.log(data);
  // console.log(lastSyncDate);
  // console.log(fromDate);
  // console.log(toDate);
  // console.log(kpiSelected);
  // console.log(criterio);
  // console.log(typeCompanies);
  // console.log(customKpiBody)
  // console.log(filterDataBody)
  return { data, lastSyncDate, fromDate, toDate }
}

