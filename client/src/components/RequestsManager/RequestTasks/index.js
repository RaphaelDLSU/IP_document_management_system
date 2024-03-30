
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { Toast, toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ListGroup } from 'react-bootstrap';
import { createRFI } from '../../../redux/requests/createRFI';
import { createRFA } from '../../../redux/requests/createRFA';
import moment from 'moment';
import '../RequestTasks/index.css'
import { createNotifs } from '../../../redux/notifs/createNotif';

import Spinner from 'react-bootstrap/Spinner';
import '../../../App.css'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";

const RequestTasks = () => {
    const [validated, setValidated] = useState(false);
    const dispatch = useDispatch();
    const [show5, setShow5] = useState(false);
    const [progress, setProgress] = useState(0)
    const storage = getStorage();
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState()
    const [employee, setEmployee] = useState()
    const database = getFirestore()
    const [employees, setEmployees] = useState([])
    const [response, setResponse] = useState('')
    const [actionCode, setActionCode] = useState('')
    const [disapproveResponse, setDisapproveResponse] = useState('')

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleClose3 = () => setShow3(false);
    const [isChecked, setIsChecked] = useState(false);
    const [imageButton, setImageButton] = useState([]);
    const [imageInputs, setImageInputs] = useState([]);

    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const handleSubmit = (req) => {

        setRequest(req)
        setShow(true)
    }

    const handleApprove = (req) => {

        setRequest(req)
        setShow2(true)
    }

    useEffect(async () => {
        const q = query(collection(database, "requests"),where('status','!=','done'));

        await getDocs(q).then((request) => {
            let requestsData = request.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequests(requestsData)
            setLoading(false)
            console.log(user.data.uid)
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
    const addImageInput = () => {
        setImageButton([...imageButton, { id: imageButton.length }]);
    };
    const minusInput = () => {
        const newArray = imageButton.slice(0, imageButton.length - 1);
        setImageButton(newArray);
    }

    const handleImageUpload = (index, event) => {
        // Handle image upload logic here, e.g., save the image to state or perform other actions
        const newItems = [...imageInputs, event.target.files[0]]

        setImageInputs(newItems)

    };


    const submitRequest = (e) => {
        toast.info('Submitting for Approval. Please wait..')
        e.preventDefault();
        console.log('Submitting')
        let newArray = []

        var bar = new Promise((resolve, reject) => {
            imageInputs.forEach((image, index, array) => {
                let storageRef
                if (request.type == 'RFA') {
                    storageRef = ref(storage, 'rfaImages/' + image.name);
                } else if (request.type == 'RFI') {
                    storageRef = ref(storage, 'rfaImages/' + image.name);
                }


                const uploadTask = uploadBytesResumable(storageRef, image);
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
                    },
                    () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            console.log('File available at', downloadURL)

                            newArray.push(downloadURL)
                            if (index === array.length - 1) resolve();
                        });
                    }
                );
            })
        })
        bar.then(() => {

            if (request.type == 'RFI') {
                dispatch(
                    createRFI({
                        name: request.name,
                        deadline: request.deadline,
                        project: request.project,
                        desc: request.desc,
                        images: newArray,
                        submitter: request.submitter,
                        date: request.date,
                        response: response,
                        id: request.identifier,
                        step: 2,
                        origId: request.id,
                        category:request.category
                    })
                );
            }
            else if (request.type == 'RFA') {
                dispatch(
                    createRFA({
                        name: request.name,
                        deadline: request.deadline,
                        project: request.project,
                        desc: request.desc,
                        images: newArray,
                        submitter: request.submitter,
                        date: request.date,
                        response: response,
                        id: request.identifier,
                        step: 2,
                        origId: request.id,
                        check: actionCode,
                        category:request.category
                    })
                );
            }

        });

    }

    const approveRFI = async (e) => {
        toast.info('Approving Request')
        e.preventDefault();
        if (request.assignTo == 'manager@gmail.com') {
            const requestDocRef = doc(database, "requests", request.id)
            await updateDoc(requestDocRef, {
                assignTo: 'ceo@gmail.com'
            }).then(() => {
                dispatch(createNotifs({
                    title: 'NEW REQUEST APPROVAL: ' + request.desc,
                    message: 'A Request is submitted that needs your approval.',
                    receiverID: 'ceo@gmail.com',
                    link: 'requestsmanager'
                }))
                toast.success('Assigned to CEO')
            })
        } else {
            const requestDocRef = doc(database, "requests", request.id)
            await updateDoc(requestDocRef, {
                status: 'done',
                url: request.submittedUrl
            }).then(() => {
                dispatch(createNotifs({
                    title: 'REQUEST FINISHED: ' + request.desc,
                    message: 'Your request is now finished. Please check the Requests page to view your requested output.',
                    receiverID: request.identifier,
                    link: 'requests'
                }))
                toast.success('Request Approved')
            })

            //workload minus
            const q = query(collection(database, "users"), where('email', '==', request.assignTo))
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc1) => {
                const userRef = doc(database, 'users', doc1.id)
                await updateDoc(userRef, {
                    tasks: doc1.data().tasks - 1
                })
            });

            // dispatch(
            //     addFileUser({
            //         uid: userId,
            //         parent: folderId2,
            //         data: "",
            //         name: effectFile,
            //         url: url,
            //         path: [{ id: folderId, name: workflowSnap.data().name }, { id: folderId2, name: folderId2Name }],
            //     }))
        }
    }

    const disapproveRFI = async (e) => {
        toast.info('Disapproving Request')
        e.preventDefault();
        const requestDocRef = doc(database, "requests", request.id)
        await updateDoc(requestDocRef, {
            status: 'for submission',
            assignTo: request.submitterEMail,
            disapproveReason: disapproveResponse
        }).then(() => {
            toast.success('Request Disapproved')
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
                <div className='cards-container'>
                    {requests.map((request, index) => {
                        if (user.data.uid === request.assignTo) {
                            return (
                                <>
                                    <Card className='card' border="secondary" style={{ width: '18rem' }} key={index}>
                                        <Card.Header>Type</Card.Header>
                                        <Card.Body>
                                            <Card.Title>{request.project}</Card.Title>
                                            <Card.Text>
                                                {request.desc}
                                            </Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Sumbitted by : {request.name}</ListGroup.Item>
                                            <ListGroup.Item>Deadline : {moment(request.deadline.toDate()).format('l')}</ListGroup.Item>
                                            <ListGroup.Item>Date : {moment(request.date.toDate()).format('l')}</ListGroup.Item>
                                            <ListGroup.Item>Assigned To : {request.submitter}</ListGroup.Item>

                                        </ListGroup>
                                        <Card.Body>
                                            <Card.Link  target='_blank' href={request.url}>View Request</Card.Link> &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                                            {request.status == 'for submission' && (
                                                <Button onClick={() => handleSubmit(request)} variant="primary">Submit</Button>
                                            )}
                                            {request.status == 'for approval' && (
                                                <Button onClick={() => handleApprove(request)} variant="primary">View</Button>
                                            )}

                                        </Card.Body>
                                    </Card>

                                </>
                            )




                        }
                    })
                    }
                </div>

                {/* Submit Request */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Complete Request</Modal.Title>
                    </Modal.Header>
                    <Form  onSubmit={submitRequest}>
                        <Modal.Body>


                            <Form.Label>Response to Query</Form.Label>

                            <Form.Control required onChange={(e) => setResponse(e.target.value)} as="textarea" rows={3} />
                            <Form.Label>Images <IoMdAddCircle onClick={addImageInput} />
                                {imageButton.length > 0 && (
                                    <FaMinusCircle onClick={minusInput} />
                                )}

                            </Form.Label>
                            {imageButton.map((input, index) => (

                                <Form.Control required key={input.id}
                                    accept="image/*"
                                    type="file"
                                    onChange={(event) => handleImageUpload(index, event)}
                                />
                            ))}

                            {request && request.type == 'RFA' && (
                                <>
                                    <p></p>
                                    <Form.Label>Action Code</Form.Label>
                                    <Form.Select required onChange={(e) => setActionCode(e.target.value)}>
                                        <option value="" disabled selected>Select Action Code</option>
                                        <option value='A'>A (Approved) </option>
                                        <option value='B'>B (Approved with Comments)</option>
                                        <option value='C'>C (Approved as noted)</option>
                                        <option value='D'>D (Disapproved)</option>
                                        <option value='E'>E (Revised & Resubmit)</option>

                                    </Form.Select>
                                </>

                            )}


                        </Modal.Body>
                        {request && request.disapproveReason && (
                            <Modal.Body>
                                <p>Reason for Disapproval : {request.disapproveReason}</p>
                            </Modal.Body>
                        )}

                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleClose}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* Approve Request */}
                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Approve Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={approveRFI}>

                            <Form.Label>Response to RFI</Form.Label> &nbsp;
                            {request && (
                                <Button href={request.submittedUrl}>View</Button>
                            )}

                            <p></p>

                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose2}>Close</Button>
                                <Button variant="primary" type="submit">Approve</Button>
                                <Button variant="danger" onClick={() => setShow3(true)} type="submit">Disapprove</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/*Reason for Disapproval*/}
                <Modal show={show3} onHide={handleClose3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reason for Disapproval</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={disapproveRFI}>


                            <Form.Control onChange={(e) => setDisapproveResponse(e.target.value)} as="textarea" rows={3} />


                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose3}>Close</Button>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={show5} onHide={() => setShow5(false)}>
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

export default RequestTasks

