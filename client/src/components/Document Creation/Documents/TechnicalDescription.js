import { collection, getDocs, doc, query, getFirestore, getDoc, setDoc } from 'firebase/firestore'
import { useState, Fragment, useEffect } from 'react';

import {Form, Table} from 'react-bootstrap'

const TechnicalDescription = () => {
    const database = getFirestore()
    const [data, setData] = useState([]);
    const [existingProjects, setExistingProjects] = useState([])
    const [project, setProject] = useState()

    const floorCollectionRef = collection(database, 'buildingSurface')

    useEffect(() => {
        const getFloors = async () => {
            try {
                const q = await getDocs(floorCollectionRef);
                const filteredData = q.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }))
                console.log(filteredData);
                setData(filteredData);
            } catch (err) {
                console.error(err)
            }
        }

        getFloors();
      }, []);

      //Get project names from buildingSurface collection
        useEffect(() => {
            const getExistingProjects = async () => {
                const q = query(collection(database, 'buildingSurface'))
                await getDocs(q).then((project) => {
                    let projectData = project.docs.map((doc) => ({ 
                        value: doc.id,
                        label: doc.data().project
                    }))
                    setExistingProjects(projectData)
                    }).catch((err) => {
                    console.log(err);
                    })
                }
                
                getExistingProjects()
        }, [])

        const getProject = async (project) => {

            setProject(project)
        
            const q = doc(database, 'buildingSurface', project)
            // const docSnap = await getDoc(q).then((doc) => {
            //   setFloors(doc.data().floors)
            // })
        
            console.log('got doc')
        }

    return ( 
        <>
            <h1>Technical Description</h1>
            <Form.Select placeholder='Select Project' onChange={(e) => getProject(e.target.value)}>
                <option value="" hidden>Select existing project</option>
                {existingProjects.map((project, index) => (
                <>
                    <option value={project.value}>{project.label}</option>
                </>

                ))}
            </Form.Select>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td>Unit No./Tag</td>
                        <td>Total Saleable Area</td>
                        <td>Total Service Area</td>
                        <td>Gross Floor Area</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>TOTAL (Building Surface)</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    {existingProjects.map((row, index) => (
                        <tr key={index}>
                            <td>{row.project}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
     );
}
 
export default TechnicalDescription;