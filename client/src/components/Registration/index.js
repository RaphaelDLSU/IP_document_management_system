
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import Navbar from "../Navbar";
import Home from "../Registration/Home";


const Registration = () => {
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
            <Navbar />
            <Switch >
                <Route exact path={path} component={Home} />

                {/* <Route
          exact
          path={`${path}/folder/:folderId`}
          component={FolderComponent}
        />
        <Route exact path={`${path}/file/:fileId`} component={FileComponent} /> */}
            </Switch>
        </Container>
    );
};

export default Registration;
