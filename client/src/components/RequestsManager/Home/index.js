
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";


import jsPDF from 'jspdf';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import autoTable from 'jspdf-autotable';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import RequestTasks from '../RequestTasks';
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';
import { createNotifs } from '../../../redux/notifs/createNotif';
import { Dispatch } from 'react';
import moment from 'moment';
import { autoAssign } from '../../../redux/workload/autoAssign';
import { toast } from 'react-toastify';

const Home = () => {
    const [autoEmployee, setAutoEmployee] = useState()
    const [autoEmployeeID, setAutoEmployeeID] = useState()
    const [requestsPending, setRequestsPending] = useState([])
    const [requestsDone, setRequestsDone] = useState([])
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState()
    const [employee, setEmployee] = useState()
    const database = getFirestore()
    const [employees, setEmployees] = useState([])
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [isChecked, setIsChecked] = useState(false);

    const assignEmployee = (request) => {
        setRequest(request)
        setShow(true)
    }
    const assignEmployeeToTask = async (e) => {
        toast.info('Assigning Employee. Please wait..')

        e.preventDefault();

        const requestRef = doc(database, "requests", request.id);
        const requestSnap = await getDoc(requestRef);

        if (!isChecked) {
            const q = query(collection(database, "users"), where("name", "==", employee));

            let employeeEmail
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc1) => {
                employeeEmail = doc1.data().email
                const washingtonRef = doc(database, "users", doc1.id);

                //Workload
                await updateDoc(washingtonRef, {
                    tasks: doc1.data().tasks + 1
                })
            });


            await updateDoc(requestRef, {
                submitter: employee,
                submitterEmail: employeeEmail,
                status: 'for submission',
                assignTo: employeeEmail
            }).then(() => {
                dispatch(createNotifs({
                    title: 'REQUEST ASSIGNED: ' + request.desc,
                    message: 'A request was submitted by ' + request.identifier + '. Please check the Requests Manager page to submit the request',
                    receiverID: employeeEmail,
                    link: 'requestsmanager'
                }))
                toast.success('Done Assigning Employee')
            })
        } else {
            console.log('Checked')
            let employeeAuto
            let employeeAutoEmail



            const employeeSnapshot = await getDoc(doc(database, 'users', autoEmployeeID));

            employeeAuto = employeeSnapshot.data().name
            employeeAutoEmail = employeeSnapshot.data().email
            const washingtonRef = doc(database, "users", autoEmployeeID);
            //Workload
            await updateDoc(washingtonRef, {
                tasks: employeeSnapshot.data().tasks + 1
            });

            const taskRef = doc(collection(database, "tasks"));
            await updateDoc(requestRef, {
                submitter: employeeAuto,
                submitterEmail: employeeAutoEmail,
                status: 'for submission',
                assignTo: employeeAutoEmail
            }).then(() => {
                dispatch(createNotifs({
                    title: 'REQUEST ASSIGNED: ' + request.desc,
                    message: 'A request was submitted by ' + request.identifier + '. Please check the Requests Manager page to submit the request',
                    receiverID: employeeAutoEmail,
                    link: 'requestsmanager'
                }))
                toast.info('Done Assigning Employee')
            })
        }

    }

    const handleReport = (id) => {
        const doc = new jsPDF({ orientation: "landscape" });

        doc.autoTable({
            html: id,
        });

        doc.save("mypdf.pdf");
    }

    useEffect(async () => {
        const q = query(collection(database, "requests"), where('status', '==', 'done'));
        const f = query(collection(database, "requests"), where('status', '!=', 'done'));

        await getDocs(q).then((request) => {
            let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequestsDone(requestsData)
        }).catch((err) => {
            console.log(err);
        })

        await getDocs(f).then((request) => {
            let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequestsPending(requestsData)
            setLoading(false)
        }).catch((err) => {
            console.log(err);
        })

        const getEmployees = async () => {
            const q = query(collection(database, "users"), where('role', '==', 'Employee'))
            await getDocs(q).then((user) => {
                let userData = user.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setEmployees(userData)
            }).catch((err) => {
                console.log(err);
            })

        }
        getEmployees()


    }, []);


    const autoAssignThis = (e) => {
        setIsChecked(e)
        const employee = dispatch(autoAssign({}))
        employee.then(async (employeeId) => {
            const employeeRef = await getDoc(doc(database, 'users', employeeId))
            setAutoEmployeeID(employeeRef.id)
            setAutoEmployee(employeeRef.data().name)
        })
    }
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
                    <h2 >Requests </h2>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>
                        <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Pending Requests</h5>
                        <RequestTasks></RequestTasks>
                        <p></p><p></p>
                        <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Requests Manager</h5>
                        <Tabs
                            defaultActiveKey="pending"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="pending" title="Pending" >
                                <Button onClick={() => handleReport('#table-pending')}>Get Report</Button>
                                <p></p>
                                <Table id='table-pending' striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Reference</th>
                                            <th>Project</th>
                                            <th>Query</th>
                                            <th>Date Requested</th>
                                            <th>Deadline</th>
                                            <th>Assigned to </th>
                                            <th>Status </th>
                                          
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestsPending.map(request => (
                                            <tr key={request.id}>
                                                <td>{request.identifier}</td>
                                                <td>{request.project}</td>
                                                {request.url ? (
                                                    <td><a href={request.url} target='_blank'>{request.desc}</a></td>
                                                ) : (
                                                    <td>{request.desc}</td>
                                                )}


                                                <td>{moment(request.date.toDate()).format('l')}</td>
                                                <td>{moment(request.deadline.toDate()).format('l')}</td>
                                                {request.submitter === '' ?
                                                    <td><Button size='sm' onClick={() => assignEmployee(request)}>Assign Employee</Button></td>
                                                    :
                                                    <td>{request.submitter}</td>
                                                }

                                                {request.status != 'done' ? (
                                                    <td style={{ backgroundColor: 'red', color: 'white' }}>Pending</td>
                                                ) : (
                                                    <td style={{ backgroundColor: 'green', color: 'white' }}>Completed</td>
                                                )}


                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                            </Tab>
                            <Tab eventKey="completed" title="Completed" >
                                <Button onClick={() => handleReport('#table-completed')}>Get Report</Button>
                                <p></p>
                                <Table id='table-completed' striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Reference</th>
                                            <th>Description</th>
                                            <th>Deadline</th>
                                            <th>Date Requested</th>
                                            <th>Date Responded</th>

                                            <th>Assigned to </th>
                                            <th>Status </th>
              
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestsDone.map(request => (
                                            <tr key={request.id}>
                                                <td>{request.identifier}</td>
                                                <td>{request.project}</td>
                                                {request.url ? (
                                                    <td><a target='_blank' href={request.url}>{request.desc}</a></td>
                                                ) : (
                                                    <td>{request.desc}</td>
                                                )}


                                                <td>{moment(request.date.toDate()).format('l')}</td>
                                                <td>{moment(request.deadline.toDate()).format('l')}</td>
                                                {request.submitter === '' ?
                                                    <td><Button size='sm' onClick={() => assignEmployee(request)}>Assign Employee</Button></td>
                                                    :
                                                    <td>{request.submitter}</td>
                                                }
                                                {request.status != 'done' ? (
                                                    <td style={{ backgroundColor: 'red', color: 'white' }}>Pending</td>
                                                ) : (
                                                    <td style={{ backgroundColor: 'green', color: 'white' }}>Completed</td>
                                                )}


                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                            </Tab>

                        </Tabs>

                    </div>
                </div >


                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Assign Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={assignEmployeeToTask}>

                            {request && (
                                <Form.Label>Assign to {request.identifier}</Form.Label>
                            )}


                            <Form.Select required disabled={isChecked} style={{ opacity: isChecked ? 0.5 : 1 }} onChange={(e) => setEmployee(e.target.value)} aria-label="Default select example">
                                <option value="" disabled selected>Select Employee</option>
                                {employees.map((user, index) => (
                                    <option key={index} value={user.name}>{user.name} (Tasks: {user.tasks})</option>
                                ))}

                            </Form.Select>
                            {!autoEmployee && isChecked && (
                                <Form.Label>Assigning Employee. Please Wait.</Form.Label>
                            )}
                            {autoEmployee && isChecked && (
                                <Form.Label>Auto Assigned: {autoEmployee}</Form.Label>
                            )}
                            <Form.Check
                                label='Automatically Assign Employee?'
                                checked={isChecked}
                                onChange={(e) => autoAssignThis(e.target.checked)}

                            />

                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose}>Close</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>


        )
    }
}

export default Home

