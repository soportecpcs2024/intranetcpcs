import { FcStart } from "react-icons/fc";
import { FaWhatsapp } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { MdSmartphone } from "react-icons/md";
import LogoSVG from "/icons8-whatsapp.svg";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <div>
      <h4>Usando Footer client</h4>

     
      <img src={LogoSVG} alt="Logo" className="icons-footer" />

      
      <FcStart className="icons-footer" />
      <MdMarkEmailRead className="icons-footer" />
      <MdSmartphone className="icons-footer" />
      <FiPhoneCall className="icons-footer" />
    </div>
  );
};

export default Footer;
