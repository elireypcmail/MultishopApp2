import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import FooterGraph from "./Footer";
import BarChartComponent from "./BarChart";
import PieChartComponent from "./PieChart";
import LineChartComponent from "./AreaChart";
import BarChartMixedComponent from "./BarChartMixed";
import { defaultChartTypes } from "@conf/defaultChartTypes";
import GraphTypeModal from "./GraphType";
import {
  Sun,
  Moon,
  NotFound,
  ArrowLeft,
  Options,
  Winner,
  WinnerSale,
  CloseModal,
  FactoryLogo,
  Inventory,
  Boxes,
  Employee,
  Earnings
} from "./Icons";

export default function Graph() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [chartDataState, setChartDataState] = useState(null);
  const [nameGraph, setNameGraph] = useState("");
  const [dateGraph, setDateGraph] = useState("");
  const [currentGraphType, setCurrentGraphType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [category, setCategory] = useState("");
  const [typeRange, setTypeRange] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [confirmedCompany, setConfirmedCompany] = useState(null);
  const [typeCompanies, setTypeCompanies] = useState("");
  const [lastDateSincro, setLastDateSincro] = useState("");
  const [lastDateSincroHour, setLastDateSincroHour] = useState("");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    const savedCategory = localStorage.getItem("selectedCategory");
    setCategory(savedCategory || "");
    const savedTypeCompanies = localStorage.getItem("typeCompanies");
    setTypeCompanies(savedTypeCompanies || "");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    loadName();
    loadChartData();
  }, []);

  const loadChartData = () => {
    const storedChartData = localStorage.getItem("chartData");
    const storedNoDataMessage = localStorage.getItem("noDataMessage");

    if (storedNoDataMessage) {
      setNoDataMessage(storedNoDataMessage);
      localStorage.removeItem("noDataMessage");
    }

    if (storedChartData) {
      try {
        const parsedData = JSON.parse(storedChartData);
        console.log("Loaded chart data:", parsedData);
        setChartDataState(parsedData);
      } catch (error) {
        console.error("Error parsing chart data:", error);
        setNoDataMessage("Error al cargar los datos del gráfico.");
      }
    }
  };

  useEffect(() => {
    const selectedGraphType = localStorage.getItem("selectedGraphType");
    const defaultGraphType = defaultChartTypes[nameGraph] || "Barra";
    setCurrentGraphType(selectedGraphType || defaultGraphType);
  }, [nameGraph]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const loadName = () => {
    let res = localStorage.getItem("selectedGraphName");
    const date = JSON.parse(localStorage.getItem("dateRange"));
    const lastdateSincronizate = localStorage.getItem("lastdateSincro")

    if (date) {
      const lastest = new Date(lastdateSincronizate)
      const hour = new Date(lastdateSincronizate)
      const from = new Date(date.from);
      const to = new Date(date.to);
      const lastedFormated = lastest.toLocaleDateString("en-CA")
      const hourFormated = hour.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      const fromFormatted = from.toLocaleDateString("en-CA");
      const toFormatted = to.toLocaleDateString("en-CA");

      const diffInTime = to.getTime() - from.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

      let typeRange;
      if (diffInDays <= 15) {
        typeRange = "Diario";
      } else if (diffInDays <= 45) {
        typeRange = "Semanal";
      } else {
        typeRange = "Mensual";
      }

      setNameGraph(res);
      setDateGraph(`${fromFormatted} / ${toFormatted}`);
      setLastDateSincro(lastedFormated)
      setLastDateSincroHour(hourFormated)
      setTypeRange(typeRange);
    }
  };

  const renderChart = () => {
    if (noDataMessage) {
      return (
        <div className="not-found">
          <div className="icon-not-found">
            <NotFound />
          </div>
          <span>{noDataMessage}</span>
        </div>
      );
    }

    if (!chartDataState) {
      return <div>Cargando datos...</div>;
    }

    if (category === "Estadísticos") return renderStatisticalData();

    const chartData = chartDataState.results || chartDataState;

    let selectedGraph = localStorage.getItem("selectedGraph");

    console.log(selectedGraph)

    if (selectedGraph === "flujoDeCaja") return renderStatisticalData();


    let typeCompanies = localStorage.getItem("typeCompanies");

    if (selectedGraph == "ventasVScompras" || typeCompanies == "Multiple") {
      return (
        <BarChartMixedComponent
          data={chartData}
          dateRange={chartDataState.dateRange}
          dateTypeRange={typeRange}
        />
      );
    }

    switch (currentGraphType) {
      case "Barra":
        return (
          <BarChartComponent
            data={chartData}
            dateRange={chartDataState.dateRange}
            dateTypeRange={typeRange}
          />
        );
      case "Torta":
        return (
          <PieChartComponent
            data={chartData}
            dateRange={chartDataState.dateRange}
            dateTypeRange={typeRange}
          />
        );
      case "Línea":
        return (
          <LineChartComponent
            data={chartData}
            dateRange={chartDataState.dateRange}
            dateTypeRange={typeRange}
          />
        );
      default:
        return (
          <div className="not-found">
            <div className="icon-not-found">
              <NotFound />
            </div>
            <span>No se ha seleccionado ningún tipo de gráfico válido.</span>
          </div>
        );
    }
  };

  const renderStatisticalData = () => {
    console.log("Statistical Data:", chartDataState);

    if (!chartDataState || Object.keys(chartDataState).length === 0) {
      return <div>No hay datos estadísticos disponibles.</div>;
    }

    const typeCompanies = localStorage.getItem("typeCompanies");
    const dataEntries = Object.entries(chartDataState).filter(
      ([key]) => key !== "dateRange"
    );

    // Extraer nombres únicos de empresas
    const uniqueCompanies = [
      ...new Set(dataEntries.flatMap(([, values]) => values.nomemp)),
    ];

    // Si no se ha seleccionado ninguna empresa, se usa la primera empresa disponible
    const activeCompany = confirmedCompany || uniqueCompanies[0];

    const handleSelectCompany = (company) => {
      setSelectedCompany(company);
    };

    const handleSaveSelection = () => {
      setConfirmedCompany(selectedCompany);
      setModalVisible(false);
      console.log("Empresa confirmada:", selectedCompany);
    };

    const getFieldName = (key) => {
      const fieldNames = {
        nom_op_bs: "Nombre",
        cod_op_bs: "Código",
        nom_clibs: "Cliente",
        cod_clibs: "Código Cliente",
        nom_fab_bs: "Fabricante",
        cod_fab_bs: "Código Fabricante",
        nom_art_bs: "Producto",
        cod_art_bs: "Código Producto",
        numero_operaciones: "N° de Operaciones",
        unidades_vendidas: "Unidades Vendidas",
        fecha: "Fecha",
        total_ventas: "Total Ventas",
        cantidad_und_inv: "Cantidad de Unidades",
        total_usdca_inv: "Valor Inventario USD CA",
        total_usdcp_inv: "Valor Inventario USD CP",
        total_bsca_inv: "Valor Inventario BS CA",
        total_bscp_inv: "Valor Inventario BS CP",
        clientesa: "Clientes Atendidos",
        clientesf: "Clientes Frecuentes",
        clientesn: "Clientes Nuevos",
        nomemp: "Empresa",
        totusd: "Total Dolares",
        totcop: "Total Pesos",
        totbs: "Total Bs",
      };
      return fieldNames[key] || key;
    };

    const isTopDay =
      nameGraph.includes("Día más Exitoso") ||
      nameGraph.includes("Valores de Inventario");

    // Lista de KPIs para los cuales NO mostrar la fecha
    const hideDateForKPI = [
      "Productos más vendidos",
      "Fabricantes con más Ventas",
      "Cajeros con más Venta",
      "Flujo de Caja"
    ];

    const hideNomempForKPI = [
      "Productos más vendidos",
      "Fabricantes con más Ventas",
      "Cajeros con más Venta",
      "Valores de Inventario",
      "Cajeros con más venta",
      "Flujo de Caja"
    ];

    const hideCompanySelectorForKPI = ["Día más Exitoso", "Venta más Exitosa"];

    return (
      <div className="statistical-data w-full max-w-md p-6">
        {typeCompanies === "Multiple" &&
          !hideCompanySelectorForKPI.includes(nameGraph) && (
            <div>
              <button
                className="button-selectComp"
                onClick={() => setModalVisible(true)}
              >
                Seleccionar Empresa
              </button>
            </div>
          )}
        {activeCompany && !hideCompanySelectorForKPI.includes(nameGraph) && (
          <div
            style={{
              textAlign: "center",
              fontSize: "17px",
              fontWeight: 500,
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {activeCompany}
          </div>
        )}
        {typeCompanies !== "Multiple" && activeCompany && hideCompanySelectorForKPI.includes(nameGraph) && (
          <div
            style={{
              textAlign: "center",
              fontSize: "17px",
              fontWeight: 500,
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {activeCompany}
          </div>
        )}
        {nameGraph == "Día más Exitoso" && (
          <div className="found-winner">
            <div>
              <Winner />
            </div>
          </div>
        )}
        {nameGraph == "Venta más Exitosa" && (
          <div className="found-winner">
            <div>
              <WinnerSale />
            </div>
          </div>
        )}
        {nameGraph == "Fabricantes con más Ventas" && (
          <div className="found-winner">
            <div>
              <FactoryLogo />
            </div>
          </div>
        )}
        {nameGraph == "Cajeros con más Venta" && (
          <div className="found-winner">
            <div>
              <Employee />
            </div>
          </div>
        )}
        {nameGraph == "Productos más vendidos" && (
          <div className="found-winner">
            <div>
              <Boxes />
            </div>
          </div>
        )}
        {nameGraph == "Valores de Inventario" && (
          <div className="found-winner">
            <div>
              <Inventory />
            </div>
          </div>
        )}
        {nameGraph == "Flujo de Caja" && (
          <div className="found-winner">
            <div>
              <Earnings />
            </div>
          </div>
        )}
        {modalVisible && (
          <div className="modal-type" style={{ backgroundColor: "#00000042" }}>
            <div className="modal-content-type">
              <span
                className="close-button"
                onClick={() => setModalVisible(false)}
              >
                <CloseModal />
              </span>
              <h2 className="ti-graph">Seleccionar Empresa</h2>
              <ul
                className="flex flex-col text-center list-none gap-[20px]"
                style={{ gap: "10px" }}
              >
                {uniqueCompanies.map((company) => (
                  <li
                    key={company}
                    className={`separate ${
                      selectedCompany === company ? "selected" : ""
                    }`}
                  >
                    <button onClick={() => handleSelectCompany(company)}>
                      {company}
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <button
                  style={{
                    padding: "5px 20px",
                    backgroundColor: "#4487B2",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    textAlign: "center",
                    borderRadius: "10px",
                    color: "white",
                    fontFamily: "title",
                    fontSize: "18px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleSaveSelection}
                >
                  Mostrar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flow-root">
          {/* {activeCompany && <p>{activeCompany}</p>} */}
          <ul role="list" className="divide-y">
            {dataEntries
              .filter(([, value]) => {
                // Mostrar todas las empresas si el KPI es "Día más Exitoso" o "Venta más Exitosa"
                if (hideCompanySelectorForKPI.includes(nameGraph)) {
                  return true;
                }
                return value.nomemp === activeCompany;
              })
              .sort(([, valueA], [, valueB]) => {
                // Si estamos mostrando todas las empresas, ordenar por 'total_ventas' de mayor a menor
                if (hideCompanySelectorForKPI.includes(nameGraph)) {
                  return valueB.total_ventas - valueA.total_ventas; // Orden descendente por total_ventas
                }
                return 0; // Si no, no ordenar (deja el orden original)
              })
              .map(([key, value]) => {
                const sortedEntries = Object.entries(value).sort(
                  ([fieldKeyA], [fieldKeyB]) => {
                    if (hideCompanySelectorForKPI.includes(nameGraph)) {
                      if (fieldKeyA === "nomemp") return -1; // Priorizar "nomemp"
                      if (fieldKeyB === "nomemp") return 1;
                    }
                    if (isTopDay) {
                      if (fieldKeyA === "fecha") return -1; // Priorizar 'fecha'
                      if (fieldKeyB === "fecha") return 1;
                    }
                    return 0; // Mantener el orden original en otros casos
                  }
                );

                return (
                  <li key={key} className="statistical-item py-10 sm:py-10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 ms-4">
                        {sortedEntries.map(([fieldKey, fieldValue]) => {
                          if (
                            fieldKey === "id" ||
                            fieldKey === "total_ventas" ||
                            fieldKey === "codemp"
                          )
                            return null;

                          // Ocultar valores en algunos KPI
                          if (
                            fieldKey === "fecha" &&
                            hideDateForKPI.includes(nameGraph)
                          )
                            return null;
                          if (
                            fieldKey === "nomemp" &&
                            hideNomempForKPI.includes(nameGraph)
                          )
                            return null;
                          if (
                            fieldKey === "nomemp" &&
                            typeCompanies !== "Multiple" &&
                            hideCompanySelectorForKPI.includes(nameGraph)
                          ) {
                            return null;
                          }
                            
                          if (fieldKey === "fecha") {
                            // Convertir la fecha a un objeto Date
                            const date = new Date(fieldValue);

                            // Asegurarse de que la fecha esté en formato 'YYYY-MM-DD'
                            const isoDate = date.toISOString().split("T")[0]; // Esto te dará 'YYYY-MM-DD'
                            console.log(isoDate);

                            return (
                              <p
                                key={fieldKey}
                                className="text-sm text-gray-500 truncate dark:text-gray-400"
                              >
                                {getFieldName(fieldKey)}: {isoDate}{" "}
                                {/* Usar la fecha en formato 'YYYY-MM-DD' */}
                              </p>
                            );
                          } else if (
                            typeof fieldValue === "string" ||
                            typeof fieldValue === "number"
                          ) {
                            // const formattedValue = !isNaN(parseFloat(fieldValue))
                            // ? new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(fieldValue))
                            // : fieldValue;
                        
                            const formatNumber = (value) => {
                              if (isNaN(value) || value === "" || value === null) return value;
                            
                              const number = parseFloat(value).toFixed(2); // Asegura dos decimales
                              return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/(\d+)\.(\d{2})$/, "$1,$2");
                            };
                            
                            const formattedValue = formatNumber(fieldValue);

                            return (
                              <p
                                key={fieldKey}
                                className="text-sm text-gray-500 truncate dark:text-gray-400"
                              >
                                {getFieldName(fieldKey)}: {formattedValue}
                              </p>
                            );
                          }
                        })}
                      </div>
                      {nameGraph !== "Valores de Inventario" && nameGraph !== "Flujo de Caja" && (
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {`$${parseFloat(value.total_ventas).toLocaleString(
                            "es-ES",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  };

  const backRouter = (e) => {
    e.preventDefault();
    router.push("/listkpi");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveGraphType = (newGraphType) => {
    setCurrentGraphType(newGraphType);
    localStorage.setItem("selectedGraphType", newGraphType);
    setIsModalOpen(false);
  };

  return (
    <div className="body">
      <div className="calendar gra-content">
        <div className="graph-option">
          <div className="graph-type" onClick={handleOpenModal}>
            <Options />
          </div>
          <div className="mood">
            <button
              className={`mood-btn ${darkMode ? "dark" : ""}`}
              onClick={toggleDarkMode}
            >
              <Sun className="icon" />
              <div className="circle2"></div>
              <Moon className="icon" />
            </button>
          </div>
        </div>

        <div className="graph__body">
          <div className="graph__header">
            <div className="content-header">
              <div className="graph__header__title">{nameGraph}</div>
              <div className="graph__header__data">
                <span>Periodo: {dateGraph}</span>
                <span>
                  Ult Actualización: {lastDateSincro} - {lastDateSincroHour}
                </span>

                {/* <span>{activeCompany}</span> */}
                {nameGraph !== "Día más Exitoso" &&
                  nameGraph !== "Venta más Exitosa" &&
                  nameGraph !== "Cajeros con más Venta" &&
                  nameGraph !== "Fabricantes con más Ventas" &&
                  nameGraph !== "Productos más vendidos" &&
                  nameGraph !== "Valores de Inventario" &&
                  nameGraph !== "Análisis de Ventas vs Compras" &&
                  nameGraph !== "Flujo de Caja" &&
                  (typeCompanies !== "Multiple" ? (
                    <div>
                      <span>Tipo de presentación de datos: {typeRange}</span>
                    </div>
                  ) : null)}
              </div>
            </div>
          </div>
          <div className="graph__body__content">{renderChart()}</div>

          <div className="button__graph">
            <button className="btn" onClick={backRouter}>
              <ArrowLeft />
              <span>Atrás</span>
            </button>
          </div>
        </div>

        <FooterGraph />
      </div>

      {isModalOpen && category !== "Estadísticos" && (
        <GraphTypeModal
          onClose={handleCloseModal}
          onSave={handleSaveGraphType}
          selectedGraphName={nameGraph}
        />
      )}
    </div>
  );
}
