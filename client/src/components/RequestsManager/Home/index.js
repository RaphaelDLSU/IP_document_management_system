
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";


import jsPDF from 'jspdf';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    const [users, setUsers] = useState([]);

    const [requestsCompletedInit, setRequestsCompletedInit] = useState();
    const [requestsPendingInit, setRequestsPendingInit] = useState();
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
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );
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
                    message: 'A request was submitted by ' + request.name + '. Please check the Requests Manager page to submit the request',
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
                    message: 'A request was submitted by ' + request.name + '. Please check the Requests Manager page to submit the request',
                    receiverID: employeeAutoEmail,
                    link: 'requestsmanager'
                }))
                toast.info('Done Assigning Employee')
            })
        }

    }
    const usersRef = collection(database, "users");

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
            setRequestsPendingInit(requestsData)
            setRequestsDone(requestsData)
        }).catch((err) => {
            console.log(err);
        })

        await getDocs(f).then((request) => {
            let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequestsCompletedInit(requestsData)
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

        const getUsers = async () => {
            // const q = query(collectionRef, orderBy('task', 'asc'))
            const q = query(usersRef)
            await getDocs(q).then((users) => {
                let usersData = users.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setUsers(usersData)
            }).catch((err) => {
                console.log(err);
            })
        }
        getUsers()


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

    const resetFilterPending = () => {
        setRequestsPending(requestsPendingInit)
    }
    const sortFilterPending = (sort) => {

        if (sort == 'End Date Descending') {

            const filter = requestsPending.sort((a, b) => b.deadline - a.deadline)
            setRequestsPending([...filter])
        } else if (sort == 'End Date Ascending') {

            const filter = requestsPending.sort((a, b) => a.deadline - b.deadline)
            setRequestsPending([...filter])
        }
        else if (sort == 'Start Date Ascending') {

            const filter = requestsPending.sort((a, b) => a.date - b.date)
            setRequestsPending([...filter])
        }
        else if (sort == 'Start Date Descending') {

            const filter = requestsPending.sort((a, b) => b.date - a.date)
            setRequestsPending([...filter])
        }
    }

    const filterTaskPending = (filter) => {

        const filteredTasks = requestsPending.filter(data => data.desc.includes(filter))

        setRequestsPending(filteredTasks)

    }

    const filterEmployeePending = (filter) => {

        const filteredTasks = requestsPending.filter(data => data.submitter.includes(filter))

        setRequestsPending(filteredTasks)

    }
    const filterStartPending = (filter) => {
        if (filter == '1 week') {
            const seventhDay = new Date();
            seventhDay.setDate(seventhDay.getDate() - 7);

            const filteredData = requestsPending.filter((d) => {
                return d.date.toDate().getTime() >= seventhDay.getTime();
            });

            setRequestsPending(filteredData)
        } else if (filter == '1 month') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const filteredData = requestsPending.filter((d) => {
                return d.date.toDate().getTime() >= thirtyDaysAgo.getTime();
            });

            setRequestsPending(filteredData)
        } else if (filter == '3 months') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const filteredData = requestsPending.filter((d) => {
                return d.date.toDate().getTime() >= threeMonthsAgo.getTime();
            });

            setRequestsPending(filteredData)
        }
    }
    const filterEndPending = (filter) => {

        if (filter == '1 week') {
            const seventhDay = new Date();
            seventhDay.setDate(seventhDay.getDate() - 7);

            const filteredData = requestsPending.filter((d) => {
                return d.deadline.toDate().getTime() >= seventhDay.getTime();
            });

            setRequestsPending(filteredData)
        } else if (filter == '1 month') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const filteredData = requestsPending.filter((d) => {
                return d.deadline.toDate().getTime() >= thirtyDaysAgo.getTime();
            });

            setRequestsPending(filteredData)
        } else if (filter == '3 months') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const filteredData = requestsPending.filter((d) => {
                return d.deadline.toDate().getTime() >= threeMonthsAgo.getTime();
            });

            setRequestsPending(filteredData)
        }

    }

    const resetFilterCompleted = () => {
        setRequestsDone(requestsCompletedInit)
    }
    const sortFilterCompleted = (sort) => {

        if (sort == 'End Date Descending') {

            const filter = requestsDone.sort((a, b) => b.deadline - a.deadline)
            setRequestsDone([...filter])
        } else if (sort == 'End Date Ascending') {

            const filter = requestsDone.sort((a, b) => a.deadline - b.deadline)
            setRequestsDone([...filter])
        }
        else if (sort == 'Start Date Ascending') {

            const filter = requestsDone.sort((a, b) => a.date - b.date)
            setRequestsDone([...filter])
        }
        else if (sort == 'Start Date Descending') {

            const filter = requestsDone.sort((a, b) => b.date - a.date)
            setRequestsDone([...filter])
        }

    }

    const filterTaskCompleted = (filter) => {

        const filteredTasks = requestsDone.filter(data => data.desc.includes(filter))

        setRequestsDone(filteredTasks)

    }

    const filterEmployeeCompleted = (filter) => {

        const filteredTasks = requestsDone.filter(data => data.submitter.includes(filter))

        setRequestsDone(filteredTasks)

    }
    const filterStartCompleted = (filter) => {
        if (filter == '1 week') {
            const seventhDay = new Date();
            seventhDay.setDate(seventhDay.getDate() - 7);

            const filteredData = requestsDone.filter((d) => {
                return d.date.toDate().getTime() >= seventhDay.getTime();
            });


            setRequestsDone(filteredData)
        } else if (filter == '1 month') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const filteredData = requestsDone.filter((d) => {
                return d.date.toDate().getTime() >= thirtyDaysAgo.getTime();
            });

            setRequestsDone(filteredData)
        } else if (filter == '3 months') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const filteredData = setRequestsDone.filter((d) => {
                return d.date.toDate().getTime() >= threeMonthsAgo.getTime();
            });

            setRequestsDone(filteredData)
        }
    }
    const filterEndCompleted = (filter) => {

        if (filter == '1 week') {
            const seventhDay = new Date();
            seventhDay.setDate(seventhDay.getDate() - 7);

            const filteredData = requestsDone.filter((d) => {
                return d.deadline.toDate().getTime() >= seventhDay.getTime();
            });

            setRequestsDone(filteredData)
        } else if (filter == '1 month') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const filteredData = requestsDone.filter((d) => {
                return d.deadline.toDate().getTime() >= thirtyDaysAgo.getTime();
            });

            setRequestsDone(filteredData)
        } else if (filter == '3 months') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const filteredData = requestsDone.filter((d) => {
                return d.deadline.toDate().getTime() >= threeMonthsAgo.getTime();
            });

            setRequestsDone(filteredData)
        }

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
                                <Container style={{ maxWidth: "100%" }}>
                                    <Row xs="auto">
                                        <Col>
                                            <Button onClick={() => handleReport('#table-pending')}>Get Report</Button>
                                        </Col>
                                        <Col>
                                            <Form.Select placeholder='Sort By' onChange={(e) => sortFilterPending(e.target.value)}>
                                                <option value="" hidden>Sort By</option>
                                                <option value="End Date Descending"> End Date Descending</option>
                                                <option value="End Date Ascending"> End Date Ascending</option>
                                                <option value="Start Date Ascending"> Start Date Ascending</option>
                                                <option value="Start Date Descending"> Start Date Descending</option>

                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                onChange={(e) => filterTaskPending(e.target.value)}
                                                placeholder='Filter by Query'
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Select onChange={(e) => filterEmployeePending(e.target.value)}>
                                                <option value="" hidden>Sort By Employee</option>
                                                {users.map((user, index) => (
                                                    <>

                                                        <option>{user.name}</option>

                                                    </>

                                                ))}
                                            </Form.Select>

                                        </Col>
                                        <Col>
                                            <Form.Select onChange={(e) => filterStartPending(e.target.value)}>
                                                <option value="" hidden>Filter Date Requested</option>
                                                <option value='1 week'>1 week</option>
                                                <option value='1 month'>1 Month</option>
                                                <option value='3 months'>3 Months</option>

                                            </Form.Select>

                                        </Col>
                                        <Col>
                                            <Form.Select onChange={(e) => filterEndPending(e.target.value)}>
                                                <option value="" hidden>Filter Deadline</option>
                                                <option value='1 week'>1 week</option>
                                                <option value='1 month'>1 Month</option>
                                                <option value='3 months'>3 Months</option>

                                            </Form.Select>

                                        </Col>
                                        <Col>
                                            <Button onClick={resetFilterPending}>Reset</Button>
                                        </Col>
                                    </Row>
                                </Container>
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
                                                <td style={{ color: request.deadline.toDate() < new Date() ? 'red' : 'black' }}>{request.identifier}</td>
                                                <td style={{ color: request.deadline.toDate() < new Date() ? 'red' : 'black' }}>{request.project}</td>
                                                {request.url ? (
                                                    <td style={{ color: request.deadline.toDate() < new Date() ? 'red' : 'black' }}><a href={request.url} target='_blank'>{request.desc}</a></td>
                                                ) : (
                                                    <td style={{ color: request.deadline.toDate() < new Date() ? 'red' : 'black' }}>{request.desc}</td>
                                                )}


                                                <td style={{ color: request.deadline.toDate() < new Date() ? 'red' : 'black' }}>{moment(request.date.toDate()).format('l')}</td>
                                                <td style={{ color: request.deadline.toDate() < new Date() ? 'red' : 'black' }}>{moment(request.deadline.toDate()).format('l')}</td>
                                                {request.submitter === '' ? (
                                                    <>
                                                        {user.data.uid === 'manager@gmail.com' ? (
                                                            <td><Button size='sm' onClick={() => assignEmployee(request)}>Assign Employee</Button></td>

                                                        ):(<td> *To be Assigned*</td>)}
                                                    </>
                                                )
                                                    : (
                                                        <td>{request.submitter}</td>
                                                    )
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
                                <Container style={{ maxWidth: "100%" }}>
                                    <Row xs="auto">
                                        <Col>
                                            <Button onClick={() => handleReport('#table-completed')}>Get Report</Button>
                                        </Col>
                                        <Col>
                                            <Form.Select placeholder='Sort By' onChange={(e) => sortFilterCompleted(e.target.value)}>
                                                <option value="" hidden>Sort By</option>
                                                <option value="End Date Descending"> End Date Descending</option>
                                                <option value="End Date Ascending"> End Date Ascending</option>
                                                <option value="Start Date Ascending"> Start Date Ascending</option>
                                                <option value="Start Date Descending"> Start Date Descending</option>
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                onChange={(e) => filterTaskCompleted(e.target.value)}
                                                placeholder='Filter by Query'
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Select onChange={(e) => filterEmployeeCompleted(e.target.value)}>
                                                <option value="" hidden>Sort By Employee</option>
                                                {users.map((user, index) => (
                                                    <>

                                                        <option>{user.name}</option>

                                                    </>

                                                ))}
                                            </Form.Select>

                                        </Col>
                                        <Col>
                                            <Form.Select onChange={(e) => filterStartCompleted(e.target.value)}>
                                                <option value="" hidden>Filter Date Requested</option>
                                                <option value='1 week'>1 week</option>
                                                <option value='1 month'>1 Month</option>
                                                <option value='3 months'>3 Months</option>

                                            </Form.Select>

                                        </Col>
                                        <Col>
                                            <Form.Select onChange={(e) => filterEndCompleted(e.target.value)}>
                                                <option value="" hidden>Filter Deadline</option>
                                                <option value='1 week'>1 week</option>
                                                <option value='1 month'>1 Month</option>
                                                <option value='3 months'>3 Months</option>

                                            </Form.Select>

                                        </Col>
                                        <Col>
                                            <Button onClick={resetFilterCompleted}>Reset</Button>
                                        </Col>
                                    </Row>
                                </Container>
                                <p></p>
                                <Table id='table-completed' striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Reference</th>
                                            <th>Project</th>
                                            <th>Query</th>
                                            <th>Date Requested</th>
                                            <th>Deadline</th>
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
                                                <td>{moment(request.completion.toDate()).format('l')}</td>
                                                {request.submitter === '' ? (
                                                    <>
                                                        {user.data.uid === 'manager@gmail.com' && (
                                                            <td><Button size='sm' onClick={() => assignEmployee(request)}>Assign Employee</Button></td>

                                                        )}
                                                    </>
                                                )
                                                    : (
                                                        <td>{request.submitter}</td>
                                                    )
                                                }
                                                {request.status != 'done' ? (
                                                    <td style={{ backgroundColor: 'red', color: 'white' }}>Pending</td>
                                                ) : (
                                                    <>
                                                        {request.completion > request.deadline && (
                                                            <td style={{ backgroundColor: 'yellow', color: 'black' }}>Completed (Late)</td>
                                                        )}
                                                        {request.completion < request.deadline && (
                                                            <td style={{ backgroundColor: 'green', color: 'white' }}>Completed</td>
                                                        )}
                                                    </>

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

