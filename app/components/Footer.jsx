import { useEffect, useState } from "react";
import ModalToken from "./ModalToken";
import Link from "next/link";
import { removeCookie, getCookie } from "@g/cookies";
import { useRouter } from "next/router";
import {
  CalendarRange,
  CategoryGraph,
  CategoryList,
  Graph,
  Logout,
} from "./Icons";
import { FaKey } from "react-icons/fa6";

export default function FooterGraph() {
  const { push } = useRouter();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [showTokenBadge, setShowTokenBadge] = useState(false);

  const userId = getCookie("instancia"); 
  const storageKey = `token_seen_${userId}`;

  useEffect(() => {
    if (!userId) return;
    // Verificar si el usuario ya vio la opción anteriormente
    const hasSeenToken = localStorage.getItem(storageKey);
    if (!hasSeenToken) {
      setShowTokenBadge(true);
    }
  }, [userId, storageKey]);

  const handleOpenTokenModal = () => {
    setIsTokenModalOpen(true);

    // Marcar como visto definitivamente en el navegador
    if (userId) {
      localStorage.setItem(storageKey, "true");
    }
    // Ocultar el círculo inmediatamente
    setShowTokenBadge(false);
  };

  const handleCloseTokenModal = () => {
    setIsTokenModalOpen(false);
  };

  const logout = () => {
    removeCookie("instancia");
    push("/");
  };

  return (
    <>
      <footer className="menu">
        <div className="menu-item">
          
          {/* 🔑 CONTENEDOR DEL TOKEN CON CÍRCULO */}
          <span
            className="link token-wrapper"
            onClick={handleOpenTokenModal}
            title="Abrir Token"
          >
            <FaKey size={20} color="#fff" className="icon-key" />
            {/* Si showTokenBadge es true, se renderiza el círculo */}
            {showTokenBadge && <span className="red-circle-marker" />}
          </span>

          <span className="link">
            <Link href="/date"><CalendarRange /></Link>
          </span>
          <span className="link">
            <Link href="/category"><CategoryGraph /></Link>
          </span>
          <span className="link">
            <Link href="/listkpi"><CategoryList /></Link>
          </span>
          <span className="link">
            <Link href="/graph"><Graph /></Link>
          </span>
          <span className="link" onClick={logout}>
            <Logout />
          </span>
        </div>
      </footer>

      {isTokenModalOpen && <ModalToken onClose={handleCloseTokenModal} />}
    </>
  );
}