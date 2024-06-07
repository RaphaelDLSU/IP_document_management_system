import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap';

const TabulationOfAreas = () => {
    const database = getFirestore()
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState()

    const [floors, setFloors] = useState([])
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
                setFloors(doc.data().floors)

            }

        })

        console.log('got doc')
    }

    return (
        <>
            <div className='head' style={{ padding: '20px' }}>
                <h2>Tabulation of Areas</h2>
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
                <div className='content' style={{ padding: '5px' }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan={4}>Summary of Overall Changes</th>
                            </tr>
                            <tr>
                                <th>Details</th>
                                <th>Approved Plan</th>
                                <th>Proposed Alteration</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Approval Date</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Gross Floor Area</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Gross Saleable Area</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Gross Service Area</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Total Units</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Commercial Units</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Residential</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Parking Slots</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Floor Level</th>
                                <th>No.</th>
                                <th>Alteration</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Variance</th>
                                <th>Reference Plan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {floors && (
                                <>
                                    {floors.map((floor, index) => (
                                        <>
                                            <tr>
                                                <td>{floor.floorName}</td>
                                            </tr>
                                            {floor.saleableArea.map((sale, index) => (
                                                <tr>
                                                    <td></td>
                                                    <td>{sale.saleableAreaUnitNumberTag}</td>
                                                    <td>{sale.saleableAreaType}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{sale.saleableAreaSize}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </>
                            )} */}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}
 
export default TabulationOfAreas;