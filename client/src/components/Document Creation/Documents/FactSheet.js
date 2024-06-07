import { collection, getDocs, doc, query, getFirestore, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Form, Button, Col, Table } from 'react-bootstrap';

const FactSheet = ({handleSaleableAreaChange}) => {
    const database = getFirestore()
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState()
    const [editID, setEditID] = useState(-1)

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

    //Allows the edit button to function
    const handleEdit = (numberTag) => {
        setEditID(numberTag)
    } 

    //CURRENT BUG/MISSING FUNCTION: CANNOT UPDATE THE PROPER FIELD IN FIREBASE
    //Update firebase data
    const handleUpdate = async (project, remark, sqm) => {
        const floorDoc = doc(database, 'buildingSurface', project)
        const newRemark = {remark}
        const newSqm = {sqm}
        await updateDoc(floorDoc, newRemark, newSqm)
    }

    return (
        <>
            <div className='head' style={{ padding: '20px' }}>
                <h2>Fact Sheet</h2>
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
                                <th>FLOOR LOCATION</th>
                                <th>UNIT NO.</th>
                                <th>UNIT TYPE</th>
                                <th>REMARKS</th>
                                <th>PRICE/SQM</th>
                                <th>AREA (m²)</th>
                                <th>UNIT PRICE</th>
                                <th>12% VAT</th>
                                <th>MISC. FEES</th>
                                <th>TOTAL CONTRACT PRICE</th>
                                <th>Actions</th>
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
                                                sale.saleableAreaUnitNumberTag === editID ? 
                                                <tr>
                                                    <td></td>
                                                    <td>{sale.saleableAreaUnitNumberTag}</td>
                                                    <td>{sale.saleableAreaType}</td>
                                                    <td><input type="text" value={sale.saleableAreaRemark} onChange={handleSaleableAreaChange}/></td>
                                                    <td><input type="text" value={sale.saleableAreaPriceSqm} onChange={handleSaleableAreaChange}/></td>
                                                    <td>{sale.saleableAreaSize}</td>
                                                    <td>{sale.saleableAreaUnitPrice}</td>
                                                    <td>{sale.saleableAreaVAT}</td>
                                                    <td>{sale.saleableAreaMiscFees}</td>
                                                    <td>{sale.saleableAreaTotalPrice}</td>
                                                    <td>
                                                        <Button variant="primary" onClick={() => {handleUpdate(project, sale.saleableAreaRemark, sale.saleableAreaPriceSqm)}}>Update</Button> &nbsp;
                                                        <Button variant="danger">Cancel</Button>
                                                    </td>
                                                </tr>
                                                :
                                                <tr>
                                                    <td></td>
                                                    <td>{sale.saleableAreaUnitNumberTag}</td>
                                                    <td>{sale.saleableAreaType}</td>
                                                    <td>{sale.saleableAreaRemark}</td>
                                                    <td>{sale.saleableAreaPriceSqm}</td>
                                                    <td>{sale.saleableAreaSize}</td>
                                                    <td>{sale.saleableAreaUnitPrice}</td> {/* Unit Price is PriceSqm x Size */}
                                                    <td>{sale.saleableAreaVAT}</td> {/* 12% VAT is Unit Price x 0.12 */}
                                                    <td>{sale.saleableAreaMiscFees}</td> {/* Misc. Fees is Price x 0.08 */}
                                                    <td>{sale.saleableAreaTotalPrice}</td> {/* Total Contract Price is Unit Price + 12% VAT + Misc. Fees */}
                                                    <td><Button variant="success" onClick={() => handleEdit(sale.saleableAreaUnitNumberTag)}>Edit</Button></td>
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