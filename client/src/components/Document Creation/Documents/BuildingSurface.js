import React, { useEffect, useState } from 'react';

//Bootstrap components
import { Table, Row, Col } from 'react-bootstrap';

//Firebase imports
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase"

const BuildingSurface = () => {
    const [data, setData] = useState([])

    const floorCollectionRef = collection(db, "buildingSurface")

    useEffect(() => {
        const getFloors = async () => {
            try {
                const data = await getDocs(floorCollectionRef);
                const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
                console.log({filteredData})
            } catch (err) {
                console.error(err);
            }
        }
        // const fetchData = async () => {
        //   const querySnapshot = await getDocs(collection(db, 'buildingSurface'));
        //   const docsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //   setData(docsArray);
        // };
    
        // fetchData();
        getFloors();
    }, []);

    return ( 
        <>
            <h1>Building Surface</h1>
            {/* <Table striped bordered hover>
                <thead>
                    <tr>

                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.id}</td>
                            <td>{row.firstName}</td>
                            <td>{row.lastName}</td>
                            Render more data cells as needed
                        </tr>
                    ))}
                </tbody>
            </Table> */}
        </>
     );
}
 
export default BuildingSurface;