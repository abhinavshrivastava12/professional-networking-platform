import React from "react";

const Footer = () => {
  return (
    <footer className="text-center py-4 border-t bg-white dark:bg-gray-800 text-gray-500 text-sm">
      © {new Date().getFullYear()} Abhinav Shrivastava — All rights reserved.
    </footer>
  );
};

export default Footer;
