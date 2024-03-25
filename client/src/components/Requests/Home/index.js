
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

const Home = () => {

    const [error, setError] = useState("");
    const [tasks, setTasks] = useState([])
    const [requests, setRequests] = useState([])

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
   


    useEffect(() => {
        if (user) {
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
                <div className='head' style={{ padding: '20px' }}>
                    <h2>Requests</h2>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>


                        <Tabs
                            defaultActiveKey="tasks"
                            id="justify-tab-example"
                            className="mb-3"
                        >

                            <Tab eventKey="home" title="Tasks" id='table-tasks'>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Requirements</th>
                                            <th>Date Created</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(task => (
                                            <tr key={task.id}>
                                                <td>{task.task}</td>
                                                {task.requirements ? (
                                                    <td> {task.requirements.map((req, index) => (

                                                        <span key={index}>
                                                            {req.value}
                                                            {index !== req.length - 1 && ', '}
                                                        </span>
                                                    ))}</td>
                                                ) : (<td>None</td>)}
                                                <td>{task.timestamp.toDate().toDateString()}</td>


                                                {task.status != 'done' ? (
                                                    <td style={{ backgroundColor: '#d42b39' }}>Pending</td>
                                                ) : (
                                                    <td style={{ backgroundColor: '#146C43' }}> Done</td>
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
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map(request => (
                                            <tr key={request.id}>
                                                <td>{request.project}</td>
                                                <td>{request.desc}</td>
                                                <td>{request.date.toDate().toDateString()}</td>
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

