import React from "react";
import "./Layout.css";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div>
      {/*<nav className="container-fluid">
              <ul>
                  <li>
                      <h1>What the Health etc</h1>
                  </li>
              </ul>
          </nav>*/}
      <main className="container-fluid">{props.children}</main>
    </div>
  );
};

export default Layout;
