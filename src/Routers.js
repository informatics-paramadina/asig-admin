import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Certificate from "./Pages/Certificate";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Search from "./Pages/Search";

const Routers = () => {
  return (
    <BrowserRouter>
      <Route path={"/certificate"}>
        <Certificate />
      </Route>
      <LoginRoute path={"/"} exact>
        <Login />
      </LoginRoute>
      <PrivateRoute path={"/home"}>
        <Dashboard />
      </PrivateRoute>
      <PrivateRoute path={"/search"}>
        <Search />
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
        Object.keys(cookie).length != 0 ? (
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
        Object.keys(cookie).length != 0 ? (
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
