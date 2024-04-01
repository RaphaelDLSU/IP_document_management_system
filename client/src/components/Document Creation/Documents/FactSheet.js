import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap';


const FactSheet = () => {
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
                <h2>Fact Sheet</h2>
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
                                <th>FLOOR LOCATION</th>
                                <th>UNIT NO.</th>
                                <th>UNIT TYPE</th>
                                <th>REMARKS</th>
                                <th>PRICE/SQM</th>
                                <th>Area (m²)</th>
                                <th>Unit Price</th>
                                <th>12% VAT</th>
                                <th>MISC. FEES</th>
                                <th>TOTAL CONTRACT PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {floors && (
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
                            )}

                        </tbody>
                    </Table>


                </div>
            </div>
        </>
    );
}

export default FactSheet;