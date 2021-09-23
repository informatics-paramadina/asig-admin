import React, { useEffect, useState } from "react";
import {
  EuiText,
  EuiPageTemplate,
  EuiFormRow,
  EuiFieldText,
  EuiFieldPassword,
  EuiSpacer,
  EuiButton,
} from "@elastic/eui";
import { useHistory, withRouter } from "react-router-dom";
import { useCookies } from "react-cookie";


const Login = () => {
  const [field, setField] = useState({
    email: undefined,
    password: undefined,
  });
  const [invalid, setInvalid] = useState({
    email: false,
    password: false,
  });
  const [cookie, setCookie, removeCookie] = useCookies(['asig']);
  const history = useHistory();

  function fieldChange(e) {
    const key = e.target.ariaLabel;
    const value = e.target.value;
    setField((field) => ({
      ...field,
      [key]: value,
    }));
  }

  function ButtonClick() {
    let authemail = "bukasitik@gmail.com";
    let authpass = "1";

    if(field.email != authemail)
    {
        setInvalid(invalid => ({...invalid, email: true}))
        return ;
    } else {
        setInvalid(invalid => ({...invalid, email: false}))
    }

    if(field.password != authpass)
    {
        setInvalid(invalid => ({...invalid, password: true}))
        return ;
    }else {
        setInvalid(invalid => ({...invalid, password: false}))
    }
    history.push('home')
    
    setCookie('asig', 'authtest')
    console.log(cookie);
  }

  return (
    <EuiPageTemplate
      template={"centeredBody"}
      pageHeader={{
        pageTitle: "Login",
      }}
    >
      <div style={{ width: 300 }}>
        <EuiFormRow label="Email" isInvalid={invalid.email} fullWidth>
          <EuiFieldText
            type="email"
            aria-label="email"
            onChange={fieldChange}
            isInvalid={invalid.email}
            fullWidth
          />
        </EuiFormRow>
        <EuiFormRow label="Password" isInvalid={invalid.password} fullWidth>
          <EuiFieldPassword
            aria-label="password"
            onChange={fieldChange}
            isInvalid={invalid.password}
            fullWidth
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiButton onClick={ButtonClick}>Login</EuiButton>
      </div>
    </EuiPageTemplate>
  );
};

export default withRouter(Login);
