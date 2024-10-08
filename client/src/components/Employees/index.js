
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'

import Navbar from "../Navbar";
import Home from "./Home";


const Employees = () => {
    const history = useHistory();
    const { path } = useRouteMatch();
    const database = getFirestore()

    const { isLoggedIn,user } = useSelector(
        (state) => ({
          isLoggedIn: state.auth.isLoggedIn,
          user:state.auth.user
        }),
        shallowEqual
      );
    useEffect(async() => {
        if (!isLoggedIn) {
            history.push("/login");
        }
        if(user){

          const getRole = ()=>{
            
          }
            let role
            const q = query(collection(database, "users"), where("email", "==", user.data.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              role = doc.data().role
            });
        
            if (role =='Requestor' || role =='Employee'){
              history.push("/")
            }
          }
    }, [isLoggedIn,user]);
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

export default Employees;
