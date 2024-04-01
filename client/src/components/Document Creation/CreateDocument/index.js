import { useState, Fragment, useEffect } from 'react';
import Floor from '../Floor'
import { v4 as uuidv4 } from 'uuid';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'

//Bootstrap components
import { Form, Button, Row, Col } from 'react-bootstrap';

const DocumentCreation = () => {
  const [projects, setProjects] = useState([])
  const database = getFirestore()
  const [project, setProject] = useState()

  //Array of floors. Floors are identified by id that is created using uuid
  const [floors, setFloors] = useState([
    {
      id: uuidv4(),
      floorName: '',
      saleableArea: [
        {
          saleableAreaUnitNumberTag: '',
          saleableAreaType: '',
          saleableAreaSize: ''
        }
      ],
      serviceArea: [
        {
          serviceAreaUnitNumberTag: '',
          serviceAreaType: '',
          serviceAreaSize: ''
        }
      ],
      parkingArea: [
        {
          parkingAreaUnitNumberTag: '',
          numberOfParking: '',
          parkingSlotSize: '',
          parkingTotalArea: ''
        }
      ],
      amenitiesArea: [
        {
          amenitiesAreaUnitNumberTag: '',
          amenitiesAreaType: '',
          amenitiesAreaSize: ''
        }
      ],
      residentialArea: [
        {
          residentialAreaUnitType: '',
          residentialAreaNumberUnit: '',
          residentialAreaSize: '',
          residentialTotalArea: ''
        }
      ]
    }
  ])

  //Change handler for Floor name
  const handleFloorNameChange = (index, event) => {
    let data = [...floors];
    data[index][event.target.name] = event.target.value;
    setFloors(data);
  }

  //Add new floor by creating and adding a new id to floors.id
  const addFloor = () => {
    const newFloor = {
      id: uuidv4(),
      floorName: '',
      saleableArea: [
        {
          saleableAreaUnitNumberTag: '',
          saleableAreaType: '',
          saleableAreaSize: ''
        }
      ],
      serviceArea: [
        {
          serviceAreaUnitNumberTag: '',
          serviceAreaType: '',
          serviceAreaSize: ''
        }
      ],
      parkingArea: [
        {
          parkingAreaUnitNumberTag: '',
          numberOfParking: '',
          parkingSlotSize: '',
          parkingTotalArea: ''
        }
      ],
      amenitiesArea: [
        {
          amenitiesAreaUnitNumberTag: '',
          amenitiesAreaType: '',
          amenitiesAreaSize: ''
        }
      ],
      residentialArea: [
        {
          residentialAreaUnitType: '',
          residentialAreaNumberUnit: '',
          residentialAreaSize: '',
          residentialTotalArea: ''
        }
      ]
    }
    setFloors((prevFloors) => [...prevFloors, newFloor])
  }

  //Remove floor from array by using index
  const removeFloor = (index) => {
    setFloors((prevFloors) => prevFloors.filter((floor) => floor.id !== index));
  }

  /* SALEABLE AREA FUNCTIONS */
  //Saleable Area Form change handler
  const handleSaleableAreaChange = (floorIndex, areaIndex, field, value) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].saleableArea[areaIndex][field] = value;
    setFloors(updatedFloors);
  };

  //For adding more inputs to Saleable Area
  const handleAddSaleableArea = (floorIndex) => {
    const newSaleableArea = {
      saleableAreaUnitNumberTag: '',
      saleableAreaType: '',
      saleableAreaSize: ''
    };
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].saleableArea.push(newSaleableArea);
    setFloors(updatedFloors);
  };

  //For removing inputs from Saleable Area
  const handleRemoveSaleableArea = (floorIndex, areaIndex) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].saleableArea.splice(areaIndex, 1);
    setFloors(updatedFloors);
  };

  /* SERVICE AREA FUNCTIONS */
  //Service Area Form change handler
  const handleServiceAreaChange = (floorIndex, areaIndex, field, value) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].serviceArea[areaIndex][field] = value;
    setFloors(updatedFloors);
  };

  //For adding more inputs to Service Area
  const handleAddServiceArea = (floorIndex) => {
    const newServiceArea = {
      serviceAreaUnitNumberTag: '',
      serviceAreaType: '',
      serviceAreaSize: ''
    };
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].serviceArea.push(newServiceArea);
    setFloors(updatedFloors);
  };

  //For removing inputs from Service Area
  const handleRemoveServiceArea = (floorIndex, areaIndex) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].serviceArea.splice(areaIndex, 1);
    setFloors(updatedFloors);
  };

  /* PARKING AREA FUNCTIONS */
  //Parking Area Form change handler
  const handleParkingAreaChange = (floorIndex, areaIndex, field, value) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].parkingArea[areaIndex][field] = value;

    //Calculate Total Parking Area by multiplying No. of Parking and Slot Size
    updatedFloors[floorIndex].parkingArea[areaIndex].parkingTotalArea =
      updatedFloors[floorIndex].parkingArea[areaIndex].numberOfParking *
      updatedFloors[floorIndex].parkingArea[areaIndex].parkingSlotSize;

    setFloors(updatedFloors);
  };

  //For adding more inputs to Parking Area
  const handleAddParkingArea = (floorIndex) => {
    const newParkingArea = {
      parkingAreaUnitNumberTag: '',
      numberOfParking: '',
      parkingSlotSize: '',
      parkingTotalArea: ''
    };
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].parkingArea.push(newParkingArea);
    setFloors(updatedFloors);
  };

  //For removing inputs from Parking Area
  const handleRemoveParkingArea = (floorIndex, areaIndex) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].parkingArea.splice(areaIndex, 1);
    setFloors(updatedFloors);
  };

  /* AMENITIES AREA FUNCTIONS */
  //Amenities Area Form change handler
  const handleAmenitiesAreaChange = (floorIndex, areaIndex, field, value) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].amenitiesArea[areaIndex][field] = value;
    setFloors(updatedFloors);
  };

  //For adding more inputs to Amenities Area
  const handleAddAmenitiesArea = (floorIndex) => {
    const newAmenitiesArea = {
      amenitiesAreaUnitNumberTag: '',
      amenitiesAreaType: '',
      amenitiesAreaSize: ''
    };
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].amenitiesArea.push(newAmenitiesArea);
    setFloors(updatedFloors);
  };

  //For removing inputs from Amenities Area
  const handleRemoveAmenitiesArea = (floorIndex, areaIndex) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].amenitiesArea.splice(areaIndex, 1);
    setFloors(updatedFloors);
  };

  /* RESIDENTIAL AREA FUNCTIONS */
  //Residential Area Form change handler
  const handleResidentialAreaChange = (floorIndex, areaIndex, field, value) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].residentialArea[areaIndex][field] = value;

    //Calculate Total Parking Area by multiplying No. of Parking and Slot Size
    updatedFloors[floorIndex].residentialArea[areaIndex].residentialTotalArea =
      updatedFloors[floorIndex].residentialArea[areaIndex].residentialAreaSize *
      updatedFloors[floorIndex].residentialArea[areaIndex].residentialAreaNumberUnit;

    setFloors(updatedFloors);
  };

  //For adding more inputs to Residential Area
  const handleAddResidentialArea = (floorIndex) => {
    const newResidentialArea = {
      residentialAreaUnitType: '',
      residentialAreaNumberUnit: '',
      residentialAreaSize: '',
      residentialTotalArea: ''
    };
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].residentialArea.push(newResidentialArea);
    setFloors(updatedFloors);
  };

  //For removing inputs from Residential Area
  const handleRemoveResidentialArea = (floorIndex, areaIndex) => {
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].residentialArea.splice(areaIndex, 1);
    setFloors(updatedFloors);
  };

  //Submits the contents of inputs
  const handleSubmit = async () => {
    try {
      // Assuming 'floors' is the state you want to upload
      const docRef = await setDoc(doc(database, 'buildingSurface', project), {
        floors: floors,
        project: project
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  //Loads existing building surface data from a project
  const getProject = async (project) => {

    setProject(project)

    const q = doc(database, 'buildingSurface', project)
    // const docSnap = await getDoc(q).then((doc) => {
    //   setFloors(doc.data().floors)
    // })

    console.log('got doc')
  }

  //Gets projects from projects document
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



  return (
    <div className='head' style={{ padding: '20px' }}>
      {/* <h1>Create Building Surface Document </h1> */}
      <Form.Select placeholder='Select Project' onChange={(e) => getProject(e.target.value)}>
        <option value="" hidden>Project</option>
        {projects.map((project, index) => (
          <>
            <option value={project.name}>{project.name}</option>
          </>

        ))}
      </Form.Select>
      <div className='content' style={{ padding: '5px' }}>

        <Form>
          {floors.map((floor, index) => (
            <Fragment key={index}>
              <Row>
                <Col>
                  <Form.Control
                    size='lg'
                    type="text"
                    placeholder="Floor name"
                    name="floorName"
                    value={floor.floorName}
                    onChange={event => handleFloorNameChange(index, event)}
                  />
                </Col>

                <Col>
                </Col>
              </Row>
              <Floor
                floorIndex={index}
                saleableArea={floor.saleableArea}
                onSaleableAreaChange={handleSaleableAreaChange}
                onAddSaleableArea={handleAddSaleableArea}
                onRemoveSaleableArea={handleRemoveSaleableArea}

                serviceArea={floor.serviceArea}
                onServiceAreaChange={handleServiceAreaChange}
                onAddServiceArea={handleAddServiceArea}
                onRemoveServiceArea={handleRemoveServiceArea}

                parkingArea={floor.parkingArea}
                onParkingAreaChange={handleParkingAreaChange}
                onAddParkingArea={handleAddParkingArea}
                onRemoveParkingArea={handleRemoveParkingArea}

                amenitiesArea={floor.amenitiesArea}
                onAmenitiesAreaChange={handleAmenitiesAreaChange}
                onAddAmenitiesArea={handleAddAmenitiesArea}
                onRemoveAmenitiesArea={handleRemoveAmenitiesArea}

                residentialArea={floor.residentialArea}
                onResidentialAreaChange={handleResidentialAreaChange}
                onAddResidentialArea={handleAddResidentialArea}
                onRemoveResidentialArea={handleRemoveResidentialArea}
              />
              <Button variant='secondary' onClick={() => removeFloor(floor.id)}>Remove floor</Button>
            </Fragment>
          ))}
        </Form>
        <Button variant='secondary' onClick={addFloor}>Add Floor</Button>
        <Button variant="primary" onClick={handleSubmit}>Save and Submit</Button>
      </div>
    </div>
  );
}

export default DocumentCreation;
