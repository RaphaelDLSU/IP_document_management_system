import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Form, Col, Table } from 'react-bootstrap';

const TechnicalDescription = () => {
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
                <h2>Technical Description</h2>
                <hr></hr>
                <Col md={2}>
                    <Form.Select placeholder='Select Project' onChange={(e) => getProject(e.target.value)}>
                        <option value="" hidden>Project</option>
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
                                <th>Unit No./Tag</th>
                                <th>Total Saleable Area</th>
                                <th>Total Service Area</th>
                                <th>Gross Floor Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TOTAL (Building Surface)</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {floors && (
                                <>
                                    {floors.map((floor, index) => (
                                        <>
                                            <tr>
                                                <td>{floor.floorName}</td>
                                            </tr>
                                            <tr>
                                                <td>SERVICE AREA (Bldg. Surface)</td>
                                                <td></td>
                                                <td>/total/</td>
                                                <td></td>
                                            </tr>
                                            {floor.serviceArea.map((service, index) => (
                                                <tr>
                                                    <td>{service.serviceAreaUnitNumberTag}</td>
                                                    <td>{service.serviceAreaSize}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>SALEABLE AREA (Bldg. Surface)</td>
                                                <td>/total/</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            {floor.saleableArea.map((sale, index) => (
                                                <tr>
                                                    <td>{sale.saleableAreaUnitNumberTag}</td>
                                                    <td>{sale.saleableAreaSize}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                            
                                        </>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}
 
export default TechnicalDescription;