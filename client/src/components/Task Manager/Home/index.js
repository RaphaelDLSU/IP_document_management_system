

import React, { useEffect, useState } from 'react'
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, getBlob } from "firebase/storage";
import { FaPlus } from "react-icons/fa";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Picker from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { addFileUser } from '../../../redux/actionCreators/filefoldersActionCreators';
import { toast } from 'react-toastify';
import TaskMonitoring from '../TaskMonitoring';
import { Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../../../App.css'
import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { createNotifs } from '../../../redux/notifs/createNotif';
import { autoAssign } from '../../../redux/workload/autoAssign';
import moment from 'moment'
import { getEstimatedHours } from '../../../redux/estimatedhours/getEstimatedHours';

const Home = () => {
    const [role, setRole] = useState();
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();
    const db = getFirestore()
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState();
    const [plan, setPlan] = useState();
    const [planCreate, setPlanCreate] = useState();
    const [hours, setHours] = useState();
    const [createTask, setCreateTask] = useState("")
    const [deadline, setDeadline] = useState("")
    const database = getFirestore()
    const collectionRef = collection(database, 'tasks')
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [show5, setShow5] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleClose3 = () => setShow3(false);
    const handleClose4 = () => setShow4(false);
    const handleShow = () => setShow(true);
    const handleShow4 = () => setShow4(true);
    const handleClose5 = () => setShow4(false);
    const [auth, setAuth] = useState()
    const [users, setUsers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [stages, setStages] = useState([]);
    const [stage, setStage] = useState('');
    const [workflowOfStage, setworkflowOfStage] = useState('');
    const [workflowIdOfStage, setworkflowIdOfStage] = useState('');
    const usersRef = collection(database, "users");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const storage = getStorage();
    const [url, setUrl] = useState('')
    const [folderId, setFolderId] = useState('')
    const [folderId2, setFolderId2] = useState('')
    const [folderId3, setFolderId3] = useState('')
    const [folderId3Name, setFolderId3Name] = useState('')
    const [folderId2Name, setFolderId2Name] = useState('')
    const [reason, setReason] = useState('')
    const [approval, setApproval] = useState('')
    const [effectFile, setEffectFile] = useState('')
    const [firstRender, setFirstRender] = useState(true);
    const [firstRender3, setFirstRender3] = useState(true);
    const [firstRender2, setFirstRender2] = useState(true);
    const [firstRender4, setFirstRender4] = useState(true);
    const [reqArray, setReqArray] = useState([])
    const [doneChecker, setDoneChecker] = useState(false)
    const [progress, setProgress] = useState(0)
    const [project, setProject] = useState('')
    const [inputs, setInputs] = useState([]);
    const [projects, setProjects] = useState([])
    const [selectedStages, setSelectedStages] = useState([])
    const [autoEmployee, setAutoEmployee] = useState()
    const [autoEmployeeID, setAutoEmployeeID] = useState()
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const [selectedOption, setSelectedOption] = useState(null);

    //Query the collection
    useEffect(() => {
        const getTasks = async () => {
            // const q = query(collectionRef, orderBy('task', 'asc'))
            const q = query(collectionRef, orderBy('timestamp'))
            await getDocs(q).then((tasks) => {
                let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setTasks(tasksData)

            }).catch((err) => {
                console.log(err);
            })
        }
        getTasks()
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

        const getPlans = async () => {
            const q = query(collection(database, 'plans'))
            await getDocs(q).then((plan) => {
                let plansData = plan.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setPlans(plansData)
            }).catch((err) => {
                console.log(err);
            })
        }
        getPlans()

        const getStages = async () => {
            const q = query(collection(database, 'stages'))
            await getDocs(q).then((stages) => {
                let stagesData = stages.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setStages(stagesData)

            }).catch((err) => {
                console.log(err);
            })

        }
        getStages()

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

    useEffect(() => {

        if (project) {
            const getStages = async () => {
                const q = query(collection(database, 'stages'), where("project", '==', project))
                await getDocs(q).then((stages) => {
                    let stagesData = stages.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    setSelectedStages(stagesData)

                }).catch((err) => {
                    console.log(err);
                })

            }
            getStages()
        }

    }, [project])

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

    //Add Task Handler
    const submitTask = async (e) => {

        e.preventDefault();
        toast.info('Creating Task. Please wait')
        console.log('INPUTS' + JSON.stringify(inputs))
        for (const input of inputs) {
            console.log('here')
            const taskRef = collection(database, "tasks");
            let q
            if (input.employee == 'Automatic') {
                console.log('here 2')
                //workload algorithm
                for (let i = 0; i < 30; i++) {
                    let r = query(collection(database, "users"), where('tasks', '==', i), where('role', '==', 'Employee'))
                    const querySnapshots = await getDocs(r)
                    if (!querySnapshots.empty) {
                        querySnapshots.forEach((user) => {
                            q = query(collection(database, "users"), where('name', '==', user.data().name))
                        })
                        break
                    }
                }

            } else {
                console.log('here 3')
                q = query(collection(database, "users"), where("email", "==", input.employee));
            }


            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (user) => {

                console.log('here 4')

                let isApproval = true
                if (approval == '') {
                    isApproval = false
                }
                const [year, month, day] = deadline.split("-");
                const date = new Date(year, month - 1, day);
                const timestamp = date.getTime();
                const timestampReal = new Date(timestamp)

                const estHours = dispatch(getEstimatedHours({
                    startDate: new Date(),
                    endDate: timestampReal
                }))

                estHours.then(async (estDeadline) => {
                    await addDoc(taskRef, {
                        approval: isApproval,
                        approvalTo: approval,
                        employee: user.data().name,
                        employeeId: user.data().email,
                        project: project,
                        requirements: [{ value: input.requirement, id: Math.random().toString(36).slice(2, 7) }],
                        status: 'for submission',
                        task: plan,
                        timestamp: new Date(),
                        stage: stage,
                        hours: estDeadline,
                        deadline: timestampReal,
                        workflowname: workflowOfStage,
                        workflow: workflowIdOfStage,
                        isFinalTask: isChecked
                    }).then(() => {
                        dispatch(createNotifs({
                            title: 'NEW TASK: ' + plan + ' ' + input.requirement,
                            message: 'You have been been submitted a task. Please check the Tasks Manager Page for more information ',
                            receiverID: user.data().email,
                            link: 'tasks'
                        }))
                        toast.success('Task Created!')
                    })
                })


                //workload algorithm
                await updateDoc(doc(database, "users", user.id), {
                    tasks: user.data().tasks + 1
                })
            });

        }

    }
    //Delete Handler

    const [reqs, setReqs] = useState([])
    const submitRequirements = (task) => {


        setReqs(task.requirements)
        setTask(task)
        setShow2(true)
        console.log('Task: ' + JSON.stringify(reqs))


    }
    const handleUploadReq = (e, req) => {
        e.preventDefault();
        const somethingFiles = e.target.files;
        const object = {
            file: somethingFiles,
            req: req,
            task: task.id
        }
        const iterableArray = [object]
        setSelectedFiles([...selectedFiles, ...iterableArray]);
    }

    const restartReq = () => {

        console.log('Restarting REQ')

        setSelectedFiles([])
        setShow2(false)
    }

    const handleSubmitReq = async () => {
        selectedFiles.forEach((selectedFile, index) => {
            console.log('SELECTED FILES: ' + JSON.stringify(selectedFiles))
            Array.from(selectedFile.file).forEach(async file => {

                const metadata = {
                    task: task.id,
                    req: selectedFile.req.value
                };

                if (task.approval) {
                    toast.info('Submitting to the Manager for Approval')

                    console.log('WITH APPROVAL')
                    const storageRef = ref(storage, 'approvalfiles/' + selectedFile.req.id + '/' + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
                    setShow5(true)
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(progress)
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    break;
                                case 'storage/canceled':
                                    break;
                                case 'storage/unknown':
                                    break;
                            }
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                console.log('File available at', downloadURL);
                                setUrl(downloadURL)
                                setDoneChecker(true)
                                let newObject = {
                                    id: selectedFile.req.id,
                                    value: selectedFile.req.value,
                                    url: downloadURL,
                                    filePath: 'approvalfiles/' + selectedFile.req.id + '/' + file.name,
                                    fileName: file.name
                                }
                                toast.success('Submitted')
                                setShow5(false)
                                setReqArray([...reqArray, newObject])
                            });
                        }
                    );

                    let approver = ''

                    if (task.approvalTo == 'Manager') {
                        approver = 'manager@gmail.com'
                    } else if (task.approvalTo == 'CEO') {
                        approver = 'ceo@gmail.com'
                    } else if (task.approvalTo == 'Manager and CEO') {
                        approver = 'manager@gmail.com'
                    }
                    let orig = task.employeeId
                    const taskRef = doc(database, "tasks", task.id);
                    await updateDoc(taskRef, {
                        employeeId: approver,
                        status: 'for approval',
                        origUser: orig
                    }).then(() => {
                        dispatch(createNotifs({
                            title: 'NEW TASK: Approve ' + task.task + ' ' + task.requirements[0].value,
                            message: 'You have been been submitted a task for approval by ' + task.employee + '. Please check the Tasks Manager Page for more information ',
                            receiverID: approver,
                            link: 'tasks'
                        }))
                    })

                } else {
                    console.log('WITH NO APPROVAL')
                    const storageRef = ref(storage, 'storedFiles/' + selectedFile.req.id + '/' + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
                    let workflowRef

                    if (task.workflow) {
                        workflowRef = doc(database, "workflows", task.workflow)
                    }
                    if (task.isFinalTask) {
                        dispatch(createNotifs({
                            title: 'FINAL TASK SUBMITTED: ' + task.task + ' ' + task.requirements[0].value,
                            message: 'The Final Task indicated for ' + task.task + 'is submitted by ' + task.employee + '. Please check the Workflows page for the output/s',
                            receiverID: 'manager@gmail.com',
                            link: 'workflows'
                        }))
                    }

                    dispatch(createNotifs({
                        title: 'TASK FINISHED: ' + task.task + ' ' + task.requirements[0].value,
                        message: 'A Task assigned to ' + task.employee + ' for the project ' + task.project + ' has been submitted and uploaded to the Files page.',
                        receiverID: 'manager@gmail.com',
                        link: 'files'
                    }))


                    let urlUpdate
                    setShow5(true)
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(progress)

                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                // ...
                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                        },
                        async () => {
                            // Upload completed successfully, now we can get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                console.log('File available at', downloadURL);
                                setUrl(downloadURL)
                                urlUpdate = url
                                if (task.workflow) {
                                    let reqOutput
                                    if (task.stage) {
                                        reqOutput = task.stage + ': ' + selectedFile.req.value
                                    } else {
                                        reqOutput = selectedFile.req.value
                                    }

                                    await updateDoc(workflowRef, {
                                        outputs: arrayUnion({ url: downloadURL, requirement: reqOutput })
                                    })
                                }
                                let newObject = {
                                    id: selectedFile.req.id,
                                    value: selectedFile.req.value,
                                    url: downloadURL,
                                    filePath: 'storedFiles/' + selectedFile.req.id + '/' + file.name,
                                    fileName: file.name
                                }
                                toast.info('Uploaded. Please wait..')
                                setReqArray([...reqArray, newObject])
                                setShow5(false)

                            });


                            const docsRef = collection(database, "docs");
                            const q = query(docsRef, where("name", "==", task.project), where("project", '==', task.project));
                            const querySnapshot = await getDocs(q);
                            querySnapshot.forEach((doc) => {
                                console.log('HEREEEEE' + doc.id, " => ", doc.data());
                            });
                            if (querySnapshot.empty) {
                                console.log('CREATING FOLDER')
                                await addDoc(collection(database, 'docs'), {
                                    createdAt: new Date(),
                                    createdBy: task.project,
                                    lastAccessed: new Date(),
                                    name: task.project,
                                    parent: '',
                                    path: [],
                                    updatedAt: new Date(),
                                    project: task.project,
                                })
                            }

                            let folderParent
                            const q1 = query(collection(database, "docs"), where("name", "==", task.project));

                            const querySnapshot1 = await getDocs(q1);
                            querySnapshot1.forEach((doc) => {
                                folderParent = doc.id
                            });

                            let f
                            let folderName
                            if (task.isRequest) {
                                dispatch(createNotifs({
                                    title: 'REQUEST FINISHED: ' + task.task + ' ' + task.requirements[0].value,
                                    message: 'Your request has been finished by ' + task.employeeId + '. Please go to the Requests page to view your requested output',
                                    receiverID: task.requestor,
                                    link: 'requests'
                                }))
                                f = query(docsRef, where("name", "==", 'Task Requests'), where('parent', '==', folderParent));
                                folderName = 'Task Requests'
                            } else if (!task.workflowname) {
                                f = query(docsRef, where("name", "==", 'Miscellaneous'), where('parent', '==', folderParent));
                                folderName = 'Miscellaneous'
                            } else {
                                f = query(docsRef, where("name", "==", task.workflowname), where('parent', '==', folderParent));
                                folderName = task.workflowname
                            }

                            const d = query(docsRef, where("name", "==", task.project));
                            const querySnapshot3 = await getDocs(f);
                            const querySnapshot4 = await getDocs(d);
                            querySnapshot4.forEach(async (doc) => {
                                if (querySnapshot3.empty) {
                                    console.log('CREATING FOLDER 2')
                                    await addDoc(collection(database, 'docs'), {
                                        createdAt: new Date(),
                                        createdBy: task.project,
                                        lastAccessed: new Date(),
                                        name: folderName,
                                        parent: doc.id,
                                        path: [{ id: doc.id }],
                                        updatedAt: new Date(),
                                        project: task.project,
                                    })
                                }
                            });
                            setEffectFile(file.name)
                            const querySnapshot2 = await getDocs(q)
                            if (querySnapshot2.empty) {
                                console.log('empty')
                            }
                            const g = query(docsRef, where("name", "==", folderName));
                            const querySnapshot5 = await getDocs(g);
                            querySnapshot5.forEach((doc) => {
                                setFolderId2(doc.id)
                                setFolderId2Name(doc.data().name)
                            });

                            var promise = new Promise((resolve, reject) => {
                                console.log('In promise')
                                querySnapshot2.forEach((doc) => {
                                    console.log('In promise for each')
                                    setFolderId(doc.id)
                                });
                                resolve();
                            })
                        }
                    );
                }
            });
        }
        )



    }

    const viewSubmission = (task) => {

        setReqs(task.requirements)
        setTask(task)
        setShow2(true)
        console.log('Task: ' + JSON.stringify(reqs))

    }


    const approveSubmission = async () => {
        if (task.approvalTo == 'Manager and CEO' && task.employeeId == 'manager@gmail.com') {
            toast.info('Giving approval to CEO')
            const taskRef = doc(database, "tasks", task.id);
            await updateDoc(taskRef, {
                employeeId: 'ceo@gmail.com',
            }).then(() => {
                dispatch(createNotifs({
                    title: 'NEW TASK: Approve ' + task.task + ' ' + task.requirements[0].value,
                    message: 'A new task was submitted by ' + task.employee + '. Please review this on the Tasks Manager Page',
                    receiverID: 'ceo@gmail.com',
                    link: 'tasks'
                }))
                toast.success('Approval Given to CEO')
            });
        } else {
            console.log('Approving Submission')

            let message
            if (!task.recurring) {
                message = 'Your Sumbission has been accepted by the ' + task.approvalTo + '. Thank you for you cooperation with the team!'
            } else {
                message = 'Your Sumbission has been accepted by the ' + task.approvalTo + '. Since the task is recurring, please check the tasks manager for more needed submissions. Thank you for your cooperation with the team!'
            }

            dispatch(createNotifs({
                title: 'SUBMISSION APPROVED: ' + task.task + ' ' + task.requirements[0].value,
                message: message,
                receiverID: task.origUser,
                link: 'tasks'
            }))

            if (task.isFinalTask) {
                dispatch(createNotifs({
                    title: 'FINAL TASK SUBMITTED: ' + task.task + ' ' + task.requirements[0].value,
                    message: 'The Final Task indicated for ' + task.task + 'is submitted by ' + task.employee + '. Please check the Workflows page for the output/s',
                    receiverID: 'manager@gmail.com',
                    link: 'workflows'
                }))
            }

            toast.info('Finishing Approval')

            reqs.forEach(async req => {


                const storageRef = ref(storage, 'storedFiles/' + req.id + '/' + req.fileName);
                const blobRef = ref(storage, req.filePath);

                let blobObj




                getBlob(blobRef).then((blob) => {
                    console.log('BLOB' + blob)
                    blobObj = blob


                    const metadata = {
                        task: task.id,
                        req: req.value
                    };
                    console.log('BLOB2' + blobObj)
                    const uploadTask = uploadBytesResumable(storageRef, blobObj, metadata);

                    let workflowRef
                    if (task.workflow != '') {
                        workflowRef = doc(database, "workflows", task.workflow);
                    }




                    let urlUpdate
                    setShow5(true)
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(progress)
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    break;
                                case 'storage/canceled':
                                    break;
                                case 'storage/unknown':
                                    break;
                            }
                        },
                        async () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                console.log('File available at', downloadURL);
                                setUrl(downloadURL)
                                await updateDoc(doc(database, 'tasks', task.id), {
                                    url: downloadURL
                                })
                                urlUpdate = url
                                if (task.workflow != '') {
                                    let reqOutput
                                    if (task.stage) {
                                        reqOutput = task.stage + ': ' + req.value
                                    } else {
                                        reqOutput = req.value
                                    }

                                    // Outputs workflow
                                    await updateDoc(workflowRef, {
                                        outputs: arrayUnion({ url: downloadURL, requirement: reqOutput })

                                    }).then(() => {
                                        setShow5(false)
                                    })
                                }



                            });
                            const docsRef = collection(database, "docs");


                            const q = query(docsRef, where("name", "==", task.project), where("project", '==', task.project));
                            const querySnapshot = await getDocs(q);
                            if (querySnapshot.empty) {
                                console.log('CREATING FOLDER')
                                await addDoc(collection(database, 'docs'), {
                                    createdAt: new Date(),
                                    createdBy: task.workflow,
                                    lastAccessed: new Date(),
                                    name: task.project,
                                    parent: '',
                                    path: [],
                                    updatedAt: new Date(),
                                    project: task.project,
                                })

                            }
                            let folderParent
                            const q1 = query(collection(database, "docs"), where("name", "==", task.project));

                            const querySnapshot1 = await getDocs(q1);
                            querySnapshot1.forEach((doc) => {
                                folderParent = doc.id
                            });

                            let f
                            let folderName
                            if (task.isRequest) {
                                f = query(docsRef, where("name", "==", 'Task Requests'), where('parent', '==', folderParent));
                                folderName = 'Task Requests'
                            } else if (task.workflowname == '' || !task.workflowname) {
                                f = query(docsRef, where("name", "==", 'Miscellaneous'), where('parent', '==', folderParent));
                                folderName = 'Miscellaneous'
                            } else {
                                f = query(docsRef, where("name", "==", task.workflowname), where('parent', '==', folderParent));
                                folderName = task.workflowname
                            }

                            const d = query(docsRef, where("name", "==", task.project));
                            const querySnapshot3 = await getDocs(f);
                            const querySnapshot4 = await getDocs(d);
                            querySnapshot4.forEach(async (doc) => {


                                if (querySnapshot3.empty) {
                                    console.log('CREATING FOLDER 2')
                                    await addDoc(collection(database, 'docs'), {
                                        createdAt: new Date(),
                                        createdBy: task.workflow,
                                        lastAccessed: new Date(),
                                        name: folderName,
                                        parent: doc.id,
                                        path: [{ id: doc.id }],
                                        updatedAt: new Date(),
                                        project: task.project,
                                    })

                                }
                            });
                            setEffectFile(req.fileName)
                            const querySnapshot2 = await getDocs(q)
                            const g = query(docsRef, where("name", "==", folderName));
                            const querySnapshot5 = await getDocs(g);
                            querySnapshot5.forEach((doc) => {
                                setFolderId2(doc.id)
                                setFolderId2Name(doc.data().name)
                            });

                            var promise = new Promise((resolve, reject) => {
                                console.log('In promise')
                                querySnapshot2.forEach((doc) => {
                                    console.log('In promise for each')
                                    setFolderId(doc.id)
                                });
                                resolve();
                            })
                        }
                    );


                })

            }
            );
        }



    }
    const rejectSubmission = async (e) => {
        e.preventDefault();
        toast.info('Rejecting Submission. Please wait..')

        const taskRef = doc(database, "tasks", task.id);
        const docSnap = await getDoc(taskRef);

        await updateDoc(taskRef, {
            status: 'for submission',
            employeeId: docSnap.data().origUser,
            reason: reason
        }).then(() => {
            toast.success('Disapproval Complete')
            dispatch(createNotifs({
                title: 'SUBMISSION DISAPPROVED: ' + task.task + ' ' + task.requirements[0].value,
                message: 'Your submission has been disapproved. Please check the Tasks page for the reason for disapproval and for other comments.',
                receiverID: task.origUser,
                link: 'tasks'
            }))
        })




    }
    const createPlan = async () => {


        console.log('INSIDE CREATE PLAN')
        toast.info('Creating Plan. Please Wait')

        const planRef = doc(collection(database, "plans"));

        await setDoc(planRef, {
            name: planCreate,
            project: project
        });

        window.location.reload()

    }

    const addInput = () => {
        setInputs([...inputs, { requirement: '', employee: '' }]);
    };

    const minusInput = () => {
        const newArray = inputs.slice(0, inputs.length - 1);
        setInputs(newArray);
    }
    const handleTextboxChange = (index, event) => {
        const newInputs = [...inputs];
        newInputs[index].requirement = event.target.value;
        setInputs(newInputs);
    };

    const handleDropdownChange = (index, event) => {
        if (event.target.value == 'Automatic') {
            setIsChecked2(true)
            const employee = dispatch(autoAssign({}))
            employee.then(async (employeeId) => {
                const employeeRef = await getDoc(doc(database, 'users', employeeId))
                const newInputs = [...inputs];
                newInputs[index].employee = employeeRef.data().email;
                console.log('employee = ' + event.target.value)
                setInputs(newInputs);
                setIsChecked2(false)
            })
        } else {
            setIsChecked2(false)
            const newInputs = [...inputs];
            newInputs[index].employee = event.target.value;

            console.log('employee = ' + event.target.value)

            setInputs(newInputs);
        }
    };

    const setStageAndWorkflow = async (stageId) => {

        if (stageId != 'None') {
            const docRef = doc(database, "stages", stageId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log(docSnap.data().task)
                setStage(docSnap.data().task)
                setworkflowOfStage(docSnap.data().workflowname)
                setworkflowIdOfStage(docSnap.data().workflow)
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }




    };

    const approveAndEndSubmission = (task) => {

    }


    useEffect(() => {
        console.log('SELECTED FILES:' + JSON.stringify(selectedFiles));
    }, [selectedFiles]);

    useEffect(async () => {
        if (firstRender2) {
            setFirstRender2(false);
            return;
        }

        console.log('URL :' + url)
        console.log('REQ ARRAY: ' + JSON.stringify(reqArray))
        if (reqArray != []) {
            const taskRef = doc(database, "tasks", task.id);
            await updateDoc(taskRef, {
                requirements: reqArray
            });
        }
    }, [reqArray]);

    useEffect(async () => {

        if (firstRender) {
            setFirstRender(false);
            return;
        }

        console.log('Inside folderid useeffect' + task.stage)

        const docRef = doc(database, "docs", folderId);


        const workflowSnap = await getDoc(docRef)

        if (task.stage) {
            const docsRef = collection(database, "docs")
            const q = query(docsRef, where("name", "==", task.stage), where("project", '==', task.project));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log('CREATING FOLDER 3')
                await addDoc(collection(database, 'docs'), {
                    createdAt: new Date(),
                    createdBy: task.workflow,
                    lastAccessed: new Date(),
                    name: task.stage,
                    parent: folderId2,
                    path: [{ id: folderId, name: workflowSnap.data().name }, { id: folderId2, name: folderId2Name }],
                    updatedAt: new Date(),
                    project: task.project,
                }).then(async (docRef) => {

                    setFolderId3(docRef.id)
                    setFolderId3Name(task.stage)
                })
            } else {
                querySnapshot.forEach((data) => {
                    setFolderId3(data.id)
                    setFolderId3Name(data.data().stage)
                })

            }

        } else {


            if (task.workflow) {

                const workflowRef = doc(database, "workflows", task.workflow);
                const docSnap = await getDoc(workflowRef);

                let isTaskActive = false
                let endWorkflow = true
                let done = false
                let updateTaskArray = []

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
                                    title: 'NEW TASK: ' + task1.task + ' ' + task1.requirements[0].value,
                                    message: 'You have been assigned to a new task. Please check the Tasks Manager Page for more information ',
                                    receiverID: user.data().email,
                                    link: 'tasks'
                                }))
                                const dateDeadline = new Date();
                                dateDeadline.setDate(dateDeadline.getDate() + 3);
                                await setDoc(setTasksRef, {
                                    task: task1.name,
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
                                    project: task.project,
                                    hours:40
                                })
                            })
                        } else {
                            await setDoc(stageRef, {
                                task: task1.name,
                                workflow: task1.workflow,
                                workflowname: task1.workflowname,
                                project: task.project
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
                                project: task.project
                            })
                        } else {
                            updateTaskArray.push({
                                active: true,
                                manualTasks: task1.manualTasks,
                                name: task1.name,
                                parentId: task1.parentId,
                                workflow: task1.workflow,
                                workflowname: task1.workflowname,
                                project: task.project
                            })

                            await deleteDoc(doc(database, 'stages', task1.parentId))
                        }
                    }

                    //make inactive task active
                    if (done && isTaskActive) {
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
            }

            if (!task.recurring) {
                await updateDoc(doc(database, "tasks", task.id), {
                    status: 'done'
                });

                //workload minus
                const q = query(collection(database, "users"), where('email', '==', task.employeeId))
                const querySnapshot = await getDocs(q);


                querySnapshot.forEach(async (doc1) => {
                    console.log('EMPLOYEE ID: ' + doc1.id)
                    await updateDoc(doc(database, 'users', doc1.id), {
                        tasks: doc1.data().tasks - 1
                    })
                });
            } else {
                await updateDoc(doc(database, "tasks", task.id), {
                    assignTo: task.origUser,
                    status: 'for submission'
                });
            }


            dispatch(
                addFileUser({
                    uid: userId,
                    parent: folderId2,
                    data: "",
                    name: effectFile,
                    url: url,
                    path: [{ id: folderId, name: workflowSnap.data().name }, { id: folderId2, name: folderId2Name }],
                })
            )
            toast('FINISHED')
        }


    }, [folderId]);

    useEffect(async () => {
        if (firstRender4) {
            setFirstRender4(false);
            return;
        }
        const docRef = doc(database, "docs", folderId);


        const workflowSnap = await getDoc(docRef)




        if (!task.recurring) {
            await updateDoc(doc(database, "tasks", task.id), {
                status: 'done'
            });

            //workload minus
            const q = query(collection(database, "users"), where('email', '==', task.employeeId))
            const querySnapshot = await getDocs(q);


            querySnapshot.forEach(async (doc1) => {
                console.log('EMPLOYEE ID: ' + doc1.id)
                await updateDoc(doc(database, 'users', doc1.id), {
                    tasks: doc1.data().tasks - 1
                })
            });
        } else {
            await updateDoc(doc(database, "tasks", task.id), {
                assignTo: task.origUser,
                status: 'for submission'
            });
        }

        dispatch(
            addFileUser({
                uid: userId,
                parent: folderId3,
                data: "",
                name: effectFile,
                url: url,
                path: [{ id: folderId, name: workflowSnap.data().name }, { id: folderId2, name: folderId2Name }, { id: folderId3, name: folderId2Name }],
            })
        )


        setShow5(false)
        toast('FINISHED')


    }, [folderId3])

    useEffect(async () => {
        if (firstRender3) {
            setFirstRender3(false);
            return;
        }
        setLoading(false)
    }, [tasks]);


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

                    {role && role == 'Manager' ? (
                        <>
                            <h2>Task Manager &nbsp; <Button onClick={() => setShow(true)}><FaPlus /></Button></h2>
                        </>
                    ) : (<>
                        <h2>Task Manager</h2>
                    </>)}

                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>

                        <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Pending Tasks</h5>
                        <p></p>
                        <div className='cards-container'>
                            {tasks.map((task, index) => {
                                if (user.data.uid === task.employeeId && task.status != 'done' && !task.manualTasks) {
                                    return (
                                        <>
                                            {task.status == 'for submission' && (
                                                <>

                                                    <Card className='card' border="secondary" style={{ width: '18rem' }} key={index}>
                                                        <Card.Header>{task.project}</Card.Header>
                                                        <Card.Body>
                                                            <Card.Title>{task.task}</Card.Title>
                                                            <Card.Text>
                                                                Requirements: &nbsp;
                                                                {task.requirements.map((req, index) => (
                                                                    <>
                                                                        {req.value}
                                                                        {index !== task.requirements.length - 1 && ', '}
                                                                    </>
                                                                ))}
                                                            </Card.Text>

                                                        </Card.Body>
                                                        <ListGroup className="list-group-flush">
                                                            <ListGroup.Item>Deadline : {moment(task.deadline.toDate()).format('l')}</ListGroup.Item>
                                                            <ListGroup.Item>Date : {moment(task.timestamp.toDate()).format('l')}</ListGroup.Item>
                                                            <ListGroup.Item>Assigned To : {task.employee}</ListGroup.Item>
                                                            {task.reason && (
                                                                <>
                                                                    <ListGroup.Item style={{ color: 'red' }}>Reason for Disapproval : {task.reason}</ListGroup.Item>
                                                                </>

                                                            )}
                                                        </ListGroup>
                                                        <Card.Body>
                                                            {task.status === 'for submission' ?
                                                                <Button variant="primary" onClick={() => submitRequirements(task)}>Submit</Button>
                                                                :
                                                                <Button variant="primary" onClick={() => viewSubmission(task)}>View</Button>
                                                            }
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            )}

                                        </>
                                    )
                                }
                            }
                            )}
                        </div>
                        {(user.data.uid == "manager@gmail.com" || user.data.uid == 'ceo@gmail.com') && (
                            <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Pending Approvals</h5>
                        )}

                        <p></p>
                        <div className='cards-container'>
                            {tasks.map((task, index) => {
                                if (user.data.uid === task.employeeId && task.status != 'done' && !task.manualTasks) {
                                    return (
                                        <>
                                            {task.status == 'for approval' && (
                                                <>

                                                    <Card className='card' border="secondary" style={{ width: '18rem' }} key={index}>
                                                        <Card.Header>{task.project}</Card.Header>
                                                        <Card.Body>
                                                            <Card.Title>{task.task}</Card.Title>
                                                            {task.status === 'for submission' ?
                                                                <Button variant="primary" onClick={() => submitRequirements(task)}>Submit</Button>
                                                                :
                                                                <Button variant="primary" onClick={() => viewSubmission(task)}>View</Button>
                                                            }
                                                        </Card.Body>
                                                        <ListGroup className="list-group-flush">
                                                            <ListGroup.Item>Deadline : {moment(task.deadline.toDate()).format('l')}</ListGroup.Item>
                                                            <ListGroup.Item>Date : {moment(task.timestamp.toDate()).format('l')}</ListGroup.Item>
                                                            <ListGroup.Item>Assigned To : {task.employee}</ListGroup.Item>
                                                        </ListGroup>
                                                    </Card>

                                                </>
                                            )}

                                        </>
                                    )
                                }
                            }
                            )}
                        </div>




                        <h5 style={{ backgroundColor: '#146C43', color: 'white', padding: '15px', borderRadius: '5px' }}> Tasks Records</h5>
                        <p></p>
                        <TaskMonitoring></TaskMonitoring>

                        <h5> Ongoing Stages</h5>
                        <p></p>
                        <ListGroup horizontal>
                            {stages.map((stage, index) => (

                                <ListGroup.Item key={index} variant="success">{stage.project}: &nbsp;{stage.task}</ListGroup.Item>
                            ))}

                        </ListGroup>
                    </div>

                </div >

                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Task</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={submitTask}>
                        <Modal.Body>

                            <Form.Group>
                                <Form.Label> Select Project</Form.Label>
                                <Form.Select required onChange={(e) => setProject(e.target.value)}>
                                    <option hidden value="">Select Project...</option>
                                    {projects.map((project, index) => (
                                        <option key={index} value={project.name}>{project.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            {project != '' && (
                                <>
                                    <Form.Group>
                                        <Form.Label> Select Stage</Form.Label>
                                        <Form.Select required onChange={(e) => setStageAndWorkflow(e.target.value)}>
                                            <option value="" disabled selected hidden>Select Stage</option>
                                            <option value="None" >None</option>
                                            {selectedStages.map((stage, index) => (
                                                <option key={index} value={stage.id}>
                                                    {stage.task}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label> Select Plan &nbsp;<IoMdAddCircle onClick={() => setShow4(true)} /> </Form.Label>
                                        <Form.Select required onChange={(e) => setPlan(e.target.value)}>
                                            <option value="" disabled selected hidden>Select Plan </option>
                                            {plans.map((plan, index) => (
                                                <>
                                                    {plan.project == project && (
                                                        <option key={index} value={plan.name}>
                                                            {plan.name}
                                                        </option>
                                                    )}
                                                </>

                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Requirements <IoMdAddCircle onClick={addInput} />
                                            {inputs.length > 0 && (
                                                <FaMinusCircle onClick={minusInput} />
                                            )}

                                        </Form.Label>
                                        {inputs.map((input, index) => (
                                            <>
                                                <Form.Group className="mb-3" as={Row}>
                                                    <Col sm='6'>
                                                        <Form.Control column type="text" value={input.requirement} onChange={(event) => handleTextboxChange(index, event)} placeholder="Add Description" />
                                                    </Col>
                                                    <Col sm='6'>
                                                        <Form.Select required value={input.employee} onChange={(event) => handleDropdownChange(index, event)}>
                                                            <option value="" disabled selected hidden>Select Employee </option>
                                                            <option value="Automatic">Automatic</option>
                                                            {users.map((users, index) => (
                                                                users.role === 'Employee' && (
                                                                    <option key={index} value={users.email}>
                                                                        {users.name} &#40;Tasks: {users.tasks}&#41;
                                                                    </option>
                                                                )

                                                            ))}
                                                        </Form.Select>
                                                        {!input.employee && isChecked2 && (
                                                            <Form.Label>Assigning Employee. Please Wait.</Form.Label>
                                                        )}
                                                    </Col>
                                                </Form.Group>

                                            </>
                                        ))}
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Set Deadline</Form.Label>
                                        <Form.Control required onChange={(e) => setDeadline(e.target.value)} type="date" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Set Approval</Form.Label>
                                        <Form.Select required onChange={(e) => setApproval(e.target.value)}>
                                            <option value="" disabled selected hidden>Select Approval Method</option>
                                            <option value="">None</option>
                                            <option value="Manager and CEO">Manager and CEO</option>
                                            <option value="Manager">Manager</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {stage && (
                                        <Form.Group>

                                            <Form.Check
                                                label='Final Task'
                                                checked={isChecked}
                                                onChange={(e) => setIsChecked(e.target.checked)}

                                            />
                                        </Form.Group>
                                    )}

                                </>
                            )}

                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-primary" type='submit'>Create Task</button>
                        </Modal.Footer>
                    </Form>
                </Modal >
                <Modal show={show2} onHide={restartReq} >
                    {task && task.status === 'for submission' ?
                        <Modal.Header closeButton> Submit Requirements</Modal.Header> :
                        <Modal.Header closeButton> Approve Submission</Modal.Header>}
                    <Form>
                        <Modal.Body>

                            {reqs.map((req, index) =>
                                <>
                                    <Form>

                                        <Form.Group className="mb-3" controlId="formPlaintextEmail">
                                            <Form.Label >
                                                {req.value}
                                            </Form.Label>
                                            &nbsp;&nbsp;&nbsp;

                                            {task.status === 'for submission' ?
                                                <Form.Control required type="file" onChange={(e) => handleUploadReq(e, req)} />
                                                :
                                                <Button href={req.url} target="_blank">View </Button>}

                                        </Form.Group>


                                    </Form>

                                </>
                            )}
                            <Modal.Footer>
                                {task && task.status === 'for submission' ? <Button variant="primary" onClick={handleSubmitReq}>Submit</Button> : (<><Button variant="primary" onClick={() => approveSubmission(task)}>Approve</Button><Button variant="danger" onClick={() => setShow3(true)}>Decline</Button></>)}

                                {task && task.status === 'for approval' && task.recurring === true && <Button onClick={() => approveAndEndSubmission(task)} >Approve and End </Button>}
                            </Modal.Footer>

                        </Modal.Body>
                    </Form>
                </Modal >

                <Modal show={show3} onHide={handleClose3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reason for Disapproval</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={rejectSubmission}>
                        <Modal.Body>
                            <Form.Control
                                required
                                as='textarea'
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" type='submit'>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>

                </Modal>

                <Modal show={show4} onHide={handleClose4}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Plan for {project}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={createPlan}>
                        <Modal.Body>
                            <Form.Label >Plan Name</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                onChange={(e) => setPlanCreate(e.target.value)}
                            />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" onClick={() => createPlan()}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>

                </Modal>

                <Modal show={show5} onHide={handleClose5}>
                    <Modal.Header>
                        <Modal.Title>Progress</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProgressBar now={progress} />

                        {progress == 100 && (
                            <p>Done! Please wait a little bit more...</p>
                        )}
                    </Modal.Body>

                </Modal>
            </>
        )
    }


}
export default Home
