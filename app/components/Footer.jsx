import Link from "next/link"
import { 
  CalendarRange,
  CategoryGraph,
  CategoryList,
  Graph,
  Logout
} from "./Icons"

export default function FooterGraph() {
  return(
    <footer className="menu">
      <div className="menu-item">
        <span className="link">
          <Link href={'/date'}>
            <CalendarRange />
          </Link>
        </span>
        <span className="link">
          <Link href={'/category'}>
            <CategoryGraph />
          </Link>
        </span>
        <span className="link">
          <Link href={'/listkpi'}>
            <CategoryList />
          </Link>
        </span>
        <span className="link">
          <Link href={'/graph'}>
            <Graph />
          </Link>
        </span>
        <span className="link">
          <Link href={'/'}>
            <Logout />
          </Link>
        </span>
      </div>
    </footer>
  )
}