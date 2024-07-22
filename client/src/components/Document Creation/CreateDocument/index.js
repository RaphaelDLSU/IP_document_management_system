import { useState, Fragment, useEffect } from 'react';
import Floor from '../Floor'
import { v4 as uuidv4 } from 'uuid';
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { shallowEqual, useDispatch, useSelector } from "react-redux";

//Bootstrap components
import { Form, Button, Row, Col } from 'react-bootstrap';

const DocumentCreation = ({ floors, setFloors, handleSaleableAreaChange, handleAddSaleableArea, handleRemoveSaleableArea }) => {
  const [projects, setProjects] = useState([])
  const database = getFirestore()
  const [project, setProject] = useState()
  const [address, setAddress] = useState()
  const [isCreated, setIsCreated] = useState()
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const { isLoggedIn, user, userId } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
      userId: state.auth.userId,
    }),
    shallowEqual
  );
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

      ],
      serviceArea: [

      ],
      parkingArea: [

      ],
      amenitiesArea: [

      ],
      residentialArea: [

      ]
    }
    setFloors((prevFloors) => [...prevFloors, newFloor])
  }

  //Remove floor from array by using index
  const removeFloor = (index) => {
    setFloors((prevFloors) => prevFloors.filter((floor) => floor.id !== index));
  }

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

    console.log("Floor Index: " + floorIndex + 'areaIndex: ' + areaIndex)
    const updatedFloors = [...floors];
    updatedFloors[floorIndex].residentialArea.splice(areaIndex, 1);
    setFloors(updatedFloors);
  };

  //Submits the contents of inputs
  const handleSubmit = async () => {

    const q = doc(database, 'buildingSurface', project)
    const docSnap = await getDoc(q)

    if (!docSnap.exists()) {
      handleShow()

      try {
        const docRef = await setDoc(doc(database, 'buildingSurface', project), {
          floors: floors,
          project: project,
          address: address
        }).then(async () => {
          const q = doc(database, 'buildingSurface', project)
          const docSnap = await getDoc(q).then(async (doc) => {

            try {
              const { data: res } = await axios.post("http://localhost:5000/sheettest", doc.data())
              window.open(res.url, '_blank')
              window.open(res.url2, '_blank')
              window.open(res.url3, '_blank')
              console.log('RESPONSE: ' + res.url)
              await updateDoc(q, {
                buildingSurfaceURL: res.url,
                technicalDescriptionURL: res.url2,
                factSheetURL: res.url3,
                factSheetID: res.factSheetID
              });
            } catch (error) {
              console.log(error);
            }
            handleClose()

          })
        })
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    } else {
    }
  }

  const handleUpdate = async () => {

    var PRIVATE_KEY = '"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCixT95UEhBb7AM\nolwTNViaaCUjfTYLlqZiHr1HHhJkwSBCDvZ5rM+2wihz547fnBQQ94LQ1gafUReV\nde2Mdm+doLy8kVNqKda8iNIzsPtHB46bW7hiVdAsLAACg0spimjmQZZdRzF8O0vv\nlC1dYWMjcyRAWH+QokuOJ+DdQjBdHhXoKgE+UZE4TX65Ylrd8z+sUkUIhVet0C/z\nFC4n5O3YgaBfsRn5F3o2LywLbhWeq92mvbArp3IhSNCLL7bDlEjzXXFELu1hmZKe\ndexUEtJ79CSLMSO0TLLCxrUxJGI4UQtJ2IxefRCJ59oHEPU3WtqKuDBO5u1RTW0Q\n6SIW4+JfAgMBAAECggEAEevq4GC9BpYVXwa/YY61meaj9C40oFOu2niCTvgaKVrJ\nl6G4dKQuM0lZv+KRLMCtcELNoKXNZobnXwRJf/YzCuV9nRDZNi6zdIsSAzFWMWIS\ndbuZvRtasjUJWT17LfCN5Tr3zdRpYpbQIRRXvFjdMV7bm8ltXjo9scIP9FH11kKt\nEpvrW/0T6EYz2qv4GZQNuEHJQO/ZX5aXl1y12oY6bU+I8TYgv9nDhQUvwETmJOw0\nAg5w78VG2ZNXX1GRH84+ea358v6I99J7m7zOsUUFxUXafuXclizgzaHSO2qelR04\nvC12FA//FPrZVSvvnEpmK4c8mbUeCqKxSX314gl8AQKBgQDh/hHA47P2mQXdQbFx\nQFKlLFdWkr2tKSX0E+gUiGJcaJfEMBdAXf3Qt8SwTLXrJ4LVENPTamvzGVU/GLLe\n2IPLtjpAptDfx1JUbruzM+fYYbl6t13C/Jn6aIiqRgmMcs4HWIlLsr+uRR9ZxQFy\nBKO5ozg/+/KFOOGQJ2s1VqgWXwKBgQC4YiOhBAp1bF8eQ6VX2UJ4lY5mP3vc/Lvo\nOquCkC/OgSOjXCP6L9PYzgs7+0q+kR4V08a9ZB0xsf0N6Jg0XYmQZ8JwJm30TmrP\nxcPSgpMvVPm95hiEpirlJ4RSkxcfLBQQk4GD5N+q84AuR9JzmQIxycvqToGiRQOj\neq5MBR+0AQKBgQCbWMTnbR72MnY/g7rv+KFW/UYEMtbDw3ddcpmkE6RZlWRN7ijt\njC6/XLON5Q1gWkarI+gYeh0+fHmG5/l9CiR+0gL1EjaevSsw8vV/1/xVV8fiPU3s\njStjYJwhQAesTfamQgwOxw7QQp+sW6oEsH/DShmOkihBv7n+F7qwbaMZzQKBgEGl\nRzQbgTG/TLo0sVhulJjj/lfvAEV0gd4zjT6l4S9vkOWnd3OqtYz6BsvrMvhYKFLz\nHE3vp+k6inL6Pb5fEwwjtPlC5WDWznZ83bREIuz2Hxh6JH6NvrXpdNYFYnUJt3cT\nXUg9I1j06s0PayEW984MH5qjKspAMgRxOD7+kAQBAoGBAIRG84bU4A3ya5IFJBpt\nzRxQ77KYRjVl1kUcGEWJsg4J+l2/CKNBKhJtthLNHPaBQqW26z9T4Lc06dmPeZ+T\nGlF7I6aiEAFJniHQ9wkUKy409eenL33mebecxHPOp8NXjAXVG+NMjoY4hbY68Pr5\nvN77WX6lOu9nc0XkCiVwUGEB\n-----END PRIVATE KEY-----\n"'; const updateRef = doc(database, "buildingSurface", project); await updateDoc(updateRef, { floors: floors })

    const q = doc(database, 'buildingSurface', project)
    const docSnap = await getDoc(q).then(async (doc) => {

      if (doc.exists()) {
        handleShow()
        try {
          const { data: res } = await axios.post("http://localhost:5000/sheetupdate", doc.data())
          window.open(res.url, '_blank')
          window.open(res.url2, '_blank')
          window.open(res.url3, '_blank')

          await updateDoc(q, {
            buildingSurfaceURL: res.url,
            technicalDescriptionURL: res.url2,
            factSheetURL: res.url3,
          });
          console.log('RESPONSE: ' + res.url)
        } catch (error) {
          console.log(error);
        }
        handleClose()
      } else {
        toast.info('No existing project documents')
        console.log('No existing project documents')
      }
      console.log(PRIVATE_KEY)
    })
  }

  //Loads existing building surface data from a project
  const getProject = async (project) => {
    console.log('Changing Project')

    setProject(project)

    const j = query(collection(database, "projects"), where("name", "==", project));

    const querySnapshot = await getDocs(j);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setAddress(doc.data().address)
    });

    const q = doc(database, 'buildingSurface', project)
    const docSnap = await getDoc(q).then((doc) => {
      if (doc.exists()) {
        setIsCreated(true)

        setFloors(doc.data().floors)
      } else {
        setIsCreated(false)

        setFloors([{
          id: uuidv4(),
          floorName: '',
          saleableArea: [

          ],
          serviceArea: [

          ],
          parkingArea: [

          ],
          amenitiesArea: [

          ],
          residentialArea: [

          ]
        }])
      }
    })

    console.log('got doc')

  }

  //Gets projects from projects document
  useEffect(() => {

    const getProjects = async () => {


      const k = query(collection(database, "tasks"), where("employeeId", "==", user.data.uid),where('task','==','Submit Reviewed Building Permit Requirements'));

      const querySnapshot = await getDocs(k);
      querySnapshot.forEach((doc) => {
        console.log('PROJECT ' +doc.data().project)
        setProjects([...projects, doc.data()])
      });
      // const q = query(collection(database, 'projects'))
      // await getDocs(q).then(async (project) => {
      //   let projectData = project.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      //   setProjects(projectData)
      // }).catch((err) => {
      //   console.log(err);
      // })
    }

    getProjects()
    console.log(isCreated)


  }, [])

  return (
    <div className='head' style={{ padding: '20px' }}>
      <h2>Document Creation</h2>
      <p>Input Building Surface Document data to create other documents</p>
      <hr></hr>
      <Col md={2}>
        <Form.Select placeholder='Select Project' onChange={(e) => getProject(e.target.value)}>
          <option value="" hidden>Select project</option>
          {projects.map((project, index) => (
            <>
              <option value={project.project}>{project.project}</option>
            </>
          ))}
        </Form.Select>
      </Col>
      <p></p>
      <div className='content' style={{ padding: '5px' }}>
        {project && floors && (
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
                    <Button variant='danger' onClick={() => removeFloor(floor.id)}>Remove floor</Button>

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
              </Fragment>
            ))}
          </Form>
        )}

        <Button variant='primary' onClick={addFloor}>Add Floor</Button> &nbsp;
        {isCreated != undefined && (
          <>
            {!isCreated ? (
              <Button variant="success" onClick={handleSubmit}>Create Documents</Button>

            ) : (
              <Button variant="success" onClick={handleUpdate}>Update Documents</Button>

            )}
          </>

        )}


      </div>

      <Modal show={show} onHide={handleClose}>

        <Modal.Body>Creating Documents. Please wait...</Modal.Body>

      </Modal>
    </div>


  );
}

export default DocumentCreation;
