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
import Recaptcha from "react-recaptcha";

let recaptchaInstance;

const Login = () => {
  const [field, setField] = useState({
    email: undefined,
    password: undefined,
  });
  const [invalid, setInvalid] = useState({
    email: false,
    password: false,
  });
  const [ready, setReady] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [cookie, setCookie] = useCookies(["asig"]);
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
    if (!captcha) return;
    recaptchaInstance.reset();
    setCaptcha(false);

    let checkmail = false,
      checkpass = false,
      jenis_akun = "";
    let listAuth = [
      {
        email: "jalurvip@asig14.himti.my.id",
        password: "y44s1gy4m4nt4p!",
        jenis_akun: "webdev",
      },
      {
        email: "divisi.talkshow@asig14.himti.my.id",
        password: "t4lksh0wg0ks!",
        jenis_akun: "talkshow",
      },
      {
        email: "divisi.game@asig14.himti.my.id",
        password: "v4l0r4ntbur1k!",
        jenis_akun: "game",
      },
    ];

    listAuth.forEach((auth) => {
      if (field.email === auth.email) {
        checkmail = true;
        if (field.password === auth.password) {
          checkpass = true;
          jenis_akun = auth.jenis_akun;
        }
      }
    });

    if (!checkmail) {
      setInvalid((invalid) => ({ ...invalid, email: true }));
      return;
    } else {
      setInvalid((invalid) => ({ ...invalid, email: false }));
    }

    if (!checkpass) {
      setInvalid((invalid) => ({ ...invalid, password: true }));
      return;
    } else {
      setInvalid((invalid) => ({ ...invalid, password: false }));
    }
    history.push("home");

    setCookie("asig", jenis_akun);
    console.log(cookie);
  }

  const verifyCallback = function (response) {
    setCaptcha(true);
  };

  const expiredCallback = () => {
    setCaptcha(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 1000);
  }, []);

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
        {ready ? (
          <Recaptcha
            sitekey={process.env.REACT_APP_CAPTCHA_KEY}
            ref={(e) => (recaptchaInstance = e)}
            verifyCallback={verifyCallback}
            expiredCallback={expiredCallback}
            size="normal"
            theme="dark"
          />
        ) : (
          ""
        )}
        <EuiSpacer />
        <EuiButton isDisabled={!captcha} onClick={ButtonClick}>
          {!captcha ? "Please solve the captcha" : "Login"}
        </EuiButton>
      </div>
    </EuiPageTemplate>
  );
};

export default withRouter(Login);
