import { useState, Fragment, useEffect } from 'react';
import Floor from '../Floor'
import { v4 as uuidv4 } from 'uuid';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'

//Bootstrap components
import { Form, Button, Row, Col, Table } from 'react-bootstrap';

const BuildingSurface = ({onHandleExport}) => {
  const database = getFirestore()
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState()
    const [editID, setEditID] = useState(-1)
    const [isEditing, setIsEditing] = useState(false)

    const [floors, setFloors] = useState([])

    const [remark, setRemark] = useState('')
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
                setFloors(doc.data().floors)
            }
        })
        console.log('got doc')
    }

    //Allows the edit button to function
    const handleEdit = (numberTag) => {
        setEditID(numberTag)
    }

    //Allows cancel button to function
    const handleCancel = () => {
        setEditID(-1)
    }

    //CURRENT BUG/MISSING FUNCTION: CANNOT UPDATE THE PROPER FIELD IN FIREBASE
    //Update firebase data
    const handleUpdate = async (project, remark, sqm) => {
      const floorDoc = doc(database, 'buildingSurface', project)
      const newRemark = {remark}
      const newSqm = {sqm}
      await updateDoc(floorDoc, newRemark, newSqm)
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
      <p></p>
      <div className='content' style={{ padding: '5px' }}>
        <Table striped bordered hover id='myTable'>
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
                                      <td>
                                          <input
                                              type="text" 
                                              name='saleableAreaRemark' 
                                              value={sale.saleableAreaRemark}
                                              onChange={e => setRemark(e.target.value)}
                                          />
                                      </td>
                                      <td>
                                          <input 
                                              type="number"
                                              step="0.01" 
                                              name='saleableAreaPriceSqm' 
                                              value={sale.saleableAreaPriceSqm}
                                              onChange={e => setPrice(e.target.value)}
                                          />
                                      </td>
                                      <td>{sale.saleableAreaSize}</td>
                                      <td>{sale.saleableAreaUnitPrice}</td>
                                      <td>{sale.saleableAreaVAT}</td>
                                      <td>{sale.saleableAreaMiscFees}</td>
                                      <td>{sale.saleableAreaTotalPrice}</td>
                                      <td>
                                          <Button variant="primary" onClick={() => {handleUpdate(project, sale.saleableAreaRemark, sale.saleableAreaPriceSqm)}}>Update</Button> &nbsp;
                                          <Button variant="danger" onClick={handleCancel}>Cancel</Button>
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
        <Button
            variant='success'
            onClick={onHandleExport}
        >
            Export as Spreadsheet (.xlsx)
        </Button>
      </div>
    </div>
  );
}

export default BuildingSurface;
