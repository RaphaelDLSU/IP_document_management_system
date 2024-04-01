
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { registerUser } from '../../../redux/actionCreators/authActionCreators';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from 'react-bootstrap/Spinner';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import '../../../App.css'
import moment from 'moment'
import '../../../botstyle.css'
import MessageParser from "../../../chatbotkit/MessageParser.js";
import ActionProvider from "../../../chatbotkit/ActionProvider.js";
import config from "../../../chatbotkit/config.js";
import '../../../botstyle.css';
import { ConditionallyRender } from "react-util-kit";
import { Chatbot } from 'react-chatbot-kit'
import { ReactComponent as ButtonIcon } from "../../../assets/icons/robot.svg";
const Home = () => {

    const [error, setError] = useState("");
    const [role, setRole] = useState()
    const [tasks, setTasks] = useState([])
    const [requests, setRequests] = useState([])
    const [showChatbot, toggleChatbot] = useState(false);
    const [loading, setLoading] = useState(true)
    const database = getFirestore()
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user
        }),
        shallowEqual
    );



    useEffect(async () => {
        if (user) {
            const s = query(collection(database, "users"), where("email", "==", user.data.uid));
            const querySnapshot = await getDocs(s);
            querySnapshot.forEach((doc) => {
                setRole(doc.data().role)
            });

            const q = query(collection(database, "tasks"), where('requestor', '==', user.data.uid));

            const f = query(collection(database, 'requests'), where('nameEmail', '==', user.data.uid))

            const something = async () => {
                await getDocs(q).then(async (task) => {
                    let taskData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    setTasks(taskData)
                    await getDocs(f).then((request) => {
                        let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                        setRequests(requestsData)
                    })
                }).then(() => {
                    setLoading(false)
                }).catch((err) => {
                    console.log(err);
                })

            }

            something()
        }

    }, []);


    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>
        );
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
                {role == 'Requestor' && (
                    <button
                        className="app-chatbot-button"
                        onClick={() => toggleChatbot((prev) => !prev)}
                    >
                        <ButtonIcon className="app-chatbot-button-icon" />
                    </button>
                )}


                <div className='head' style={{ padding: '20px' }}>
                    <h2>Requests</h2>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>


                        <Tabs
                            defaultActiveKey="tasks"
                            id="justify-tab-example"
                            className="mb-3"
                        >

                            <Tab eventKey="tasks" title="Tasks" id='table-tasks'>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Requirements</th>
                                            <th>Date Created</th>
                                            <th>Deadline</th>
                                            <th>Assigned To</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(task => (
                                            <tr key={task.id}>
                                                <td>{task.task}</td>
                                                {task.requirements ? (
                                                    <td> {task.requirements.map((req, index) => (
                                                        <>
                                                            {req.url ? (
                                                                <a target='_blank' href={req.url}>{req.value}</a>
                                                            ) : (
                                                                <>
                                                                    {req.value}
                                                                </>
                                                            )}

                                                            {index !== task.requirements.length - 1 && ', '}
                                                        </>
                                                    ))}</td>
                                                ) : (<td>None</td>)}
                                                   <td>{moment(task.timestamp.toDate()).format('l')}</td>
                                                   <td>{moment(task.deadline.toDate()).format('l')}</td>
                                                   <td>{task.employee}</td>


                                                {task.status != 'done' ? (
                                                    <td style={{ backgroundColor: 'red',color:'white'}}>Pending</td>
                                                ) : (
                                                    <td style={{ backgroundColor: 'green',color:'white' }}> Done</td>
                                                )}

                                            </tr>
                                        ))}

                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="profile" title="Requests" id='table-requests'>

                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Description</th>
                                            <th>Date Created</th>
                                            <th>Deadline</th>
                                            <th>Assigned To</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map(request => (
                                            <tr key={request.id}>
                                                <td>{request.project}</td>
                                                <td>{request.desc}</td>
                                                <td>{moment(request.date.toDate()).format('l')}</td>
                                                <td>{moment(request.deadline.toDate()).format('l')}</td>
                                                <td>{request.submitter}</td>
                                                {request.status != 'done' ? (
                                                    <td style={{ backgroundColor: '#d42b39' }}>Pending</td>
                                                ) : (
                                                    <td style={{ backgroundColor: '#146C43' }}>Done</td>
                                                )}
                                                <td><a target="_blank" href={request.url}> View </a></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>

                    </div>
                </div>

                {/* <Modal show={show} onHide={() => setShow(false)}>


                    {registration && (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>Registration: &nbsp;{registration.name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <a target="_blank" href={registration.url}>View I.D</a>
                            </Modal.Body>
                        </>

                    )}
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={approveRegistration}>
                            Approve
                        </Button>
                        <Button variant="danger" onClick={disapproveRegistration}>
                            Disapprove
                        </Button>
                    </Modal.Footer>
                </Modal> */}
            </>


        )
    }

}

export default Home

