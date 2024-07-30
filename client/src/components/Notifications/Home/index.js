
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";



import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../Home/index.css'
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';

import '../../../botstyle.css'
import MessageParser from "../../../chatbotkit/MessageParser.js";
import ActionProvider from "../../../chatbotkit/ActionProvider.js";
import config from "../../../chatbotkit/config.js";
import '../../../botstyle.css';
import { ConditionallyRender } from "react-util-kit";
import { Chatbot } from 'react-chatbot-kit'
import { ReactComponent as ButtonIcon } from "../../../assets/icons/robot.svg";

const Home = () => {
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const [firstRender, setFirstRender] = useState(true);
    const [firstRender2, setFirstRender2] = useState(true);
    const [firstRender3, setFirstRender3] = useState(true);
    const [employeeId, setEmployeeId] = useState()
    const [notifs, setNotifs] = useState()
    const [loading, setLoading] = useState(true)
    const database = getFirestore()
    const [showChatbot, toggleChatbot] = useState(false);
    const [role, setRole] = useState()


    useEffect(async () => {


        setEmployeeId(user.data.uid)

    }, [user]);

    useEffect(async () => {
        console.log('USER ID : ' + employeeId)
        if (firstRender) {
            setFirstRender(false);
            return;
        }

        const f = query(collection(database, "notifs"), where("receiver", "==", employeeId));
        await getDocs(f).then((notif) => {
            let notifData = notif.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            const sortedData = notifData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setNotifs(sortedData)
        }).catch((err) => {
            console.log(err);
        })

    }, [employeeId]);

    useEffect(async () => {
        if (firstRender2) {
            setFirstRender2(false);
            return;
        }

        console.log('notifs ' + notifs)
        setLoading(false)
    }, [notifs]);

    useEffect(async () => {
        if (user) {
            const s = query(collection(database, "users"), where("email", "==", user.data.uid));
            const querySnapshot = await getDocs(s);
            querySnapshot.forEach((doc) => {
                setRole(doc.data().role)
            });
        }
    }, [])



    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>
        )

    } else {
        return (
            <>
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
                {role && (
                    <>
                        {role == 'Requestor' && (
                            <button
                                className="app-chatbot-button"
                                onClick={() => toggleChatbot((prev) => !prev)}
                            >
                                <ButtonIcon className="app-chatbot-button-icon" />
                            </button>
                        )}
                    </>

                )}


                <div className='head' style={{ padding: '20px', maxWidth: '70%', margin: 'auto', backgroundColor: '#FFFFFF', borderStyle: 'solid', borderTop: '0px', borderColor: '#959595', borderWidth: '2px' }}>
                    <h2>Notifications</h2>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Content</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            {notifs && (
                                <tbody>

                                    {notifs.map(notif => (
                                        <tr key={notif.id}>
                                            <td>{notif.title}</td>
                                            <td>{notif.content}</td>
                                            <td>{notif.date.toDate().toDateString()}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            )}

                        </Table>
                    </div>
                </div>
            </>


        )
    }

}

export default Home

