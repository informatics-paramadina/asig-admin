import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

const Routers = () => {
  return (
    <BrowserRouter forceRefresh={true}>
      <LoginRoute path={"/"} exact>
        <Login />
      </LoginRoute>
      <PrivateRoute path={"/home"}>
        <Dashboard />
      </PrivateRoute>
    </BrowserRouter>
  );
};

const LoginRoute = ({ children, ...rest }) => {
  const [cookie, setCookie, removeCookie] = useCookies(["asig"]);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (Object.keys(cookie).length != 0) ? (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
};

const PrivateRoute = ({ children, ...rest }) => {
  const [cookie, setCookie, removeCookie] = useCookies(["asig"]);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (Object.keys(cookie).length != 0) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default Routers;
