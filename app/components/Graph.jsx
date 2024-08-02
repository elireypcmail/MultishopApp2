import FooterGraph from './Footer'

export default function Graph() {
  return(
    <div className="body">
      <div className="calendar gra-content">
        <div className="graph__body">
          <div className="graph__header">
            <div className="graph__header__title">Graph</div>
            <div className="graph__header__data">
              <span>Dato1: 10</span>
              <span>Dato2: 20</span>
              <span>Dato3: 30</span>
            </div>
          </div>
          <div className="graph__body__content">
          </div>
        </div>

        <FooterGraph />
      </div>
    </div>
  )
}