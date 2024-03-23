
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";



import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from 'react-bootstrap/Spinner';


import '../Home/index.css'
import '../../../App.css'

const Home = () => {

    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const database = getFirestore()

    useEffect(async () => {
        const q = query(collection(database, "users"), where("role", "==", 'Employee'));

        await getDocs(q).then((employees) => {
            let employeeData = employees.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setEmployees(employeeData)
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
            <div className='head' style={{ padding: '20px' }}>
                <h2>Employees</h2>
                <hr></hr>
                <div className='content' style={{ padding: '5px' }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email / ID</th>
                                <th>Last Login</th>
                                <th>Tasks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.lastLogin.toDate().toDateString()}</td>
                                    <td>{employee.tasks}</td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </div>
            </div>

        )
    }

}

export default Home

