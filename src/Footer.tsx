// Footer.jsx or Footer.tsx
import React from "react";


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>This tool is for demonstrating AI capabilities and exploring predictions. It is not designed for clinical use or medical decision-making. </p>
                <p><i className="fa-solid fa-heart" style={{color: "red"}}></i> Made with love in 2024. </p>
            </div>
        </footer>
    );
};

export default Footer;
