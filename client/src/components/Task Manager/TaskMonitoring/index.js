
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc, or } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";


import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

import moment from 'moment'
import { createNotifs } from '../../../redux/notifs/createNotif';
import { toast } from 'react-toastify';

const TaskMonitoring = () => {
  const [projects, setProjects] = useState([])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const dispatch = useDispatch();

  const [task, setTask] = useState();
  const [tasksCompletedInit, setTasksCompletedInit] = useState();
  const [tasksPendingInit, setTasksPendingInit] = useState();

  const [taskIDName, setTaskIDName] = useState();
  const database = getFirestore()
  const [users, setUsers] = useState([]);
  const usersRef = collection(database, "users");
  const [tasksPending, setTasksPending] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const collectionRef = collection(database, 'tasks')
  const [loading, setLoading] = useState(true)
  const [firstRender, setFirstRender] = useState(true);
  const [role, setRole] = useState();

  const [chartTasksCompleted, setChartTasksCompleted] = useState()
  const [chartTasksCompletedLate, setChartTasksCompletedLate] = useState()
  const [chartTasksPending, setChartTasksPending] = useState()
  const [chartTasksPendingLate, setChartTasksPendingLate] = useState()


  const [chartEmployee, setChartEmployee] = useState([])
  const [chartEmployeeTasksCompleted, setChartEmployeeTasksCompleted] = useState([])
  const [chartEmployeeTasksPending, setChartEmployeeTasksPending] = useState([])

  const [chartTasksCompletedInit, setChartTasksCompletedInit] = useState()
  const [chartTasksCompletedLateInit, setChartTasksCompletedLateInit] = useState()
  const [chartTasksPendingInit, setChartTasksPendingInit] = useState()
  const [chartTasksPendingLateInit, setChartTasksPendingLateInit] = useState()

  const [chartEmployeeInit, setChartEmployeeInit] = useState([])
  const [chartEmployeeTasksCompletedInit, setChartEmployeeTasksCompletedInit] = useState([])
  const [chartEmployeeTasksPendingInit, setChartEmployeeTasksPendingInit] = useState([])

  const [chartProject, setCharProject] = useState([])
  const [chartProjectTasks, setCharProjectTasks] = useState([])



  const { isLoggedIn, user, userId } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
      userId: state.auth.userId,
    }),
    shallowEqual
  );


  const handleReport = (id) => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.autoTable({
      html: id,
    });

    doc.save("mypdf.pdf");
  }

  const deleteTask = async () => {
    console.log(task)
    toast.info('Deleting task. Please wait..')

    await deleteDoc(doc(database, 'tasks', task.id)).then(() => {
      dispatch(createNotifs({
        title: 'TASK DELETED: ' + task.task,
        message: 'This task has been deleted. ',
        receiverID: task.employeeId,
        link: 'tasks'
      }))
      toast.success('Task Deleted')

    })
  }

  const showTaskDeletion = (task) => {
    setTask(task)
    setShow(true)
    console.log('HI')
  }

  const dataTasksComplete = {
    labels: chartEmployee,
    datasets: [
      {
        label: '# of Tasks Completed',
        data: chartEmployeeTasksCompleted,
        backgroundColor: [
          'rgba(144, 238, 144, 1)',

        ],
        borderColor: [
          'rgba(144, 238, 144, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  const dataTasksPending = {
    labels: chartEmployee,
    datasets: [
      {
        label: '# of Tasks Pending',
        data: chartEmployeeTasksPending,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',

        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  const dataProjectTasks = {
    labels: ['Completed', 'Completed but late', 'Pending', 'Late'],
    datasets: [
      {
        label: 'Status of Tasks',
        data: [chartTasksCompleted, chartTasksCompletedLate, chartTasksPending, chartTasksPendingLate],
        backgroundColor: [
          'rgba(0, 128, 0, 1)', 'rgba(255, 255, 0, 1)', 'rgba(255, 165, 0, 1)', 'rgba(255, 0, 0, 1)'

        ],
        borderColor: [
          'rgba(0, 128, 0, 1)', 'rgba(255, 255, 0, 1)', 'rgba(255, 165, 0, 1)', 'rgba(255, 0, 0, 1)'

        ],
        borderWidth: 1,
      },
    ],
  };
  useEffect(() => {
    const getTasks = async () => {
      // const q = query(collectionRef, orderBy('task', 'asc'))
      const q = query(collectionRef, where('status', '!=', 'done'))
      await getDocs(q).then((tasks) => {
        let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        setTasksPendingInit(tasksData)
        setTasksPending(tasksData)

        let notLate = 0
        let late = 0

        tasksData.forEach((task) => {
          if (task.deadline.toDate() > new Date)
            notLate++
          else
            late++

        })
        setChartTasksPendingInit(notLate)
        setChartTasksPendingLateInit(late)
        setChartTasksPending(notLate)
        setChartTasksPendingLate(late)

      }).catch((err) => {
        console.log(err);
      })

      const f = query(collectionRef, where('status', '==', 'done'))
      await getDocs(f).then((tasks) => {
        let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasksCompletedInit(tasksData)
        setTasksCompleted(tasksData)

        let notLate = 0
        let late = 0
        tasksData.forEach((task) => {
          if (task.deadline.toDate() > task.completion.toDate())
            notLate++
          else
            late++

        })

        setChartTasksCompletedInit(notLate)
        setChartTasksCompletedLateInit(late)
        setChartTasksCompleted(notLate)
        setChartTasksCompletedLate(late)

      }).catch((err) => {
        console.log(err);
      }).then(() => {
        setLoading(false)
      })
    }
    getTasks()
    const getUsers = async () => {
      // const q = query(collectionRef, orderBy('task', 'asc'))
      const q = query(usersRef, where('role', '==', 'Employee'))
      await getDocs(q).then((users) => {
        let usersData = users.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        usersData.forEach(async (user) => {
          setChartEmployee(prevItem => [...prevItem, user.name])
          setChartEmployeeInit(prevItem => [...prevItem, user.name])

          const q = query(collection(database, "tasks"), or(where("employeeId", "==", user.email), where('origUser', '==', user.email)));

          const querySnapshot = await getDocs(q);

          let complete = 0
          let pending = 0
          querySnapshot.forEach((doc) => {
            if (doc.data().status == 'done') {

              console.log(user.name + '=' + doc.data().task)
              complete = complete + 1
            } else {
              pending = pending + 1
            }
          });
          setChartEmployeeTasksCompleted(prevItem => [...prevItem, complete])
          setChartEmployeeTasksPending(prevItem => [...prevItem, pending])
          setChartEmployeeTasksCompletedInit(prevItem => [...prevItem, complete])
          setChartEmployeeTasksPendingInit(prevItem => [...prevItem, pending])


        })
        setUsers(usersData)


      }).catch((err) => {
        console.log(err);
      })
    }
    getUsers()

    const getProjects = async () => {
      const q = query(collection(database, 'projects'))
      await getDocs(q).then((project) => {
        let projectData = project.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setProjects(projectData)
      }).catch((err) => {
        console.log(err);
      })
    }
    getProjects()
  }, [])

  useEffect(async () => {

    if (user) {
      let role
      const q = query(collection(database, "users"), where("email", "==", user.data.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        role = doc.data().role
      });

      setRole(role)

    }
  }, [user])

  const resetFilterCompleted = () => {
    setTasksCompleted(tasksCompletedInit)
  }
  const sortFilterCompleted = (sort) => {

    if (sort == 'End Date Descending') {

      const filter = tasksCompleted.sort((a, b) => b.deadline - a.deadline)
      setTasksCompleted([...filter])
    } else if (sort == 'End Date Ascending') {

      const filter = tasksCompleted.sort((a, b) => a.deadline - b.deadline)
      setTasksCompleted([...filter])
    }
    else if (sort == 'Start Date Ascending') {

      const filter = tasksCompleted.sort((a, b) => a.timestamp - b.timestamp)
      setTasksCompleted([...filter])
    }
    else if (sort == 'Start Date Descending') {

      const filter = tasksCompleted.sort((a, b) => b.timestamp - a.timestamp)
      setTasksCompleted([...filter])
    }
    else if (sort == 'No. of Hours Descending') {

      const filter = tasksCompleted.sort((a, b) => b.hours - a.hours)
      setTasksCompleted([...filter])
    }
    else if (sort == 'No. of Hours Ascending') {

      const filter = tasksCompleted.sort((a, b) => a.hours - b.hours)
      setTasksCompleted([...filter])
    }
  }

  const filterTaskCompleted = (filter) => {

    const filteredTasks = tasksCompleted.filter(data => data.task.includes(filter))

    setTasksCompleted(filteredTasks)

  }

  const filterEmployeeCompleted = (filter) => {

    const filteredTasks = tasksCompleted.filter(data => data.employee.includes(filter))

    setTasksCompleted(filteredTasks)

  }

  const resetFilterPending = () => {
    setTasksPending(tasksPendingInit)
  }
  const sortFilterPending = (sort) => {

    if (sort == 'End Date Descending') {

      const filter = tasksPending.sort((a, b) => b.deadline - a.deadline)
      setTasksPending([...filter])
    } else if (sort == 'End Date Ascending') {

      const filter = tasksPending.sort((a, b) => a.deadline - b.deadline)
      setTasksPending([...filter])
    }
    else if (sort == 'Start Date Ascending') {

      const filter = tasksPending.sort((a, b) => a.timestamp - b.timestamp)
      setTasksPending([...filter])
    }
    else if (sort == 'Start Date Descending') {

      const filter = tasksPending.sort((a, b) => b.timestamp - a.timestamp)
      setTasksPending([...filter])
    }
    else if (sort == 'No. of Hours Descending') {

      const filter = tasksPending.sort((a, b) => b.hours - a.hours)
      setTasksPending([...filter])
    }
    else if (sort == 'No. of Hours Ascending') {

      const filter = tasksPending.sort((a, b) => a.hours - b.hours)
      setTasksPending([...filter])
    }
  }

  const filterTaskPending = (filter) => {

    const filteredTasks = tasksPending.filter(data => data.task.includes(filter))

    setTasksPending(filteredTasks)

  }

  const filterEmployeePending = (filter) => {

    const filteredTasks = tasksCompleted.filter(data => data.employee.includes(filter))

    setTasksPending(filteredTasks)

  }
  const filterStartPending = (filter) => {
    if (filter == '1 week') {
      setTasksPending(tasksPendingInit)
      const seventhDay = new Date();
      seventhDay.setDate(seventhDay.getDate() - 7);

      const filteredData = tasksPending.filter((d) => {
        if (d.timestamp) {
          return d.timestamp.toDate().getTime() >= seventhDay.getTime();
        }

      });

      setTasksPending(filteredData)
    } else if (filter == '1 month') {
      setTasksPending(tasksPendingInit)

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const filteredData = tasksPending.filter((d) => {
        if (d.timestamp) {
          return d.timestamp.toDate().getTime() >= thirtyDaysAgo.getTime();
        }

      });

      setTasksPending(filteredData)
    } else if (filter == '3 months') {
      setTasksPending(tasksPendingInit)

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const filteredData = tasksPending.filter((d) => {
        if (d.timestamp) {
          return d.timestamp.toDate().getTime() >= threeMonthsAgo.getTime();
        }

      });

      setTasksPending(filteredData)
    }
  }
  const filterEndPending = (filter) => {
    setTasksPending(tasksPendingInit)


    if (filter == '1 week') {
      const seventhDay = new Date();
      seventhDay.setDate(seventhDay.getDate() - 7);

      const filteredData = tasksPending.filter((d) => {
        if (d.deadline) {
          return d.deadline.toDate().getTime() >= seventhDay.getTime();

        }
      });

      setTasksPending(filteredData)
    } else if (filter == '1 month') {
      setTasksPending(tasksPendingInit)

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const filteredData = tasksPending.filter((d) => {
        if (d.deadline) {
          return d.deadline.toDate().getTime() >= thirtyDaysAgo.getTime();

        }
      });

      setTasksPending(filteredData)
    } else if (filter == '3 months') {
      setTasksPending(tasksPendingInit)

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const filteredData = tasksPending.filter((d) => {
        if (d.deadline) {
          return d.deadline.toDate().getTime() >= threeMonthsAgo.getTime();

        }
      });

      setTasksPending(filteredData)
    }

  }
  const filterStartCompleted = (filter) => {
    if (filter == '1 week') {
      const seventhDay = new Date();
      seventhDay.setDate(seventhDay.getDate() - 7);

      const filteredData = tasksCompleted.filter((d) => {
        if (d.timestamp) {
          return d.timestamp.toDate().getTime() >= seventhDay.getTime();
        }


      });


      setTasksCompleted(filteredData)
    } else if (filter == '1 month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const filteredData = tasksCompleted.filter((d) => {
        if (d.timestamp) {
          return d.timestamp.toDate().getTime() >= thirtyDaysAgo.getTime();

        }
      });

      setTasksCompleted(filteredData)
    } else if (filter == '3 months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const filteredData = tasksCompleted.filter((d) => {
        if (d.timestamp) {
          return d.timestamp.toDate().getTime() >= threeMonthsAgo.getTime();
        }
      });

      setTasksCompleted(filteredData)
    }
  }
  const filterEndCompleted = (filter) => {

    if (filter == '1 week') {
      const seventhDay = new Date();
      seventhDay.setDate(seventhDay.getDate() - 7);

      const filteredData = tasksCompleted.filter((d) => {
        if (d.deadline) {
          return d.deadline.toDate().getTime() >= seventhDay.getTime();

        }
      });

      setTasksCompleted(filteredData)
    } else if (filter == '1 month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const filteredData = tasksCompleted.filter((d) => {
        if (d.deadline) {
          return d.deadline.toDate().getTime() >= thirtyDaysAgo.getTime();

        }
      });

      setTasksCompleted(filteredData)
    } else if (filter == '3 months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const filteredData = tasksCompleted.filter((d) => {
        if (d.deadline) {
          return d.deadline.toDate().getTime() >= threeMonthsAgo.getTime();

        }
      });

      setTasksCompleted(filteredData)
    }

  }

  const filterProjectCompleted = (filter) => {
    const filteredTasks = tasksCompleted.filter(data => data.project.includes(filter))

    setTasksCompleted(filteredTasks)
  }
  const filterProjectPending = (filter) => {
    const filteredTasks = tasksPending.filter(data => data.project.includes(filter))

    setTasksPending(filteredTasks)
  }

  const changeChartProject = async (project) => {

    if (project == 'All') {

      setChartTasksPending(chartTasksPendingInit)
      setChartTasksPendingLate(chartTasksPendingLateInit)
      setChartTasksCompleted(chartTasksCompletedInit)
      setChartTasksCompletedLate(chartTasksCompletedLateInit)
      setChartEmployee(chartEmployeeInit)
      setChartEmployeeTasksCompleted(chartEmployeeTasksCompletedInit)
      setChartEmployeeTasksPending(chartEmployeeTasksPendingInit)

    } else {
      setChartTasksPending()
      setChartTasksPendingLate()
      setChartTasksCompleted()
      setChartTasksCompletedLate()
      setChartEmployee([])
      setChartEmployeeTasksCompleted([])
      setChartEmployeeTasksPending([])

      const q = query(usersRef, where('role', '==', 'Employee'))
      await getDocs(q).then((users) => {
        let usersData = users.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        usersData.forEach(async (user) => {
          setChartEmployee(prevItems => [...prevItems, user.name]);
          const q = query(collection(database, "tasks"), or(where("employeeId", "==", user.email), where('origUser', '==', user.email)));

          const querySnapshot = await getDocs(q);

          let complete = 0
          let pending = 0
          querySnapshot.forEach((doc) => {
            if (doc.data().project == project) {
              if (doc.data().status == 'done') {

                console.log(user.name + '=' + doc.data().task)
                complete = complete + 1
              } else {
                pending = pending + 1
              }
            }
          });
          setChartEmployeeTasksCompleted(prevItem => [...prevItem, complete])
          setChartEmployeeTasksPending(prevItem => [...prevItem, pending])
        })


      }).catch((err) => {
        console.log(err);
      })
      const getTasks = async () => {
        // const q = query(collectionRef, orderBy('task', 'asc'))
        const q = query(collectionRef, where('status', '!=', 'done'), where('project', '==', project))
        await getDocs(q).then((tasks) => {
          let notLate = 0
          let late = 0
          let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

          tasksData.forEach((task) => {
            if (task.deadline.toDate() > new Date)
              notLate++
            else
              late++

          })
          setChartTasksPending(notLate)
          setChartTasksPendingLate(late)
        }).catch((err) => {
          console.log(err);
        })

        const f = query(collectionRef, where('status', '==', 'done'), where('project', '==', project))
        await getDocs(f).then((tasks) => {

          let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          let notLate = 0
          let late = 0
          tasksData.forEach((task) => {
            if (task.deadline.toDate() > task.completion.toDate())
              notLate++
            else
              late++

          })

          setChartTasksCompleted(notLate)
          setChartTasksCompletedLate(late)

        }).catch((err) => {
          console.log(err);
        }).then(() => {
          setLoading(false)
        })
      }

      getTasks()
    }

  }

  if (loading) {
    return (
      <div className='loadingcontain'>
        <Spinner className='loading' animation="border" variant="secondary" />
      </div>
    )
  } else {
    return (
      <>
        {role == 'Manager' || role == 'CEO' && (
          <>
            <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Tasks Records</h5>
            <p></p>
            <Tabs
              defaultActiveKey="Standard"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="Standard" title="Standard">
                <Row xs='auto'>
                  <Col>
                    <Form.Select placeholder='Project' onChange={(e) => changeChartProject(e.target.value)}>
                      <option value="All">All</option>
                      {projects.map((project, index) => (
                        <>
                          <option value={project.name}>{project.name}</option>
                        </>

                      ))}
                    </Form.Select>
                  </Col>

                </Row>
                <Row>
                  <Col>
                    <Bar data={dataTasksComplete}></Bar>
                  </Col>
                  <Col>
                    <Bar data={dataTasksPending}></Bar>
                  </Col>
                  <Col>
                    <Pie data={dataProjectTasks} width={"30%"}
                      options={{ maintainAspectRatio: false }}></Pie>
                  </Col>
                </Row>

              </Tab>
              <Tab eventKey="Advanced" title="Advanced">

                <Tabs
                  defaultActiveKey="pending"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >

                  <Tab eventKey="pending" title="Pending">

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
                            <option value="No. of Hours Descending"> No. of Hours Descending</option>
                            <option value="No. of Hours Ascending"> No. of Hours Ascending</option>
                          </Form.Select>
                        </Col>
                        <Col>
                          <Form.Select onChange={(e) => filterProjectPending(e.target.value)}>
                            <option value="" hidden>Filter by Project</option>
                            {projects.map((project, index) => (
                              <>
                                <option value={project.name}>{project.name}</option>
                              </>

                            ))}
                          </Form.Select>

                        </Col>
                        <Col>
                          <Form.Control
                            type="text"
                            onChange={(e) => filterTaskPending(e.target.value)}
                            placeholder='Filter by Task/Plan'
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
                            <option value="" hidden>Filter Start Date</option>
                            <option value='1 week'>1 week</option>
                            <option value='1 month'>1 Month</option>
                            <option value='3 months'>3 Months</option>

                          </Form.Select>

                        </Col>
                        <Col>
                          <Form.Select onChange={(e) => filterEndPending(e.target.value)}>
                            <option value="" hidden>Filter End Date</option>
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
                          <th>Workflow</th>
                          <th>Project</th>
                          <th>Task / Plan</th>
                          <th>Requirements</th>
                          <th>No. of Hours</th>
                          <th>Assign</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasksPending.map(task => (
                          <tr key={task.id}  >

                            {task.workflowname ? (
                              <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}> {task.workflowname}</td>
                            ) : (
                              <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>Request</td>
                            )}
                            <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>{task.project}</td>
                            <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>{task.task}</td>
                            {task.requirements ? (
                              <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}> {task.requirements.map((req, index) => (
                                <>
                                  {req.url ? (
                                    <a href={req.url} target='_blank'>{req.value}</a>
                                  ) : (
                                    <>
                                      {req.value}
                                    </>
                                  )}

                                  {index !== task.requirements.length - 1 && ', '}
                                </>
                              ))}</td>
                            ) : (<td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>None</td>)}

                            <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>{task.hours}</td>
                            <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>{task.employee}</td>
                            <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>{moment(task.timestamp.toDate()).format('l')}</td>
                            {task.deadline == 'None' ? (
                              <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>None</td>
                            ) : (
                              <td style={{ color: task.deadline.toDate() < new Date() ? 'red' : 'black' }}>{moment(task.deadline.toDate()).format('l')}</td>

                            )}
                            {task.status == 'for submission' && (
                              <td style={{ backgroundColor: "red", color: 'white' }}>Pending</td>
                            )}
                            {task.status == 'done' && (
                              <td style={{ backgroundColor: "green", color: 'white' }}>Completed</td>
                            )}
                            {task.status == 'for approval' && (
                              <td style={{ backgroundColor: "red", color: 'white' }}>Pending</td>
                            )}


                            {role && role != 'Employee' && (
                              <>
                                <td><Button onClick={() => showTaskDeletion(task)} size='sm'>Delete</Button></td>
                              </>
                            )}



                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey="completed" title="Completed">
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
                            <option value="No. of Hours Descending"> No. of Hours Descending</option>
                            <option value="No. of Hours Ascending"> No. of Hours Ascending</option>
                          </Form.Select>
                        </Col>
                        <Col>
                          <Form.Select onChange={(e) => filterProjectCompleted(e.target.value)}>
                            <option value="" hidden>Filter by Project</option>
                            {projects.map((project, index) => (
                              <>
                                <option value={project.name}>{project.name}</option>
                              </>

                            ))}
                          </Form.Select>

                        </Col>
                        <Col>
                          <Form.Control
                            type="text"
                            onChange={(e) => filterTaskCompleted(e.target.value)}
                            placeholder='Filter by Task/Plan'
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
                            <option value="" hidden>Filter Start Date</option>
                            <option value='1 week'>1 week</option>
                            <option value='1 month'>1 Month</option>
                            <option value='3 months'>3 Months</option>

                          </Form.Select>

                        </Col>
                        <Col>
                          <Form.Select onChange={(e) => filterEndCompleted(e.target.value)}>
                            <option value="" hidden>Filter End Date</option>
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
                          <th>Workflow</th>
                          <th>Project</th>
                          <th>Task / Plan</th>
                          <th>Requirements</th>
                          <th>No. of Hours</th>
                          <th>Assign</th>
                          <th>Start Date</th>
                          <th>Deadline</th>
                          <th>Date Completed</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasksCompleted.map(task => (
                          <tr key={task.id}>
                            {task.workflowname ? (
                              <td>{task.workflowname}</td>
                            ) : (
                              <td>Request</td>
                            )}
                            <td>{task.project}</td>
                            <td>{task.task}</td>
                            {task.requirements ? (
                              <td> {task.requirements.map((req, index) => (
                                <>
                                  {req.url ? (
                                    <a href={req.url} target='_blank'>{req.value}</a>
                                  ) : (
                                    <>
                                      {req.value}
                                    </>
                                  )}

                                  {index !== task.requirements.length - 1 && ', '}
                                </>
                              ))}</td>
                            ) : (<td>None</td>)}

                            <td>{task.hours}</td>
                            <td>{task.employee}</td>

                            <td>{moment(task.timestamp.toDate()).format('l')}</td>


                            {task.deadline == 'None' ? (
                              <td>None</td>
                            ) : (
                              <td>{moment(task.deadline.toDate()).format('l')}</td>

                            )}
                            <td>{moment(task.completion.toDate()).format('l')}</td>
                            {task.status == 'for submission' && (
                              <td style={{ backgroundColor: "red", color: 'white' }}>Pending</td>
                            )}
                            {task.status == 'done' && task.completion < task.deadline && (
                              <td style={{ backgroundColor: "green", color: 'white' }}>Completed
                              </td>
                            )}
                            {task.status == 'done' && task.completion > task.deadline && (
                              <td style={{ backgroundColor: "yellow", color: 'black' }}>Completed (Late)
                              </td>
                            )}
                            {task.status == 'for approval' && (
                              <td style={{ backgroundColor: "red", color: 'white' }}>Pending</td>
                            )}

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>

                </Tabs>

              </Tab>

            </Tabs>
          </>

        )}



        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete task?</Modal.Title>
          </Modal.Header>
          <Modal.Body> Assigned Employee will be notified of the task cancellation.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={deleteTask}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

      </>
    )
  }

}

export default TaskMonitoring

