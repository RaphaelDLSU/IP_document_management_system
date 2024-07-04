import {
  faFileImage,
  faFileAlt,
  faFileAudio,
  faFileVideo,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./index.css";
import Dropdown from 'react-bootstrap/Dropdown';
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaFolder } from "react-icons/fa";
import ListGroup from 'react-bootstrap/ListGroup';
import { FaFileAlt } from "react-icons/fa";
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';
import { FaTrash } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import { FaTrashAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import moment from 'moment'
import Table from 'react-bootstrap/Table';

import {
  getAdminFiles,
  getAdminFolders,
  getUserFiles,
  getUserFolders,
} from "../../../redux/actionCreators/filefoldersActionCreators";
import SubNav from "../SubNav.js";
import { Multiselect } from "multiselect-react-dropdown";
import '../../../botstyle.css'
import MessageParser from "../../../chatbotkit/MessageParser.js";
import ActionProvider from "../../../chatbotkit/ActionProvider.js";
import config from "../../../chatbotkit/config.js";
import '../../../botstyle.css';
import { ConditionallyRender } from "react-util-kit";
import { Chatbot } from 'react-chatbot-kit'
import { ReactComponent as ButtonIcon } from "../../../assets/icons/robot.svg";
import { where, collection, getDocs, addDoc, runTransaction, orderBy, query, serverTimestamp, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'
import CreateFile from "../../CreateFile/index.js";
import UploadFile from "../../UploadFile/index.js";
import CreateFolder from "../../CreateFolder/index.js";
import BreadCrum from "../BreadCrum.js/index.js";
import Form from 'react-bootstrap/Form';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Home = () => {
  const [myState, setMyState] = useState([]);
  const storage = getStorage();

  const db = getFirestore()
  const [showChatbot, toggleChatbot] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [role, setRole] = useState()
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  const [progress, setProgress] = useState(0)
  const [deleteFile, setDeleteFile] = useState()
  const isCadFile = (fileName) => {
    const cadExtensions = ['.dwg', '.dxf', '.step']; // Add other CAD extensions as needed
    const fileExtension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    return cadExtensions.includes(fileExtension);
  }
  const [plainArray, setPlainArray] = useState([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5"
  ]);
  const [filterArray, setFilterArray] = useState([
    { name: 'Design', group: 'Type' },
    { name: 'Document', group: 'Type' },
    { name: 'RFA', group: 'Type' },
    { name: 'RFI', group: 'Type' }
  ])
  const [fileSelected, setFileSelected] = useState()
  const [fileSelectedId, setFileSelectedId] = useState()

  const [filterArraySearch, setFilterArraySearch] = useState([])
  const [projects, setProjects] = useState([])



  const [newArray, setNewArray] = useState([])
  const [selectedFile, setSelectedFile] = useState();



  const handleDeleteFolder = async (docId) => {
    await deleteDoc(doc(db, "docs", docId)).then(result => setMyState(result));
    toast.success("Folder deleted Successfully!");


  };
  const handleDeleteConfirm = async (docId) => {
    setDeleteFile(docId)
    setShow4(true)

  };

  const handleDeleteFile = async (docId) => {
    await deleteDoc(doc(db, "files", deleteFile)).then(result => setMyState(result)).then(setShow4(false));
    toast.success("File deleted Successfully!");



  };

  let currentFolder = 'root folder'


  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading, adminFolders, allUserFolders, userId, allUserFiles, user } =
    useSelector(
      (state) => ({
        isLoading: state.filefolders.isLoading,
        adminFolders: state.filefolders.adminFolders,
        allUserFolders: state.filefolders.userFolders,
        allUserFiles: state.filefolders.userFiles,
        userId: state.auth.userId,
        user: state.auth.user
      }),
      shallowEqual
    );




  const userFolders =
    allUserFolders &&
    allUserFolders.filter((folder) => folder.data.parent === "");



  const createdUserFiles =
    allUserFiles &&
    allUserFiles.filter(
      (file) => file.data.parent === "" && file.data.url === ""
    );
  const uploadedUserFiles =
    allUserFiles &&
    allUserFiles.filter(
      (file) => file.data.parent === "" && file.data.url !== ""
    );


  const [list1, setList1] = useState(userFolders);
  const [list2, setList2] = useState(createdUserFiles);
  const [list3, setList3] = useState(uploadedUserFiles);




  useEffect(async () => {
    if (user) {
      const s = query(collection(db, "users"), where("email", "==", user.data.uid));
      const querySnapshot = await getDocs(s);
      querySnapshot.forEach((doc) => {
        setRole(doc.data().role)
      });
    }
    const getProjects = async () => {
      const q = query(collection(db, 'projects'))
      await getDocs(q).then((project) => {
        let projectData = project.docs.map((doc) => ({ ...doc.data(), id: doc.id }))


        setProjects(projectData)
        // setFilterArray(prevState => [...prevState, ...projectData.map(obj => ({ ...obj, group: 'Project' }))])

        console.log(JSON.stringify(filterArray))

      }).catch((err) => {
        console.log(err);
      })
    }
    getProjects()
  }, [])

  useEffect(() => {
    if (isLoading && !adminFolders) {
      dispatch(getAdminFolders());
      dispatch(getAdminFiles());

    }
    if (!userFolders) {
      dispatch(getUserFiles(userId));
      dispatch(getUserFolders(userId));
      console.log('inside2: ' + userFolders + 'here: ' + userId)

    }

  }, [dispatch, isLoading]);


  useEffect(() => {

    if (list1 == null && list2 == null && list3 == null) {
      setList1(userFolders)
      setList2(createdUserFiles)
      setList3(uploadedUserFiles)

      console.log(userFolders)
      console.log(createdUserFiles)
      console.log(uploadedUserFiles)
    }
  }, [userFolders]);

  useEffect(() => {


    console.log('Filter Array : ' + JSON.stringify(filterArray))
  }, [filterArray]);

  const [searchTerm, setSearchTerm] = useState('');


  const handleSearch = (term) => {
    console.log('Filter: ' + filterArraySearch)

    const filteredList1 = userFolders.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );
    var filteredList2
    if (searchTerm == "" && !filterArraySearch.length <= 0) {

      filteredList2 = createdUserFiles.filter(item =>
        item.data.metadata.filter(value => filterArraySearch.includes(value))
      );
    } else if (searchTerm != "" && filterArraySearch.length <= 0) {

      filteredList2 = createdUserFiles.filter(item =>
        item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
      );
    } else {
      console.log(filterArraySearch)

      filteredList2 = createdUserFiles.filter(item =>
        item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase() &&
          item.data.metadata.filter(value => !filterArraySearch.includes(value)))
      );
    }

    const filteredList3 = uploadedUserFiles.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );

    setList1(filteredList1);
    setList2(filteredList2);
    setList3(filteredList3)


  };

  const onSelect = (selectedList, selectedItem) => {

    setFilterArraySearch(prevArray => [...prevArray, selectedItem.name])
    console.log('selected item: ' + selectedItem.name + 'SetFilterArray onSelect ' + JSON.stringify(filterArraySearch))


  }

  const onRemove = (selectedList, selectedItem) => {
    setFilterArraySearch(filterArraySearch.filter(elem => elem !== selectedItem.name))
    console.log('SetFilterArray onRemove ' + JSON.stringify(filterArraySearch))
  }

  const handleVersionHistory = (data, id) => {
    setShow(true)
    setFileSelected(data)
    setFileSelectedId(id)

    console.log('DATA : ' + data.name)

  }

  const handleUpdate = (data, id) => {
    setShow2(true)
    setFileSelected(data)
    setFileSelectedId(id)
  }

  const handleUploadReq = async (e) => {
    e.preventDefault();

    const file = e.target.files
    console.log('FILE= ' + file[0])

    setSelectedFile(e.target.files);

  }

  const handleUpdateSubmit = async (e) => {
    setShow3(true)
    const file = selectedFile[0]

    const filesRef = doc(db, "files", fileSelectedId);

    console.log('FILE ' + user.data.displayName)

    var metadocu
    if (isCadFile(file.name)) {
      metadocu = 'Design'
    } else {
      metadocu = 'Document'
    }

    const storageRef = ref(storage, 'storedFiles/' + fileSelectedId + '/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, '');

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress)

        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('File available at', downloadURL);

          await updateDoc(filesRef, {
            url: downloadURL,
            metadata: [metadocu],
            name: file.name,
            history: arrayUnion({ name: file.name, timestamp: new Date(), user: user.data.displayName, url: downloadURL })
          }).then(() => {
            setShow3(false)
            setShow2(false)
            toast.success('File Updated!')
          }

          );
        });
      }
    );

  }

  if (isLoading && !list1 && !list2 && !list3 && projects == '') {

    return (
      <div className='loadingcontain'>
        <Spinner className='loading' animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="app-chatbot-container">
        <ConditionallyRender
          ifTrue={showChatbot}
          show={
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          }
        />
      </div>
      {role && (
        <>
          {role == 'Requestor' && (
            <button
              className="app-chatbot-button"
              onClick={() => toggleChatbot((prev) => !prev)}
            >
              <ButtonIcon className="app-chatbot-button-icon" />
            </button>
          )}
        </>
      )}
      <Col
        md={12}
        className={"d-flex align-items-center px-5 pt-3 justify-content-between"}
      >

        {currentFolder && currentFolder !== "root folder" ? (
          <>
            <BreadCrum currentFolder={currentFolder} />
            {currentFolder.data.createdBy !== "admin" && (
              <div className="ml-auto col-md-5 d-flex justify-content-end">

                <UploadFile currentFolder={currentFolder} />
                &nbsp;
                <CreateFile currentFolder={currentFolder} />
                &nbsp;
                <CreateFolder currentFolder={currentFolder} />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="ml-auto d-flex justify-content-end" >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Multiselect
                options={filterArray}
                groupBy="group"
                displayValue="name"
                showCheckbox={true}
                onSelect={onSelect} // Function will trigger on select event
                onRemove={onRemove} // Function will trigger on remove event
              />
              <button onClick={handleSearch}>Search</button>

            </div>
            <div className="ml-auto col-md-5 d-flex justify-content-end">

              <UploadFile currentFolder={currentFolder} />
              &nbsp;
              <CreateFile currentFolder={currentFolder} />
              &nbsp;
              <CreateFolder currentFolder={currentFolder} />
            </div>
          </>
        )}
      </Col>
      <ListGroup >
        <p></p><p></p>
        {userFolders && userFolders.length > 0 && list1 && list1.length > 0 && (
          <>
            {list1.map(({ data, docId }) => (

              < ListGroup.Item
                action onDoubleClick={() => history.push(`/dashboard/folder/${docId}`)}
                key={docId}
              >
                <FaFolder /> &nbsp;&nbsp;&nbsp; {data.name}

              </ListGroup.Item>
            ))}

          </>
        )}
        {createdUserFiles && createdUserFiles.length > 0 && list2 && list2.length > 0 && (
          <>
            {list2.map(({ data, docId }) => (
              <div class="parent">
                <div class="children-1">
                  <ListGroup.Item
                    action onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                    key={docId}
                  >
                    <FaFileAlt />&nbsp;&nbsp;&nbsp;{data.name}

                  </ListGroup.Item></div>
                {role && (
                  <>
                    {role != 'Requestor' && (
                      <div class="children-2">
                        {/* <Button onClick={() => handleDeleteFile(docId)}><FaTrashAlt /></Button> */}
                        <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDeleteFile(docId)}>Delete</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleVersionHistory(data, docId)}>Version History</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleUpdate(data, docId)}>Update</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                  </>
                )}

              </div>
            ))}
          </>
        )}
        {uploadedUserFiles && uploadedUserFiles.length > 0 && list3 && list3.length > 0 && (
          <>

            {list3.map(({ data, docId }) => (
              <div class="parent">
                <div class="children-1">
                  <ListGroup.Item
                    action onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                    key={docId}
                  >
                    <FaFileAlt />&nbsp;&nbsp;&nbsp;{data.name}

                  </ListGroup.Item></div>
                {role && (
                  <>
                    {role != 'Requestor' && (
                      <div class="children-2">
                        {/* <Button onClick={() => handleDeleteFile(docId)}><FaTrashAlt /></Button> */}
                        <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDeleteConfirm(docId)}>Delete</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleVersionHistory(data, docId)}>Version History</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleUpdate(data, docId)}>Update</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                  </>
                )}

              </div>
            ))}
          </>
        )}
      </ListGroup>

      {fileSelected && (
        <Modal
          show={show}
          onHide={() => setShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Version History</Modal.Title>
          </Modal.Header>
          <Modal.Body>


            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date Updated</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {fileSelected.history.map(item => (
                  <tr key={item}>
                    <td><a href={item.url}>{item.name}</a></td>                    <td>{moment(item.timestamp.toDate()).format('l')}</td>
                    <td>{item.user}</td>
                  </tr>
                ))}

              </tbody>
            </Table>
          </Modal.Body>

        </Modal>
      )}

      {fileSelected && (
        <Modal
          show={show2}
          onHide={() => setShow2(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>  Update the version of the file : {fileSelected.name}</Form.Label>
                <Form.Control required type="file" onChange={(e) => handleUploadReq(e)} />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow2(false)}>Close</Button>
            <Button variant="primary" onClick={() => handleUpdateSubmit(false)}>Update</Button>

          </Modal.Footer>
        </Modal>
      )}

      <Modal show={show3} onHide={() => setShow3(false)}>
        <Modal.Header>
          <Modal.Title>Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProgressBar now={progress} />

          {progress == 100 && (
            <p>Done! Please wait a little bit more...</p>
          )}
        </Modal.Body>

      </Modal>

      <Modal show={show4} onHide={() => setShow4(false)}>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file?
          {progress == 100 && (
            <p>Done! Please wait a little bit more...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow4(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDeleteFile(false)}>Delete</Button>

        </Modal.Footer>
      </Modal>

    </>

  );
};


export default Home;

{/* <FontAwesomeIcon
icon={
  data.name
    .split(".")
  [data.name.split(".").length - 1].includes("png") ||
    data.name
      .split(".")
    [data.name.split(".").length - 1].includes("jpg") ||
    data.name
      .split(".")
    [data.name.split(".").length - 1].includes("jpeg") ||
    data.name
      .split(".")
    [data.name.split(".").length - 1].includes("svg") ||
    data.name
      .split(".")
    [data.name.split(".").length - 1].includes("gif")
    ? faFileImage
    : data.name
      .split(".")
    [data.name.split(".").length - 1].includes("mp4") ||
      data.name
        .split(".")
      [data.name.split(".").length - 1].includes("mpeg")
      ? faFileVideo
      : data.name
        .split(".")
      [data.name.split(".").length - 1].includes("mp3")
        ? faFileAudio
        : faFileAlt
}
className="mt-3"
style={{ fontSize: "3rem" }}
/> */}