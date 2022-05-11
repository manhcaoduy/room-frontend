import * as React from "react";

interface HeaderProps {
  siteTitle?: string;
}

const Header = ({ siteTitle = "" }: HeaderProps): JSX.Element => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <a href="/" className="text-white no-underline">
          {siteTitle}
        </a>
      </h1>
    </div>
  </header>
);

export default Header;
