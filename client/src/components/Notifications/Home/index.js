
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";



import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../Home/index.css'
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';


const Home = () => {
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const [firstRender, setFirstRender] = useState(true);
    const [firstRender2, setFirstRender2] = useState(true);
    const [firstRender3, setFirstRender3] = useState(true);
    const [employeeId, setEmployeeId] = useState()
    const [notifs, setNotifs] = useState()
    const [loading, setLoading] = useState(true)
    const database = getFirestore()

    useEffect(async () => {


        setEmployeeId(user.data.uid)

    }, [user]);

    useEffect(async () => {
        console.log('USER ID : ' + employeeId)
        if (firstRender) {
            setFirstRender(false);
            return;
        }

        const f = query(collection(database, "notifs"), where("receiver", "==", employeeId));
        await getDocs(f).then((notif) => {
            let notifData = notif.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setNotifs(notifData)
        }).catch((err) => {
            console.log(err);
        })

    }, [employeeId]);

    useEffect(async () => {
        if (firstRender2) {
            setFirstRender2(false);
            return;
        }

        console.log('notifs ' + notifs)
        setLoading(false)
    }, [notifs]);
    if (loading) {
        return (
            <div className='loadingcontain'>
                <Spinner className='loading' animation="border" variant="secondary" />
            </div>
        )

    } else {
        return (

            <div className='head' style={{ padding: '20px' }}>
                <h2>Notifications</h2>
                <hr></hr>
                <div className='content' style={{ padding: '5px' }}>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        {notifs && (
                            <tbody>

                                {notifs.map(notif => (
                                    <tr key={notif.id}>
                                        <td>{notif.title}</td>
                                        <td>{notif.content}</td>
                                        <td>{notif.date.toDate().toDateString()}</td>
                                    </tr>
                                ))}

                            </tbody>
                        )}

                    </Table>
                </div>
            </div>

        )
    }

}

export default Home

