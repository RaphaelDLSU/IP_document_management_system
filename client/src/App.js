import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import NavbarComponent from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Workflows from './components/Workflows'
import { Chatbot } from 'react-chatbot-kit'

import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/actionCreators/authActionCreators";

import MessageParser from "./chatbotkit/MessageParser";
import ActionProvider from "./chatbotkit/ActionProvider";
import config from "./chatbotkit/config";
import './botstyle.css';

import Employees from "./components/Employees";
import Notifications from "./components/Notifications";

import { ReactComponent as ButtonIcon } from "./assets/icons/robot.svg";
import { ConditionallyRender } from "react-util-kit";
import TaskManager from "./components/Task Manager";
import DocumentCreation from "./components/Document Creation/DocumentCreation";
import Registration from "./components/Registration";
import Requests from "./components/Requests";

import RequestsManager from "./components/RequestsManager";
const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [showChatbot, toggleChatbot] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUser());
    }
  }, [dispatch]);
  return (
    <div className="App">
      <ToastContainer position="bottom-right" />

      <Switch>
        <Route exact path={"/"}>
          <NavbarComponent />
          <h1>Welcome to file management system</h1>
          <div className="app-chatbot-container">
            <ConditionallyRender
              ifTrue={showChatbot}
              show={
                <Chatbot
                  config={config}
                  messageParser={MessageParser}
                  actionProvider={ActionProvider}
                />
              }
            />
          </div>
          <button
            className="app-chatbot-button"
            onClick={() => toggleChatbot((prev) => !prev)}
          >
            <ButtonIcon className="app-chatbot-button-icon" />
          </button>
        </Route>
        <Route exact path="/login" component={() => <Login />}></Route>
        <Route exact path="/signup" component={() => <Register />}></Route>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/tasks" component={TaskManager} />
        <Route path="/workflows" component={Workflows} />
        <Route path="/requestsmanager" component={RequestsManager} />
        <Route path="/employees" component={Employees} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/documentcreation" component={DocumentCreation} />
        <Route path="/registrations" component={Registration} />
        <Route path="/requests" component={Requests} />
      </Switch>
    </div>
  );
};

export default App;
