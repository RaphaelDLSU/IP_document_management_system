
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";



import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { registerUser } from '../../../redux/actionCreators/authActionCreators';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from 'react-bootstrap/Spinner';
import { AES, enc } from 'crypto-js';


import '../../../App.css'

const Home = () => {

    const [error, setError] = useState("");
    const [registrations, setRegistrations] = useState([])
    const [registration, setRegistration] = useState()
    const [loading, setLoading] = useState(true)
    const database = getFirestore()
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();

    const viewRegistration = (registration) => {
        setShow(true)
        setRegistration(registration)
    }

    const approveRegistration = async () => {
        let bytes
        bytes = AES.decrypt(registration.password, "test_key");
        const decrypted = bytes.toString(enc.Utf8);


        toast.info('Approving Registration. Please wait')

        const data = {
            name: registration.name,
            email: registration.email,
            password: decrypted,
            role: registration.role
        };

        await deleteDoc(doc(database, "registrations", registration.id));
        dispatch(registerUser(data, setError));


    }
    const disapproveRegistration = async () => {
        toast.info('Disproving Registration. Please wait')

        await deleteDoc(doc(database, "registrations", registration.id)).then(() => {
            toast.done('Registration Application removed')
        });


    }
    useEffect(async () => {
        const q = query(collection(database, "registrations"));

        await getDocs(q).then((registration) => {
            let registrationData = registration.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRegistrations(registrationData)

        }).then(() => {
            setLoading(false)
        }).catch((err) => {
            console.log(err);
        })
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
                <div className='head' style={{ padding: '20px', maxWidth: '70%', margin: 'auto', backgroundColor: '#FFFFFF', borderStyle: 'solid', borderTop: '0px', borderColor: '#959595', borderWidth: '2px' }}>
                    <h2>Registrations</h2>
                    <hr></hr>
                    <div className='content' style={{ padding: '5px' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email / ID</th>
                                    <th>Role</th>
                                    <th>Date Created</th>
                                    <th>Company I.D Picture</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(registration => (
                                    <tr key={registration.id}>
                                        <td>{registration.name}</td>
                                        <td>{registration.email}</td>
                                        <td>{registration.role}</td>
                                        <td>{registration.date.toDate().toDateString()}</td>
                                        <td><Button size='sm' onClick={() => viewRegistration(registration)} >View</Button></td>
                                    </tr>
                                ))}

                            </tbody>
                        </Table>
                    </div>
                </div>

                <Modal show={show} onHide={() => setShow(false)}>


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
                </Modal>
            </>


        )
    }

}

export default Home

