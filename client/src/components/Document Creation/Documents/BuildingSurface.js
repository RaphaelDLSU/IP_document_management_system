import { useState, Fragment, useEffect } from 'react';
import Floor from '../Floor'
import { v4 as uuidv4 } from 'uuid';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import axios from 'axios';
//Bootstrap components
import { Form, Button, Row, Col, Table } from 'react-bootstrap';

const BuildingSurface = ({ onHandleExport }) => {
    const database = getFirestore()
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState()
    const [editID, setEditID] = useState(-1)
    const [isEditing, setIsEditing] = useState(false)

    const [floors, setFloors] = useState([])
    const [isCreated, setIsCreated] = useState(false)
    const [countParking, setCountParking] = useState()
    const [countCommercial, setCountCommercial] = useState()
    const [countResidential1B, setCountResidential1B] = useState()
    const [countResidential2B, setCountResidential2B] = useState()
    const [countResidentialPent, setCountResidentialPent] = useState()

    const [remark, setRemark] = useState('')
    const [surfURL, setSurfURL] = useState('')

    const [techURL, setTechURL] = useState('')

    const [factURL, setFactURL] = useState('')

    const [price, setPrice] = useState('')

    useEffect(() => {
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

    const getProject = async (project) => {
        setProject(project)

        const q = doc(database, 'buildingSurface', project)
        const docSnap = await getDoc(q).then((doc) => {
            if (doc.exists()) {
                setIsCreated(true)
                setFloors(doc.data().floors)
                setSurfURL(doc.data().buildingSurfaceURL)
                setFactURL(doc.data().factSheetURL)
                setTechURL(doc.data().technicalDescriptionURL)
                var parkingTally = 0
                var commercialTally = 0
                var oneBTally = 0
                var twoBTally = 0
                var pentTally = 0
                for (var i = 0; i < doc.data().floors.length; i++) {


                    if (doc.data().floors[i].parkingArea.length > 0) {
                        parkingTally = doc.data().floors[i].parkingArea.length
                    }
                    if (doc.data().floors[i].saleableArea.length > 0) {
                        commercialTally = doc.data().floors[i].saleableArea.length
                    }
                    if (doc.data().floors[i].residentialArea.length > 0) {
                        for (var j = 0; j < doc.data().floors[i].residentialArea.length; j++) {
                            if (doc.data().floors[i].residentialArea[j].residentialAreaNumberUnit == '1 Bedroom') {
                                oneBTally += 1
                            } else if (doc.data().floors[i].residentialArea[j].residentialAreaNumberUnit == '2 Bedroom') {
                                twoBTally += 1
                            } else if (doc.data().floors[i].residentialArea[j].residentialAreaNumberUnit == 'Penthouse') {
                                pentTally += 1
                            }
                        }
                    }

                }
                setCountParking(parkingTally)
                setCountCommercial(commercialTally)
                setCountResidential1B(oneBTally)
                setCountResidential2B(twoBTally)
                setCountResidentialPent(pentTally)
            } else {
                setIsCreated(false)
            }
        })
        console.log('got doc')
    }







    // //Loads existing building surface data from a project
    // const getProject = async (project) => {

    //   setProject(project)

    //   const q = doc(database, 'buildingSurface', project)
    //   const docSnap = await getDoc(q).then((doc) => {
    //     if (doc.exists()) {
    //       setFloors(doc.data().floors)

    //     }

    //   })

    //   console.log('got doc')
    // }

    // useEffect(() => {

    //   const getProjects = async () => {
    //     const q = query(collection(database, 'projects'))
    //     await getDocs(q).then((project) => {
    //       let projectData = project.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //       setProjects(projectData)
    //     }).catch((err) => {
    //       console.log(err);
    //     })
    //   }
    //   getProjects()
    // }, [])

    // useEffect(() => {
    //   const getExistingProjects = async () => {
    //     const q = query(collection(database, 'buildingSurface'))
    //     await getDocs(q).then((existingProject) => {
    //       let projectData = existingProject.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //       setExistingProjects(projectData)
    //     }).catch((err) => {
    //       console.log(err);
    //     })
    //   }
    //   getExistingProjects()
    // }, [])

    return (
        <div className='head' style={{ padding: '20px' }}>
            <h2>Building Surface</h2>
            <hr></hr>
            <Col md={2}>
                <Form.Select placeholder='Select Project' onChange={(e) => getProject(e.target.value)}>
                    <option value="" hidden>Select project to view</option>
                    {projects.map((project, index) => (
                        <>
                            <option value={project.name}>{project.name}</option>
                        </>
                    ))}
                </Form.Select>
            </Col>

            {project && isCreated ? (
                <>
                    <p></p>
                    <Form.Label>Building Surface &nbsp;</Form.Label>
                    <Button variant="primary" onClick={() => window.open(surfURL, '_blank')}>View</Button>
                    <p></p>
                    <p></p>

                    <Form.Label>Technical Description &nbsp;</Form.Label>

                    <Button variant="primary" onClick={() => window.open(techURL, '_blank')}>View</Button>
                    <p></p>
                    <p></p>
                    <Form.Label>Fact Sheet &nbsp;</Form.Label>


                    <Button variant="primary" onClick={() => window.open(factURL, '_blank')}>View</Button>

                    <p></p>
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td>Parking: </td>
                                <td>{countParking}</td>
                            </tr>
                            <tr>
                                <td>Commercial: </td>
                                <td>{countCommercial}</td>
                            </tr>

                            <tr>
                                <td>Residential 1B: </td>
                                <td>{countResidential1B}</td>
                            </tr>
                            <tr>
                                <td>Residential 2B: </td>
                                <td>{countResidential2B}</td>
                            </tr>
                            <tr>
                                <td>Residential Penthouse: </td>
                                <td>{countResidentialPent}</td>
                            </tr>
                        </tbody>
                    </table>

                </>
            ) : (
                <>
                    <p></p>
                    <p> No Created Documents</p>
                </>
            )}
        </div>
    );

}
export default BuildingSurface;
