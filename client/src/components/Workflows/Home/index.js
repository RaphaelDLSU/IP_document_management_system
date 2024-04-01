
import React, { useEffect, useState } from 'react'
import { increment, where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AccordionHeader } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import ListGroup from 'react-bootstrap/ListGroup';
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import projectModel from '../../../models/project';
import { autoAssign } from '../../../redux/workload/autoAssign';
import { createNotifs } from '../../../redux/notifs/createNotif';
const Home = () => {
    const [firstRender2, setFirstRender2] = useState(true);
    const [loading, setLoading] = useState(true)
    const database = getFirestore()
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [show2, setShow2] = useState(false);
    const [show4, setShow4] = useState(false);
    const [show5, setShow5] = useState(false);
    const [show6, setShow6] = useState(false);
    const handleClose2 = () => setShow2(false);
    const { path } = useRouteMatch();
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);

    const [workflows, setWorkflows] = useState([]);
    const [presets, setPresets] = useState([]);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [workflowTask, setWorkflowTask] = useState({})

    const [approvalTo, setApprovalTo] = useState('')
    const [assignTo, setAssignTo] = useState('')

    const [createTask, setCreateTask] = useState("")
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [employee, setEmployee] = useState();

    const usersRef = collection(database, "users");

    const workflowRef = collection(database, "workflows");
    const presetRef = collection(database, "presets");

    const [workflowDocRef, setWorkflowDocRef] = useState()
    const tasksRef = collection(database, 'tasks')

    const [presetId, setPresetId] = useState()
    const [preset, setPreset] = useState()
    const [delId, setDelId] = useState()

    const [projectName, setProjectName] = useState()

    const [assignEmployeeTask, setAssignEmployeeTask] = useState()
    const [assignEmployeeWorkflowId, setAssignEmployeeWorkflowId] = useState()

    const [startId, setStartId] = useState()
    const [startStarted, setStartStarted] = useState()
    const [startTasks, setStartTasks] = useState()
    const [project, setProject] = useState('')
    const [projects, setProjects] = useState([])
    const [autoEmployee, setAutoEmployee] = useState()
    const [autoEmployeeID, setAutoEmployeeID] = useState()
    const [isChecked, setIsChecked] = useState(false);
    const [role, setRole] = useState();
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );


    const createWorkflow = async (e) => {
        toast.info('Creating Workflow')
        e.preventDefault();


        console.log('preset = ' + presetId)


        const docRef = doc(database, "presets", presetId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
        const presetData = docSnap.data()
        presetData.tasks = presetData.tasks.map(v => ({ ...v, parentId: Math.random().toString(36).slice(2, 7) }));
        setPreset(presetData)
        await addDoc(workflowRef, {
            name: name,
            preset: presetData.name,
            description: presetData.description,
            tasks: presetData.tasks,
            project: project,
            started: false,
            outputs: [],
            inStage: false,
        }).catch(err => {
            toast.error(err)
            console.error();
        })
        const q = query(collection(database, "workflows"), where("name", "==", name));
        let workflowId
        let workflowName

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            workflowId = doc.id
            workflowName = doc.data().name
        });

        let arrayTasks = presetData.tasks

        // Function to update a specific field in all objects
        function updateFieldInAllObjects(array, fieldToUpdate, newValue) {
            array.forEach(obj => {
                obj[fieldToUpdate] = newValue; // Update the specified field in each object
            });
        }

        // Update the age of all objects to 40
        updateFieldInAllObjects(arrayTasks, 'workflow', workflowId);
        updateFieldInAllObjects(arrayTasks, 'workflowname', workflowName);

        const updateWorkflowRef = doc(database, "workflows", workflowId);

        await updateDoc(updateWorkflowRef, {
            tasks: arrayTasks
        }).then(() => {
            toast.success('Workflow Created')
        })

        window.location.reload()
    }


    const assignEmployee = (workflowId, task) => {

        setAssignEmployeeWorkflowId(workflowId)
        setAssignEmployeeTask(task)
        setShow2(true)
    }

    const assignEmployeeToTask = async (e) => {
        toast.info('Assigning ' + employee + ' to task')
        e.preventDefault();
        const docRef = doc(database, "workflows", assignEmployeeWorkflowId);
        const docSnap = await getDoc(docRef);
        let something = docSnap.data().tasks
        const workflowRef = doc(database, "workflows", assignEmployeeWorkflowId);

        console.log('cECKED ' + isChecked)
        if (!isChecked) {
            docSnap.data().tasks.map(async (task, index) => {
                if (task.name === assignEmployeeTask.name) {
                    something[index].assignTo = employee
                    console.log('index ' + index)
                }

            });

            await updateDoc(workflowRef, {
                tasks: something
            }).then(() => {
                toast.success(employee + ' assigned to ' + assignEmployeeTask.name)
            })

        } else {
            toast.info('Automatically assigning an employee')
            console.log('Checked')

            docSnap.data().tasks.map(async (task, index) => {
                if (task.name === assignEmployeeTask.name) {
                    something[index].assignTo = autoEmployee
                    console.log('index ' + index)
                }
            });
            await updateDoc(workflowRef, {
                tasks: something
            }).then(async () => {
                await updateDoc(doc(database, "users", autoEmployeeID), {
                    tasks: increment(1)
                })
                toast.success('Assigned ' + autoEmployee + ' to task')
            });

        }

        window.location.reload()
    }



    const autoAssignThis = (e) => {
        setIsChecked(e)
        const employee = dispatch(autoAssign({}))
        employee.then(async (employeeId) => {
            const employeeRef = await getDoc(doc(database, 'users', employeeId))
            setAutoEmployeeID(employeeRef.id)
            setAutoEmployee(employeeRef.data().name)
        })
    }


    const changeStatus = async (id, started, tasks) => {


        try {
            await updateDoc(doc(database, "workflows", id), {
                started: !started
            })


            if (!started) {
                toast.info('Starting the process. Please Wait')
                console.log('STARRT' + started)
                const workflowRef = doc(database, "workflows", id)
                const workflow = await getDoc(workflowRef)

                console.log(workflow.data().tasks)
                const statusTask = workflow.data().tasks
                statusTask[0].active = true
                let q

                if (statusTask[0].assignTo == 'CEO' || statusTask[0].assignTo == 'Manager') {
                    q = query(collection(database, "users"), where('role', '==', statusTask[0].assignTo))
                } else {
                    q = query(collection(database, "users"), where('name', '==', statusTask[0].assignTo))
                }


                const querySnapshot = await getDocs(q);

                const dateDeadline = new Date();
                dateDeadline.setDate(dateDeadline.getDate() + 3);
                querySnapshot.forEach(async (user) => {
                    const setTasksRef = doc(database, 'tasks', statusTask[0].parentId)
                    const stageRef = doc(database, 'stages', statusTask[0].parentId)
                    if (!statusTask[0].isStage) {
                        await setDoc(setTasksRef, {
                            task: statusTask[0].name,
                            isChecked: false,
                            timestamp: serverTimestamp(),
                            deadline: dateDeadline,
                            employee: user.data().name,
                            employeeId: user.data().email,
                            requirements: statusTask[0].requirements,
                            status: 'for submission',
                            approval: statusTask[0].approval,
                            workflow: statusTask[0].workflow,
                            workflowname: workflow.data().name,
                            approvalTo: statusTask[0].approvalTo,
                            project: workflow.data().project,
                            hours: 40
                        })

                        dispatch(createNotifs({
                            title: 'NEW TASK: ' + statusTask[0].name,
                            message: 'You have been assigned to a new task. Please check the Tasks Manager Page for more information ',
                            receiverID: user.data().email,
                            link: 'tasks'
                        }))
                    } else {
                        await setDoc(stageRef, {
                            task: statusTask[0].name,
                            workflow: statusTask[0].workflow,
                            workflowname: workflow.data().name,
                            project: workflow.data().project
                        })

                        await updateDoc(workflowRef, {
                            inStage: true
                        })
                    }

                });

                await updateDoc((workflowRef), {
                    tasks: statusTask
                }).then(() => {
                    toast.success(workflow.data().name + ' started')
                    window.location.reload()
                })
            }
            if (started) {
                const newArray = []
                const workflowRef = doc(database, "workflows", id)
                const workflow = await getDoc(workflowRef)

                toast.info('Stopping ' + workflow.data().name)
                for (const task of tasks) {
                    console.log('ID' + task.id)

                    if (task.active == true) {
                        const docRef = doc(database, "tasks", task.parentId);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.data().status == 'done') {
                            await addDoc(collection(database, "tasks"), docSnap.data())
                        }
                        await deleteDoc(doc(database, "tasks", task.parentId))
                        task.active = false
                    }
                    console.log('WHAT HAPPENDED : ' + task.active)
                    console.log('WHAT HAPPENDED 2: ' + JSON.stringify(task))
                    newArray.push(task)

                    if (!task.manualTasks) {
                        await deleteDoc(doc(database, 'stages', task.parentId))
                    }
                    console.log('Array' + JSON.stringify(newArray))
                }
                await updateDoc((workflowRef), {
                    tasks: newArray
                }).then(() => {
                    toast.success(workflow.data().name + ' Stopped')
                    window.location.reload()
                })
                console.log('Array HERE: ' + JSON.stringify(newArray))
            }

        } catch (err) {
            console.log(err);
        }
    };

    const moveStage = async (id) => {
        toast.info('Ending Stage. Please Wait...')
        const workflowRef = doc(database, "workflows", id);
        const docSnap = await getDoc(workflowRef);

        let isTaskActive = false
        let endWorkflow = true
        let done = false
        let updateTaskArray = []
        let isFinished = false

        var data = [];
        var tempCollection = [];
        docSnap.data().tasks.forEach(collection => {
            tempCollection.push(collection);
        });

        for (const task1 of tempCollection) {
            if (isTaskActive && !done) {

                console.log('HELP ME')
                done = true

                console.log('task ' + task1.name)

                console.log('Creating task for yet to activate stage')

                const setTasksRef = doc(database, 'tasks', task1.parentId)
                const stageRef = doc(database, 'stages', task1.parentId)
                if (task1.assignTo) {
                    console.log('Automatic Stage')
                    const q = query(collection(database, "users"), where('name', '==', task1.assignTo))
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (user) => {
                        console.log('USER: ' + user)
                        //Notifs
                        dispatch(createNotifs({
                            title: 'NEW TASK: ' + task1.name,
                            message: 'You have been assigned to a new task. Please check the Tasks Manager Page for more information ',
                            receiverID: user.data().email,
                            link: 'tasks'
                        }))
                        const dateDeadline = new Date();
                        dateDeadline.setDate(dateDeadline.getDate() + 3);
                        await setDoc(setTasksRef, {
                            task: task1.name,
                            isChecked: false,
                            timestamp: serverTimestamp(),
                            deadline: dateDeadline,
                            employee: user.data().name,
                            employeeId: user.data().email,
                            requirements: task1.requirements,
                            status: 'for submission',
                            approval: task1.approval,
                            workflow: task1.workflow,
                            workflowname: task1.workflowname,
                            approvalTo: task1.approvalTo,
                            recurring: task1.recurring,
                            project: docSnap.data().project,
                            hours: 40
                        })
                    })
                } else {
                    await setDoc(stageRef, {
                        task: task1.name,
                        workflow: task1.workflow,
                        workflowname: task1.workflowname,
                        project: docSnap.data().project
                    })
                }


            }
            //brush off inactive tasks before finishing
            if (!task1.active && !isTaskActive && !done) {
                console.log('brush off')

                updateTaskArray.push(task1)
            }
            //make active task inactive
            if (task1.active && !done) {
                isFinished = true
                console.log('make active task inactive')
                if (task1.manualTasks) {
                    updateTaskArray.push({
                        active: false,
                        approval: task1.approval,
                        approvalTo: task1.approvalTo,
                        assignTo: task1.assignTo,
                        employeeManual: task1.employeeManual,
                        manualTasks: task1.manualTasks,
                        name: task1.name,
                        parentId: task1.parentId,
                        recurring: task1.recurring,
                        requirements: task1.requirements,
                        workflow: task1.workflow,
                        workflowname: task1.workflowname,
                        hours: 3
                    })
                } else {
                    updateTaskArray.push({
                        active: false,
                        manualTasks: task1.manualTasks,
                        name: task1.name,
                        parentId: task1.parentId,
                        workflow: task1.workflow,
                        workflowname: task1.workflowname
                    })

                    await deleteDoc(doc(database, 'stages', task1.parentId))
                }
            }

            //make inactive task active
            if (done && isTaskActive) {
                isFinished = false
                console.log('make inactive task active')

                if (task1.manualTasks) {
                    task1.active = true
                    await updateDoc(workflowRef, {
                        inStage: false
                    })
                } else {
                    task1.active = true

                    await updateDoc(workflowRef, {
                        inStage: true
                    })
                }
                isTaskActive = false
            }

            //finished activating task
            if (done && !isTaskActive) {
                console.log('finished activating task')
                updateTaskArray.push(task1)
            }


            //Recognize task is active and create a task for next task
            if (task1.active && !isTaskActive && !done) {
                console.log('Recognize next task is active and create a task for next task')
                isTaskActive = true
            }
        }
        await updateDoc(workflowRef, {
            tasks: updateTaskArray
        })


        if (isFinished) {
            await updateDoc(workflowRef, {
                started: false,
                tasks: updateTaskArray,
                inStage: false
            })
        } else {
            await updateDoc(workflowRef, {
                tasks: updateTaskArray
            })

        }

        toast.success('Stage ended')
    }

    const createProject = async (e) => {
        e.preventDefault()
        toast.info("Creating Project")

        const projectRef = collection(database, "projects")

        await addDoc(projectRef, projectModel(projectName)).then(() => {
            toast.success(projectName + ' created')
        })
    }


    const setDeleteId = async (id) => {
        setDelId(id)
        setShow6(true)
    }
    const deleteStage = async () => {

        toast.info('Deleting Stage. Please wait..')

        await deleteDoc(doc(database, "workflows", delId)).then(() => {
            setShow6(false)
            toast.success('Stage Deleted')
        })
    }


    useEffect(() => {
        const getWorkflows = async () => {
            const q = query(workflowRef)
            await getDocs(q).then((workflow) => {
                let workflowData = workflow.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setWorkflows(workflowData)
                console.log('WORKFLOWS ' + JSON.stringify(workflowData))
            }).catch((err) => {
                console.log(err);
            })
        }
        getWorkflows()

        const getPresets = async () => {
            const q = query(presetRef)
            await getDocs(q).then((preset) => {
                let presetData = preset.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setPresets(presetData)

            }).catch((err) => {
                console.log(err);
            })
        }
        getPresets()

        const getEmployees = async () => {
            const q = query(collection(database, "users"), where('role', '==', 'Employee'))
            await getDocs(q).then((user) => {
                let userData = user.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setUsers(userData)
            }).catch((err) => {
                console.log(err);
            })

        }
        getEmployees()

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
        if (firstRender2) {
            setFirstRender2(false);
            return;
        }
        setLoading(false)
    }, [workflows]);


    useEffect(async () => {

        if (user) {
            let role
            const q = query(collection(database, "users"), where("email", "==", user.data.uid));
            let sidebarData
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                role = doc.data().role
            });

            setRole(role)

        }
    }, [user])
    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>
        )
    } else {
        return (
            <>
                <div className='head' style={{ padding: '20px' }}>

                    {role && role == 'Manager' ? (
                        <>
                            <h2 >Workflows &nbsp;<Button onClick={() => setShow(true)} variant="success"><FaPlus /></Button>   <Button onClick={() => setShow5(true)} variant="success">   Manage Projects</Button> <Button onClick={() => history.push(`${path}/preset`)} variant="success">Go to Presets</Button></h2>

                        </>
                    ) : ((<>
                        <h2>Workflows</h2>
                    </>))}
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>
                        {workflows.map(({ name, description, id, tasks, started, project, outputs, inStage }) =>
                            <>
                                <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px',marginTop:'20px'}}> {project}</h5>
                                <Accordion >

                                    <Accordion.Item eventKey={id} >
                                        {role && role == 'Manager' ? (
                                            <>
                                                <Accordion.Header >{name} &nbsp;&nbsp;&nbsp;{!started ? <Button onClick={() => changeStatus(id, started, tasks, project)} variant='success'> Start </Button> : <Button onClick={() => changeStatus(id, started, tasks, project)} variant='danger' className='button-overlap'> Stop </Button>}

                                                    {inStage && (
                                                        <>
                                                            &nbsp;<Button onClick={() => moveStage(id)}>End Ongoing Stage</Button>
                                                        </>

                                                    )}
                                                    &nbsp;
                                                    <Button variant='danger' onClick={() => setDeleteId(id)}>Delete</Button>
                                                </Accordion.Header>
                                            </>
                                        ) : ((<>
                                            <Accordion.Header >{name}


                                            </Accordion.Header>
                                        </>))}



                                        <Accordion.Body>
                                            {description}
                                            <hr></hr>
                                            Tasks:
                                            <p></p>

                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Order</th>
                                                        <th>Task Name</th>
                                                        <th>Requirements</th>
                                                        <th>Approval To:</th>
                                                        <th>Assign To:</th>


                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tasks && (
                                                        <>
                                                            {tasks.map((task, index) =>

                                                                <tr key={index}
                                                                    className={task.active == true ? 'table-success' : 'table-light'}
                                                                >
                                                                    <td>{index}</td>
                                                                    <td>{task.name}</td>
                                                                    <td>
                                                                        {task.requirements ? (
                                                                            <> {task.requirements.map((item, index) => (
                                                                                <>
                                                                                    {item.value}
                                                                                    {index !== task.requirements.length - 1 && ', '}
                                                                                </>
                                                                            ))
                                                                            }</>
                                                                        ) : (
                                                                            <td style={{ color: 'blue' }}>*Manager Will assign*</td>
                                                                        )}
                                                                    </td>


                                                                    {task.approvalTo ? (<td>{task.approvalTo}</td>) : (<td>None</td>)}

                                                                    {task.assignTo === 'Employee' ?
                                                                        <td>   <Button onClick={() => assignEmployee(id, task)}>Assign Employee</Button></td>

                                                                        :
                                                                        <>
                                                                            {task.assignTo ? (
                                                                                <td>{task.assignTo}</td>
                                                                            ) : (
                                                                                <td style={{ color: 'blue' }}>*Assign at Tasks*</td>
                                                                            )}
                                                                        </>


                                                                    }

                                                                </tr>

                                                            )}

                                                        </>
                                                    )}
                                                </tbody>

                                            </Table>

                                            {outputs && (
                                                <>

                                                    <p>Outputs: </p>
                                                    <ListGroup>
                                                        {outputs.map((output, index) => (
                                                            <ListGroup.Item key={index}>{output.requirement} : <a href={output.url} target="_blank">View</a></ListGroup.Item>
                                                        ))}
                                                    </ListGroup>

                                                </>

                                            )}
                                        </Accordion.Body>

                                    </Accordion.Item>

                                </Accordion>
                               <p>          </p>
                               <p>          </p>
                            </>

                        )}
                    </div>

                </div>

                <Modal show={show} onHide={() => setShow(false)} >

                    <Modal.Header closeButton> Create a Workflow</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={createWorkflow}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Workflow Preset</Form.Label>
                                <Form.Select required onChange={(e) => setPresetId(e.target.value)} aria-label="Default select example">
                                    <option hidden value="">Select a preset...</option>
                                    {presets.map((preset, index) => (
                                        <option key={index} value={preset.id}>{preset.name}</option>
                                    ))}

                                </Form.Select>


                            </Form.Group>
                            {presetId && (
                                <>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                    >
                                        <Form.Label>Workflow Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder='Miramonti Construction Process'
                                            rows={2}
                                            name='description'
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <Form.Label>Project</Form.Label>
                                        <Form.Select
                                            required
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Project"
                                            onChange={(e) => setProject(e.target.value)}
                                        >
                                            <option hidden value="">Select Project...</option>
                                            {projects.map((project, index) => (
                                                <option key={index} value={project.name}>{project.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                </>
                            )}

                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose}>Close</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Assign Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={assignEmployeeToTask}>
                            {assignEmployeeTask && (
                                <Form.Label>{assignEmployeeTask.name}</Form.Label>
                            )}

                            <Form.Select disabled={isChecked} style={{ opacity: isChecked ? 0.5 : 1 }} onChange={(e) => setEmployee(e.target.value)} aria-label="Default select example">
                                <option value="" disabled selected>Select Employee</option>
                                {users.map((user, index) => (
                                    <option key={index} value={user.name}>{user.name} &nbsp;(Tasks: {user.tasks})</option>
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
                                <Button variant='secondary' onClick={handleClose2}>Close</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={show4} onHide={() => setShow4(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={createProject}>
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Picadelli'
                                rows={1}
                                name='name'
                                onChange={(e) => setProjectName(e.target.value)}
                            />




                            <Modal.Footer>
                                <Button variant='secondary' onClick={() => setShow4(false)}>Close</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={show5} onHide={() => setShow5(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Manage Projects</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Projects  &nbsp; <Button onClick={() => setShow4(true)} size='sm'> <FaPlus></FaPlus> &nbsp; Create Project</Button> </Form.Label>
                            <ListGroup style={{ maxHeight: '200px', overflow: 'scroll' }}>
                                {projects.map((project, index) => (
                                    <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> {project.name} <Button variant='danger'>Delete</Button></ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Modal.Footer>
                                <Button variant='secondary' onClick={() => setShow5(false)}>Close</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={show6} onHide={() => setShow6(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Stage?</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShow6(false)}>Close</Button>
                        <Button variant='danger' onClick={deleteStage}>Delete</Button>
                    </Modal.Footer>


                </Modal>


            </>

        )
    }

}

export default Home
