import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { RiProductHuntLine } from "react-icons/ri";
import { BsBorderStyle } from "react-icons/bs";
const AdmSidebarInfoAcad = () => {
    return (
        <>
          <h2 className="sidebarH2">INFORMES</h2>
          <nav className="containerNav">
            <Link className="linkNav" to="/general">
              <PiUsersThreeBold className="icons" />
              <p>Académico de grupos</p>
            </Link>
            <Link className="linkNav" to="/areas">
              <PiUsersThreeBold className="icons" />
              <p>Académico por áreas</p>
            </Link>
          </nav>
        </>
      );
}

export default AdmSidebarInfoAcad
