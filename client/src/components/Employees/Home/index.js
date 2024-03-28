
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
    const [datas, setDatas] = useState()
    const database = getFirestore()
    let data = [
        {
            name: "Task 1",
            startDate: "2024-03-28T08:00:00Z",
            deadline: "2024-03-29T17:00:00Z",
            status: "pending"
        },
        {
            name: "Task 2",
            startDate: "2024-03-25T10:30:00Z",
            deadline: "2024-03-28T12:00:00Z",
            status: "completed"
        },
        {
            name: "Task 3",
            startDate: "2024-03-27T09:15:00Z",
            deadline: "2024-03-29T10:00:00Z",
            status: "pending"
        },
        {
            name: "Task 4",
            startDate: "2024-03-26T14:00:00Z",
            deadline: "2024-03-27T16:30:00Z",
            status: "completed"
        },
        {
            name: "Task 5",
            startDate: "2024-03-29T08:45:00Z",
            deadline: "2024-03-30T13:00:00Z",
            status: "pending"
        },
        {
            name: "Task 6",
            startDate: "2024-03-28T10:00:00Z",
            deadline: "2024-03-31T09:30:00Z",
            status: "pending"
        },
        {
            name: "Task 7",
            startDate: "2024-03-25T16:30:00Z",
            deadline: "2024-03-26T18:00:00Z",
            status: "completed"
        },
        {
            name: "Task 8",
            startDate: "2024-03-30T11:45:00Z",
            deadline: "2024-03-31T15:30:00Z",
            status: "pending"
        },
        {
            name: "Task 9",
            startDate: "2024-03-26T08:00:00Z",
            deadline: "2024-03-29T11:00:00Z",
            status: "completed"
        },
        {
            name: "Task 10",
            startDate: "2024-03-29T13:00:00Z",
            deadline: "2024-03-30T16:45:00Z",
            status: "pending"
        },
        {
            name: "Task 11",
            startDate: "2024-03-27T09:30:00Z",
            deadline: "2024-03-29T14:00:00Z",
            status: "pending"
        },
        {
            name: "Task 12",
            startDate: "2024-03-28T12:15:00Z",
            deadline: "2024-03-30T10:30:00Z",
            status: "pending"
        },
        {
            name: "Task 13",
            startDate: "2024-03-25T09:00:00Z",
            deadline: "2024-03-27T13:45:00Z",
            status: "completed"
        },
        {
            name: "Task 14",
            startDate: "2024-03-31T14:30:00Z",
            deadline: "2024-04-01T16:00:00Z",
            status: "pending"
        },
        {
            name: "Task 15",
            startDate: "2024-03-27T11:45:00Z",
            deadline: "2024-03-30T12:30:00Z",
            status: "pending"
        },
        {
            name: "Task 16",
            startDate: "2024-03-29T09:15:00Z",
            deadline: "2024-03-31T17:00:00Z",
            status: "pending"
        },
        {
            name: "Task 17",
            startDate: "2024-03-26T13:00:00Z",
            deadline: "2024-03-29T09:45:00Z",
            status: "completed"
        },
        {
            name: "Task 18",
            startDate: "2024-03-30T08:30:00Z",
            deadline: "2024-04-01T10:15:00Z",
            status: "pending"
        },
        {
            name: "Task 19",
            startDate: "2024-03-28T10:45:00Z",
            deadline: "2024-03-31T14:30:00Z",
            status: "pending"
        },
        {
            name: "Task 20",
            startDate: "2024-03-25T12:00:00Z",
            deadline: "2024-03-28T15:00:00Z",
            status: "completed"
        },
        {
            name: "Task 21",
            startDate: "2024-03-30T10:00:00Z",
            deadline: "2024-03-31T12:45:00Z",
            status: "pending"
        },
        {
            name: "Task 22",
            startDate: "2024-03-26T08:15:00Z",
            deadline: "2024-03-28T11:30:00Z",
            status: "completed"
        },
        {
            name: "Task 23",
            startDate: "2024-03-29T11:30:00Z",
            deadline: "2024-03-30T14:15:00Z",
            status: "pending"
        },
        {
            name: "Task 24",
            startDate: "2024-03-27T10:45:00Z",
            deadline: "2024-03-29T16:30:00Z",
            status: "pending"
        },
        {
            name: "Task 25",
            startDate: "2024-03-28T15:00:00Z",
            deadline: "2024-03-30T13:45:00Z",
            status: "pending"
        },
        {
            name: "Task 26",
            startDate: "2024-03-25T13:15:00Z",
            deadline: "2024-03-27T18:00:00Z",
            status: "completed"
        },
        {
            name: "Task 27",
            startDate: "2024-03-31T09:30:00Z",
            deadline: "2024-04-01T12:15:00Z",
            status: "pending"
        },
        {
            name: "Task 28",
            startDate: "2024-03-29T08:45:00Z",
            deadline: "2024-03-31T10:30:00Z",
            status: "pending"
        },
        {
            name: "Task 29",
            startDate: "2024-03-26T11:00:00Z",
            deadline: "2024-03-29T14:45:00Z",
            status: "completed"
        },
        {
            name: "Task 30",
            startDate: "2024-03-28T12:30:00Z",
            deadline: "2024-03-30T09:15:00Z",
            status: "pending"
        }
    ]
    useEffect(() => {
        const q = query(collection(database, "users"), where("role", "==", 'Employee'));

        const getEmployees = async () => {
            await getDocs(q).then((employees) => {
                let employeeData = employees.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setEmployees(employeeData)
                setLoading(false)
            }).catch((err) => {
                console.log(err);
            })
        }
        getEmployees()
        setDatas(data)

    }, []);

    useEffect(() => {
        console.log('DATA' + JSON.stringify(datas))
    }, [datas]);

    const handleFilter = (filter) => {
        const filteredTasks = datas.filter(data => data.name.includes(filter))

        setDatas(filteredTasks)
    }

    const handleReset = () => {
        setDatas(data)
    }

    const handle28 = () => {

        const filteredTasks = datas.filter(task => {

            let timestamp = task.startDate

            console.log('timestamp ' +timestamp)
            const taskDate = new Date(timestamp).getDate();
            console.log('date  ' +taskDate)
            const taskMonth = new Date(timestamp).getMonth();
            console.log('month  ' +taskMonth)
            const taskYear = new Date(timestamp).getFullYear();
            console.log('year  ' +taskYear)

            return taskDate === 28 && taskMonth === 2 && taskYear === 2024; // March is month index 2
        });
        setDatas(filteredTasks)
    }

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
                    <input type='text' onChange={(e) => handleFilter(e.target.value)}></input> <Button onClick={handleReset}>Reset</Button><Button onClick={handle28}>March 28</Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.name}</td>
                                    <td>{entry.startDate}</td>
                                    <td>{entry.deadline}</td>
                                    <td>{entry.status}</td>
                                </tr>
                            ))}
                        </tbody>



                    </Table>
                    {/* <Table striped bordered hover>
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
                    </Table> */}
                </div>
            </div>

        )
    }

}

export default Home

