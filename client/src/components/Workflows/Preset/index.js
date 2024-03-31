

import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { FaPlus } from "react-icons/fa";
import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';


import '../../../App.css'


const Home = () => {
    const [loading, setLoading] = useState(true)
    const database = getFirestore()
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const { path } = useRouteMatch();
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const [projects, setProjects] = useState()

    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const handleClose3 = () => setShow3(false);

    const [preset, setPreset] = useState([]);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [delPre, setDelPre] = useState('')
    const [workflowTask, setWorkflowTask] = useState({})
    const history = useHistory();
    const [approvalTo, setApprovalTo] = useState('')
    const [assignTo, setAssignTo] = useState('')

    const [createTask, setCreateTask] = useState("")

    const [users, setUsers] = useState([]);
    const [divs, setDivs] = useState([]);

    const usersRef = collection(database, "users");


    const presetRef = collection(database, "presets");

    const [presetDocRef, setPresetDocRef] = useState()
    const tasksRef = collection(database, 'tasks')

    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    const [startId, setStartId] = useState()
    const [startStarted, setStartStarted] = useState()
    const [startTasks, setStartTasks] = useState()
    const [project, setProject] = useState('')
    const createWorkflowPreset = async (e) => {
        e.preventDefault();
        toast.info('Creating Workflow Preset')
        console.log(name, desc);


        await addDoc(presetRef, {
            name: name,
            description: desc,
            tasks: [],
        }).catch(err => {
            toast.error(err)
            console.error();
        }).then(() => {
            toast.success('Preset Created')
        })
        window.location.reload()
    }


    const addWorkflowtToTask = (e) => {
        console.log('E  ' + e)
        setShow2(true)
        setPresetDocRef(doc(database, "presets", e))

    }

    const deleteWorkflowPre = (id) => {
        setShow4(true)
        setDelPre(id)
    }


    const [textBoxes, setTextBoxes] = useState([{ id: Math.random().toString(36).slice(2, 7), value: '' }]); // Initial state with one textbox

    // Function to add a new textbox
    const addTextBox = () => {
        const newId = Math.random().toString(36).slice(2, 7); // Generate unique ID
        setTextBoxes(prevTextBoxes => [...prevTextBoxes, { id: newId, value: '' }]);
    };

    // Function to remove a textbox by ID
    const removeTextBox = () => {
        const newArray = textBoxes.slice(0, textBoxes.length - 1);
        setTextBoxes(newArray);
    };

    // Function to handle changes in textbox values
    const handleTextBoxChange = (id, value) => {
        setTextBoxes(prevTextBoxes =>
            prevTextBoxes.map(textBox =>
                textBox.id === id ? { ...textBox, value: value } : textBox
            )
        );
    };

    // Function to get the values of all textboxes
    const getValues = () => {
        console.log(textBoxes);
        console.log(assignTo)
    };
    const submitTask = async (e) => {

        e.preventDefault()
        const gotDoc = await getDoc(presetDocRef)

        let updatedObject
        if (!checked3) {
            toast.info('Creating Stage')
            updatedObject = {
                ...workflowTask,
                name: name,
                active: false,
                workflow: gotDoc.id,
                workflowname: gotDoc.data().name,
                manualTasks: checked3,
                isStage: true
            };
        } else {
            toast.info('Creating Task')
            updatedObject = {
                ...workflowTask,
                name: name,
                requirements: textBoxes,
                approval: checked,
                recurring: checked2,
                approvalTo: approvalTo,
                assignTo: assignTo,
                employeeManual: checked3,
                active: false,
                workflow: gotDoc.id,
                workflowname: gotDoc.data().name,
                manualTasks: checked3,
                isStage: false

            };
        }


        e.preventDefault();

        setWorkflowTask(updatedObject)

        console.log('taksname ' + JSON.stringify(updatedObject))
        console.log('workflowTask ' + JSON.stringify(workflowTask))

        try {
            await updateDoc(presetDocRef, {
                tasks: arrayUnion(updatedObject)
            }).then(toast.success('Finished'))

            window.location.reload();
        } catch (err) {
            toast.error(err)
            console.log(err);
        }
    }

    const changeStatus = async (id, started, tasks) => {


        try {
            await updateDoc(doc(database, "workflows", id), {
                started: started
            })

            if (started) {

                const workflowRef = doc(database, "workflows", id)
                const workflow = await getDoc(workflowRef)

                console.log(workflow.data().tasks)
                const statusTask = workflow.data().tasks
                statusTask[0].active = true


                const q = query(collection(database, "users"), where('role', '==', statusTask[0].assignTo))

                const querySnapshot = await getDocs(q);


                querySnapshot.forEach(async (user) => {
                    console.log(user.id)
                    const setTasksRef = doc(database, 'tasks', statusTask[0].parentId)
                    await setDoc(setTasksRef, {
                        task: statusTask[0].name,
                        isChecked: false,
                        timestamp: serverTimestamp(),
                        deadline: 'None',
                        employee: user.data().name,
                        employeeId: user.data().email,
                        requirements: statusTask[0].requirements,
                        status: 'submission',
                        approval: statusTask[0].approval,
                        workflow: statusTask[0].workflow,
                        workflowname: workflow.data().name,
                        approvalTo: statusTask[0].approvalTo,
                        project: project
                    })




                    // doc.data() is never undefined for query doc snapshots
                });

                await updateDoc((workflowRef), {
                    tasks: statusTask
                })
            }
            if (!started) {

                const newArray = []
                const workflowRef = doc(database, "workflows", id)

                var bar = new Promise((resolve, reject) => {
                    tasks.forEach(async (tasks, index, array) => {
                        console.log('ID' + tasks.id)

                        if (tasks.active == true) {
                            await deleteDoc(doc(database, "tasks", tasks.parentId))
                            tasks.active = false
                        }

                        console.log(tasks.active)
                        newArray.push(tasks)

                        console.log('Array' + newArray)
                        if (index === array.length - 1) resolve();
                    });
                });

                bar.then(async () => {
                    await updateDoc((workflowRef), {
                        tasks: newArray
                    })
                    console.log('Array HERE: ' + JSON.stringify(newArray))

                });



            }
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    };


    const submitProject = () => {

        console.log(project)


        changeStatus(startId, startStarted, startTasks, project)
    };

    const deletePreset = async () => {
        toast.info('Deleting Preset. Please wait..')

        await deleteDoc(doc(database, "presets", delPre)).then(()=>{
            toast.success('Preset  Deleted')
        })
    };


    useEffect(() => {

        const getWorkflows = async () => {
            const q = query(presetRef)
            await getDocs(q).then((workflow) => {
                let workflowData = workflow.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setPreset(workflowData)
            }).then(() => {
                setLoading(false)
            }).catch((err) => {
                console.log(err);
            })
        }
        getWorkflows()

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
                    <h2>Presets &nbsp; <Button onClick={() => setShow(true)} variant="success"><FaPlus /></Button></h2>

                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>
                        <Accordion>
                            {preset.map(({ name, description, id, tasks, started }) =>

                                <Accordion.Item eventKey={id} >
                                    <Accordion.Header>{name}</Accordion.Header>

                                    <Accordion.Body>
                                        {description}

                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Order</th>
                                                    <th>Task Name</th>
                                                    <th>Requirements</th>
                                                    <th>Request Approval</th>
                                                    <th>Recurring</th>
                                                    <th>Approval To:</th>
                                                    <th>Assign To:</th>
                                                    <th>Manually Assign Employee?</th>

                                                </tr>
                                            </thead>
                                            {tasks && (
                                                <>
                                                    <tbody>
                                                        {tasks.map((task, id) =>

                                                            <tr key={id}>
                                                                <td>{id}</td>
                                                                <td>{task.name}</td>
                                                                <td>
                                                                    {task.requirements ? (
                                                                        <>
                                                                            {task.requirements.map((item, index) => (
                                                                                <>
                                                                                    {index ? ', ' : ''}{item.value}
                                                                                </>
                                                                            ))}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            *Stage*
                                                                        </>
                                                                    )}

                                                                </td>

                                                                {task.approval ? (<td>Yes</td>) : (<td>No</td>)}
                                                                {task.recurring ? (<td>Yes</td>) : (<td>No</td>)}
                                                                <td>{task.approvalTo}</td>
                                                                <td>{task.assignTo}</td>
                                                                {task.employeeManual ? (<td>Yes</td>) : (<td>No</td>)}

                                                            </tr>

                                                        )}
                                                    </tbody>
                                                </>
                                            )}

                                        </Table>

                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={() => addWorkflowtToTask(id)} variant='success'>Add Stage</Button>&nbsp;&nbsp;<Button onClick={() => deleteWorkflowPre(id)} variant='danger'>Add Stage</Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}
                        </Accordion>
                    </div>
                </div>


                <Modal show={show} onHide={handleClose} >

                    <Modal.Header closeButton> <Modal.Title>Create a workflow</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={createWorkflowPreset}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Workflow preset Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Schematics Process"
                                    autoFocus
                                    name='name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                            >
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    required
                                    as="textarea"
                                    placeholder='Initial process of designing a project'
                                    rows={3}
                                    name='description'
                                    onChange={(e) => setDesc(e.target.value)}
                                />

                            </Form.Group>

                            <Modal.Footer>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>



                </Modal>

                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Stage</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={submitTask}>
                        <Modal.Body>

                            <Form.Group>
                                <Form.Label>Stage Name</Form.Label>
                                <Form.Control required type='text' placeholder="Name the stage" onChange={(e) => setName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <p></p>
                            <Form.Group>
                                <Form.Check checked={checked3} onChange={() => setChecked3(!checked3)} label=' Set as a task'></Form.Check>
                            </Form.Group>
                            <p></p>
                            {checked3 && (
                                <>
                                    <Form.Group>
                                        <Form.Label>Requirements <IoMdAddCircle onClick={addTextBox} />
                                            {textBoxes.length > 0 && (
                                                <FaMinusCircle onClick={removeTextBox} />
                                            )}
                                        </Form.Label>

                                        {textBoxes.map(({ id, value }) => (
                                            <>
                                                <Form.Control required value={value} type='text' placeholder='Requirement Name' onChange={(e) => handleTextBoxChange(id, e.target.value)}></Form.Control>
                                            </>
                                        ))}
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Check checked={checked} onChange={() => setChecked(!checked)} label='Approval'></Form.Check>
                                        {checked && (
                                            <Form.Check checked={checked2} onChange={() => setChecked2(!checked2)} label='Recurring'></Form.Check>
                                        )}
                                    </Form.Group>

                                    {checked && (
                                        <>
                                            <Form.Group>
                                                <Form.Select onChange={(e) => setApprovalTo(e.target.value)} aria-label="Default select example">
                                                    <option hidden value>Request Approval to </option>
                                                    <option value="">None </option>
                                                    <option value="CEO">CEO</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Manager and CEO">Manager and CEO</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </>
                                    )}
                                    <Form.Group>
                                        <Form.Select required onChange={(e) => setAssignTo(e.target.value)} aria-label="Default select example">
                                            <option hidden value="">Assign To: </option>
                                            <option value="CEO">CEO</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Employee">Employee</option>
                                        </Form.Select>
                                    </Form.Group>

                                </>
                            )}

                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-primary" type='submit'>Create Stage</button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <Modal show={show3} onHide={() => handleClose3} >

                    <Modal.Header closeButton> Assign Project for Stage</Modal.Header>
                    <Form onSubmit={submitProject}>
                        <Modal.Body>

                            <Form.Select
                                required
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Project"
                                onChange={(e) => setProject(e.target.value)}
                            >
                                <option hidden value>Select Project...</option>
                                {projects && (
                                    <>
                                        {projects.map((project, index) => (
                                            <option key={index} value={project.name}>{project.name}</option>
                                        ))}
                                    </>
                                )}

                            </Form.Select>


                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-primary" type='submit'>Submit</button>
                        </Modal.Footer>

                    </Form>

                </Modal>
                <Modal show={show4} onHide={() => setShow4(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Stage?</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShow4(false)}>Close</Button>
                        <Button variant='danger' onClick={deletePreset}>Delete</Button>
                    </Modal.Footer>


                </Modal>
            </>

        )
    }



}

export default Home

{/* {workflows.tasks.map(({ name, description,id}) =>
            <Accordion.Item key ={id}>
                <Accordion.Header> Workflow Name</Accordion.Header>
                <Accordion.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        )} */}