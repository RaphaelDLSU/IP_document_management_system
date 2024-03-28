import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import NavbarComponent from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Workflows from './components/Workflows'
import { Chatbot } from 'react-chatbot-kit'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'

import "./App.css";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
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
import DocumentCreation from "./components/Document Creation";
import Registration from "./components/Registration";
import Requests from "./components/Requests";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import RequestsManager from "./components/RequestsManager";
import RequestorHome from "./components/Home/Requestor";
import Spinner from 'react-bootstrap/Spinner';
import CEOHome from "./components/Home/CEO";
import ManagerHome from "./components/Home/Manager";
import EmployeeHome from "./components/Home/Employee";
const App = () => {
  const database = getFirestore()
  const dispatch = useDispatch();
  const [showChatbot, toggleChatbot] = useState(false);
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const { isLoggedIn, user } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user
    }),
    shallowEqual
  );


  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUser());
    }
  }, [dispatch]);

  useEffect(async () => {
    if (user) {
      const s = query(collection(database, "users"), where("email", "==", user.data.uid));
      const querySnapshot = await getDocs(s);
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        setRole(doc.data().role)
      });
    }

    console.log('role: ' + role)
  }, [user])
  useEffect(async () => {
    if (role) {
      setLoading(false)

    }

  }, [role])

  return (
    <div className="App">
      <ToastContainer position="bottom-right" />

      <Switch>
        <Route exact path={"/"}>
          <NavbarComponent />

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

          {loading ? (
            <>
              <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
              </div>
            </>

          ) : (
            <>
              {role == 'Requestor' && (
                <>
                  <button
                    className="app-chatbot-button"
                    onClick={() => toggleChatbot((prev) => !prev)}
                  >
                    <ButtonIcon className="app-chatbot-button-icon" />
                  </button>
                  <RequestorHome></RequestorHome>
                </>

              )}
              {role == 'CEO' && (
                <CEOHome></CEOHome>
              )}
              {role == 'Manager' && (
                <ManagerHome></ManagerHome>
              )}
              {role == 'Employee' &&(
                <EmployeeHome></EmployeeHome>
              )}
            </>
          )}
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
