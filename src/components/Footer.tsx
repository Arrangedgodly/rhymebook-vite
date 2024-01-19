const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer footer-center bg-primary text-primary-content p-2 fixed bottom-0 left-0">
      <p className="text-sm font-bold p-0 m-0">
        Copyright © {currentYear} - All rights reserved by RhymePage.com
      </p>
    </footer>
  );
};

export default Footer;
