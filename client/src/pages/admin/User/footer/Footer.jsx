import React from 'react';
import { FcStart } from "react-icons/fc";
import { FaWhatsapp } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { MdSmartphone } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import LogoSVG from "/icons8-whatsapp.svg";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo">
        <img src={LogoSVG} alt="Logo" />
      </div>
      <div className="footer-icons">
        <FcStart className="icons-footer" />
        <FaWhatsapp className="icons-footer" />
        <MdMarkEmailRead className="icons-footer" />
        <MdSmartphone className="icons-footer" />
        <FiPhoneCall className="icons-footer" />
      </div>
      <p className="footer-text">Usando Footer client</p>
    </footer>
  );
};

export default Footer;

