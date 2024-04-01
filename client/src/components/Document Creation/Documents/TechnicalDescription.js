import { collection, getDocs, doc, query, getFirestore, getDoc, setDoc } from 'firebase/firestore'
import { useState, Fragment, useEffect } from 'react';

import  Table  from 'react-bootstrap/Table'

const TechnicalDescription = () => {
    const database = getFirestore()
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(database, 'buildingSurface'));
            const docsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(docsArray);
        };

        fetchData();
      }, []);

    return ( 
        <>
            <h1>Technical Description</h1>
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
                    {data.map((row, index) => {
                        <tr key={index}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </>
     );
}
 
export default TechnicalDescription;