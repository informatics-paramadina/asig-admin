import React from "react";

import {
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiImage,
} from "@elastic/eui";
import logo from "../Images/blueasig.png";
import { NavLink, useHistory, withRouter } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
  const history = useHistory();
  const [cookie, setCookie, removeCookie] = useCookies(["asig"]);

  function Logout() {
    removeCookie("asig");
    history.push("/");
  }
  return (
    <EuiHeader position="fixed">
      <EuiHeaderSectionItem border="right">
        <EuiImage size={60} src={logo} />
      </EuiHeaderSectionItem>

      <EuiHeaderSectionItem>
        <EuiHeaderLinks aria-label="App navigation links example">
          <NavLink to={"/home"}>
            <EuiHeaderLink>Dashboard</EuiHeaderLink>
          </NavLink>
          <NavLink to={"/search"}>
            <EuiHeaderLink>Search Data</EuiHeaderLink>
          </NavLink>
          <EuiHeaderLink onClick={() => Logout()}>Logout</EuiHeaderLink>
        </EuiHeaderLinks>
      </EuiHeaderSectionItem>
    </EuiHeader>
  );
};

export default withRouter(Header);
