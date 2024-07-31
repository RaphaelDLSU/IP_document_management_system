import logo from '../../../assets/img/SolidBuild.jpg';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Table } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Badge from 'react-bootstrap/Badge';

import { limit, where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import Button from 'react-bootstrap/Button';
import { createNotifs } from '../../../redux/notifs/createNotif';
import Modal from 'react-bootstrap/Modal';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TaskRequirement from '../../../chatbotkit/components/TaskRequirement';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const CEOHome = () => {
    const [notifs, setNotifs] = useState()
    const [newNotifs, setNewNotifs] = useState([])
    const [show, setShow] = useState(false);

    const database = getFirestore()
    const dispatch = useDispatch()
    const [tasks, setTasks] = useState([])
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );
    const history = useHistory();
    useEffect(async () => {
        if (user) {
            const f = query(collection(database, "notifs"), where("receiver", "==", user.data.uid), orderBy("date", 'desc'), limit(5));
            await getDocs(f).then((notif) => {
                let notifData = notif.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setNotifs(notifData)
            }).catch((err) => {
                console.log(err);
            })

            const q = query(collection(database, "tasks"), where('employeeId', '==', user.data.uid), where("status", '!=', 'done'));

            const fs = query(collection(database, 'requests'), where('assignTo', '==', user.data.uid), where("status", '!=', 'done'))

            const something = async () => {
                await getDocs(q).then(async (task) => {
                    let taskData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    setTasks(taskData)
                    await getDocs(fs).then((request) => {
                        let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                        setRequests(requestsData)
                    }).then(() => {

                    })
                }).then(() => {
                    setLoading(false)
                }).catch((err) => {
                    console.log(err);
                })
            }

            something()

            const d = query(collection(database, "notifs"), where("isChecked", "==", false), where("receiver", '==', user.data.uid));

            const querySnapshot = await getDocs(d);

            if (!querySnapshot.empty) {
                let notifsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setNewNotifs(notifsData)
                console.log('NOT EMPTY. SHOWING MODAL')
                setShow(true)

                querySnapshot.forEach(async (doc1) => {
                    const notifRef = doc(database, "notifs", doc1.id);
                    await updateDoc(notifRef, {
                        isChecked: true
                    });
                });
            }


        }
    }, [user]);

    useEffect(async () => {
    }, [notifs]);

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">System Guide</Popover.Header>
            <Popover.Body>
                <strong>Home</strong><p></p>
                Click on a listed notification or task/request to go to the appropriate page <p></p>
                <strong>Workflows</strong><p></p>
                View ongoing project workflows/processes <p></p>
                <strong>Requests Manager</strong><p></p>
                View ongoing/completed requests from outside the department <p></p>
                <strong>Tasks</strong><p></p>
                View ongoing/completed tasks <p></p>
                <strong>Files</strong><p></p>
                View Files stored in the system <p></p>
                <strong>Employees</strong><p></p>
                View Employees and their tasks <p></p>
                <strong>Notifications</strong><p></p>
                View Employees and their tasks <p></p>
                <strong>Document Creation</strong><p></p>
                View document creation of technical documents <p></p>
            </Popover.Body>
        </Popover>
    );
    const Example = () => (
        <h2>
        Home &nbsp;
        <OverlayTrigger placement="right" overlay={popover}>
            <Button variant="success">Get Started</Button>
        </OverlayTrigger>
        </h2>
    );

    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>
        )
    }
    else {
        return (
            <>
                <div style={{ maxWidth: '70%', height: '170px', backgroundColor: '#FAFAFC', margin: 'auto', borderStyle: 'solid', borderBottom: '0px', borderTop: '0px', borderColor: '#959595', borderWidth: '2px'}}>
                    <img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%', maxHeight: '100%'}} src={logo} />
                </div>
                <Container style={{ maxWidth: '70%', padding: '30px', backgroundColor: '#FFFFFF', borderStyle: 'solid', borderColor: '#959595', borderWidth: '2px' }}>
                    <Example />
                    <p></p>
                    <hr></hr>
                    <Row >
                        <Col>

                            <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Notifications</h5>

                            <ListGroup>
                                {notifs ? (
                                    <>
                                        {notifs.map(notif => (
                                            <ListGroup.Item action onClick={() => history.push(notif.link)}
                                                className="d-flex justify-content-between align-items-start"
                                            >
                                                <div className="ms-2 me-auto">
                                                    <div>{notif.title}</div>
                                                </div>
                                                <Badge bg="primary" pill>
                                                    {moment(notif.date.toDate()).format('LLL')}
                                                </Badge>
                                            </ListGroup.Item>

                                        ))}
                                    </>
                                ) : (
                                    <> None </>
                                )}

                            </ListGroup>


                        </Col>
                        <Col>
                            <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Pending Tasks/Approvals</h5>

                            <Tabs
                                defaultActiveKey="tasks"
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="tasks" title="Tasks">
                                    <ListGroup >
                                        {tasks ? (
                                            <>
                                                {tasks.map(task => (
                                                    <ListGroup.Item action variant={task.deadline.toDate() < new Date() ? "danger" : ''} onClick={() => history.push('/tasks')}
                                                        className="d-flex justify-content-between align-items-start"
                                                    >
                                                        <div className="ms-2 me-auto">
                                                            <div>{task.task}: {task.requirements[0].value}</div>
                                                        </div>
                                                        <Badge bg="primary" pill>
                                                            {moment(task.deadline.toDate()).format('LLL')}
                                                        </Badge>
                                                    </ListGroup.Item>
                                                ))}
                                            </>
                                        ) : (
                                            <> None </>
                                        )}


                                    </ListGroup>
                                </Tab>
                                <Tab eventKey="requests" title="RFA/RFI">
                                    <ListGroup >
                                        {requests ? (
                                            <>
                                                {requests.map(request => (
                                                    <ListGroup.Item action variant={request.deadline.toDate() < new Date() ? "danger" : ''} onClick={() => history.push('/requestsmanager')}
                                                        className="d-flex justify-content-between align-items-start"
                                                    >
                                                        <div className="ms-2 me-auto">
                                                            <div>{request.desc}</div>
                                                        </div>
                                                        <Badge bg="primary" pill>
                                                            {moment(request.deadline.toDate()).format('LLL')}
                                                        </Badge>
                                                    </ListGroup.Item>
                                                ))}
                                            </>
                                        ) : (
                                            <> None </>
                                        )}


                                    </ListGroup>
                                </Tab>
                            </Tabs>

                        </Col>
                    </Row>
                </Container>

                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Welcome Back!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>While you were away, here are some activity that needs your attention


                    </Modal.Body>
                    <Modal.Body>

                        <ListGroup>
                            {newNotifs ? (
                                <>
                                    {newNotifs.some(notif => notif.link === "/workflows") && <div>Workflows</div>}
                                    {newNotifs
                                        .filter(notif => notif.link === "/workflows")
                                        .map(notif => (
                                            <ListGroup.Item
                                                action
                                                onClick={() => history.push(notif.link)}
                                                className="d-flex justify-content-between align-items-start"
                                            >
                                                <div className="ms-2 me-auto">
                                                    <div>{notif.title}</div>
                                                </div>
                                                <Badge bg="primary" pill>
                                                    {moment(notif.date.toDate()).format('LLL')}
                                                </Badge>
                                            </ListGroup.Item>
                                        ))
                                    }
                                </>
                            ) : (
                                <>None</>
                            )}
                        </ListGroup>


                        <ListGroup>
                            {newNotifs ? (
                                <>
                                    {newNotifs.some(notif => notif.link === "/tasks") && <div>Tasks</div>}
                                    {newNotifs
                                        .filter(notif => notif.link === "/tasks")
                                        .map(notif => (
                                            <ListGroup.Item
                                                action
                                                onClick={() => history.push(notif.link)}
                                                className="d-flex justify-content-between align-items-start"
                                            >
                                                <div className="ms-2 me-auto">
                                                    <div>{notif.title}</div>
                                                </div>
                                                <Badge bg="primary" pill>
                                                    {moment(notif.date.toDate()).format('LLL')}
                                                </Badge>
                                            </ListGroup.Item>
                                        ))
                                    }
                                </>
                            ) : (
                                <>None</>
                            )}
                        </ListGroup>


                        <ListGroup>
                            {newNotifs ? (
                                <>
                                    {newNotifs.some(notif => notif.link === "/requestsmanager") && <div>Requests</div>}
                                    {newNotifs
                                        .filter(notif => notif.link === "/requestsmanager")
                                        .map(notif => (
                                            <ListGroup.Item
                                                action
                                                onClick={() => history.push(notif.link)}
                                                className="d-flex justify-content-between align-items-start"
                                            >
                                                <div className="ms-2 me-auto">
                                                    <div>{notif.title}</div>
                                                </div>
                                                <Badge bg="primary" pill>
                                                    {moment(notif.date.toDate()).format('LLL')}
                                                </Badge>
                                            </ListGroup.Item>
                                        ))
                                    }
                                </>
                            ) : (
                                <>None</>
                            )}
                        </ListGroup>
                    </Modal.Body>

                </Modal>
            </>
        )
    }

};

export default CEOHome;
