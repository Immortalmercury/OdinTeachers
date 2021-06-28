import React from "react";
import {  Route, Switch, Redirect } from "react-router-dom";
// components
import Layout from "./components/Layout/Layout";

// pages
import Error from "./pages/error/Error";
import Login from "./pages/login/Login";

// context
import { useUserState } from "./context/UserContext"; 

export default function App() {
  // global
  var { isAuthenticated } = useUserState();

  return (
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/teacher" />} />
      <AuthenticatedRoute path="/teacher" component={Layout} />
      <UnauthenticatedRoute path="/login" component={Login} />
      <Route component={Error} />
    </Switch>
  );

  // #######################################################################

  // Доступ разрешен только аутентифированному пользователю, иначе перенаправит на страницу "/login"
  function AuthenticatedRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  // Доступ разрешен только, если пользователь но вошел в систему, иначе перенаправит на "/"
  function UnauthenticatedRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
