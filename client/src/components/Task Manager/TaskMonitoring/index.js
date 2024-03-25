
import React, { useEffect, useState } from 'react'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { shallowEqual, useDispatch, useSelector } from "react-redux";


import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import Form from 'react-bootstrap/Form';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


const TaskMonitoring = () => {
  const database = getFirestore()
  const [users, setUsers] = useState([]);
  const usersRef = collection(database, "users");
  const [tasksPending, setTasksPending] = useState([]);
  const [taskCompleted, setTasksCompleted] = useState([]);
  const collectionRef = collection(database, 'tasks')
  const [loading, setLoading] = useState(true)
  const [firstRender, setFirstRender] = useState(true);

  const handleReport = (id) => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.autoTable({
        html: id,
    });

    doc.save("mypdf.pdf");
}

  useEffect(() => {
    const getTasks = async () => {
      // const q = query(collectionRef, orderBy('task', 'asc'))
      const q = query(collectionRef, where('status','!=','done'))
      await getDocs(q).then((tasks) => {
        let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasksPending(tasksData)
      }).catch((err) => {
        console.log(err);
      })

      const f = query(collectionRef, where('status','==','done'))
      await getDocs(f).then((tasks) => {
        let tasksData = tasks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasksCompleted(tasksData)
      }).catch((err) => {
        console.log(err);
      }).then(()=>{
        setLoading(false)
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
  }, [])


  if (loading) {
    return (
      <div className='loadingcontain'>
        <Spinner className='loading' animation="border" variant="secondary" />
      </div>
    )
  } else {
    return (
      <>
        <Tabs
          defaultActiveKey="pending"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="pending" title="Pending">
          <Button onClick={()=>handleReport('#table-pending')}>Get Report</Button>
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
                  <tr key={task.id}>
                    {task.workflowname !== '' ? (
                      <td>{task.workflowname}</td>
                    ) : (
                      <td>None</td>
                    )}
                    <td>{task.project}</td>
                    <td>{task.task}</td>
                    {task.requirements ? (
                      <td> {task.requirements.map((req, index) => (

                        <span key={index}>
                          {req.value}
                          {index !== req.length - 1 && ', '}
                        </span>
                      ))}</td>
                    ) : (<td>None</td>)}

                    <td>{task.hours}</td>
                    <td>{task.employee}</td>
                    <td>{task.timestamp.toDate().toDateString()}</td>
                    <td>{task.deadline}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="completed" title="Completed">
          <Button onClick={()=>handleReport('#table-completed')}>Get Report</Button>
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
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {taskCompleted.map(task => (
                  <tr key={task.id}>
                    {task.workflowname !== '' ? (
                      <td>{task.workflowname}</td>
                    ) : (
                      <td>None</td>
                    )}
                    <td>{task.project}</td>
                    <td>{task.task}</td>
                    {task.requirements ? (
                      <td> {task.requirements.map((req, index) => (

                        <span key={index}>
                          {req.value}
                          {index !== req.length - 1 && ', '}
                        </span>
                      ))}</td>
                    ) : (<td>None</td>)}

                    <td>{task.hours}</td>
                    <td>{task.employee}</td>
                    <td>{task.timestamp.toDate().toDateString()}</td>
                    <td>{task.deadline}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

        </Tabs>


      </>
    )
  }

}

export default TaskMonitoring

