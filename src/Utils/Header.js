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
import { NavLink, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
    const history = useHistory();
    const [cookie, setCookie, removeCookie] = useCookies(['asig']);

    function Logout()
    {
        removeCookie('asig');
        history.location('/')
    }
  return (
    <EuiHeader position="fixed">
      <EuiHeaderSectionItem border="right">
        <EuiImage size={60} src={logo} />
      </EuiHeaderSectionItem>

      <EuiHeaderSectionItem>
        <EuiHeaderLinks aria-label="App navigation links example">
            <EuiHeaderLink onClick={() => Logout()}>Logout</EuiHeaderLink>
        </EuiHeaderLinks>
      </EuiHeaderSectionItem>
    </EuiHeader>
  );
};

export default Header;
