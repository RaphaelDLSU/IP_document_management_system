
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import Home from "./Home";
import NavbarComponent from "../Navbar";

const TaskManager = () => {
  const history = useHistory();
  const { path } = useRouteMatch();

  const { isLoggedIn } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );
  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn]);
  return (
    <Container fluid className="px-0" style={{ overflowX: "hidden" }}>
      <NavbarComponent />
      <Switch >
        <Route exact path={path} component={Home} />
      </Switch>
    </Container>
  );
};

export default TaskManager;
