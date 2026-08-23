const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer footer-center w-full flex-none bg-primary text-primary-content p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <p className="text-sm font-bold p-0 m-0">
        Copyright © {currentYear} - All rights reserved by RhymePage.com
      </p>
    </footer>
  );
};

export default Footer;
