
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

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TaskRequirement from '../../../chatbotkit/components/TaskRequirement';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const RequestorHome = () => {
  const history = useHistory()
  const [notifs, setNotifs] = useState()
  const database = getFirestore()
  const [role, setRole] = useState()
  const dispatch = useDispatch()
  const [tasks, setTasks] = useState([])
  const [requests, setRequests] = useState([])

  const [firstRender, setFirstRender] = useState(true);
  const [firstRender2, setFirstRender2] = useState(true);
  const [loading, setLoading] = useState(true)
  const { isLoggedIn, user, userId } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
      userId: state.auth.userId,
    }),
    shallowEqual
  );

  const handleNotif = () => {
    dispatch(createNotifs({
      title: "eat my ass",
      message: 'Hello',
      receiverID: user.data.uid,
      link: 'requests'
    }))
  }

  useEffect(async () => {
    if (user) {
      const f = query(collection(database, "notifs"), where("receiver", "==", user.data.uid), orderBy("date", 'desc'), limit(5));
      await getDocs(f).then((notif) => {
        let notifData = notif.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setNotifs(notifData)
      }).catch((err) => {
        console.log(err);
      })

      const q = query(collection(database, "tasks"), where('requestor', '==', user.data.uid));

      const fs = query(collection(database, 'requests'), where('nameEmail', '==', user.data.uid))

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
    }
  }, [user]);

  useEffect(async () => {
  }, [notifs]);


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
        <Container style={{ maxWidth: '95%', marginTop: '30px' }}>
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
              <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Requests</h5>


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
                          <ListGroup.Item action onClick={()=>history.push('/requests')}
                            className="d-flex justify-content-between align-items-start"
                          >
                            <div className="ms-2 me-auto">
                              <div>{task.task}: {task.requirements[0].value}</div>
                            </div>
                            <Badge bg="primary" pill>
                              {task.status}
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
                          <ListGroup.Item action onClick={()=>history.push('/requests')}
                            className="d-flex justify-content-between align-items-start"
                          >
                            <div className="ms-2 me-auto">
                              <div>{request.desc}</div>
                            </div>
                            <Badge bg="primary" pill>
                              {request.status}
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
      </>
    )
  }

};

export default RequestorHome;
