import {
  faFile,
  faFileAlt,
  faFileAudio,
  faFileImage,
  faFileVideo,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import Dropdown from 'react-bootstrap/Dropdown';

import CreateFile from "../../CreateFile/index.js";
import UploadFile from "../../UploadFile/index.js";
import CreateFolder from "../../CreateFolder/index.js";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { ReactComponent as ButtonIcon } from "../../../assets/icons/robot.svg";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {
  getAdminFiles,
  getAdminFolders,
  getUserFiles,
  getUserFolders,
} from "../../../redux/actionCreators/filefoldersActionCreators";
import SubNav from "../SubNav.js";
import { FaFolder } from "react-icons/fa";
import ListGroup from 'react-bootstrap/ListGroup';
import { FaFileAlt } from "react-icons/fa";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import { Multiselect } from "multiselect-react-dropdown";
import { where, collection, getDocs, addDoc, runTransaction, orderBy, query, serverTimestamp, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'
import ProgressBar from 'react-bootstrap/ProgressBar';
import moment from 'moment'
import Table from 'react-bootstrap/Table';
import { FaTrashAlt } from "react-icons/fa";
const FolderComponent = () => {
  const [showChatbot, toggleChatbot] = useState(false);

  const [myState, setMyState] = useState([]);
  const { folderId } = useParams();
  const db = getFirestore()
  const { folders, isLoading, userId, files, user } = useSelector(
    (state) => ({
      folders: state.filefolders.userFolders,
      files: state.filefolders.userFiles,
      isLoading: state.filefolders.isLoading,
      userId: state.auth.userId,
      user: state.auth.user

    }),
    shallowEqual
  );
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const storage = getStorage();
  const [role, setRole] = useState()
  const [projects, setProjects] = useState([])
  const [deleteFile, setDeleteFile] = useState()

  const dispatch = useDispatch();
  const history = useHistory();

  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteConfirm = async (docId) => {
    setDeleteFile(docId)
    setShow4(true)

  };
  const isCadFile = (fileName) => {
    const cadExtensions = ['.dwg', '.dxf', '.step']; // Add other CAD extensions as needed
    const fileExtension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    return cadExtensions.includes(fileExtension);
  }
  useEffect(() => {
    if (isLoading) {
      dispatch(getAdminFolders());
      dispatch(getAdminFiles());
    }
    if (!folders && !files) {
      dispatch(getUserFolders(userId));
      dispatch(getUserFiles(userId));
    }
  }, [dispatch, folders, isLoading]);

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


  const userFolders =
    folders && folders.filter((file) => file.data.parent === folderId);

  const currentFolder =
    folders && folders.find((folder) => folder.docId === folderId);

  const createdFiles =
    files &&
    files.filter(
      (file) => file.data.parent === folderId && file.data.url === ""
    );

  const uploadedFiles =
    files &&
    files.filter(
      (file) => file.data.parent === folderId && file.data.url !== ""
    );



  const [list1, setList1] = useState(userFolders);
  const [list2, setList2] = useState(createdFiles);
  const [list3, setList3] = useState(uploadedFiles);
  console.log('UPLOADED FILES: ' + uploadedFiles + list3)

  const [filterArray, setFilterArray] = useState([
    { name: 'Design', group: 'Type' },
    { name: 'Document', group: 'Type' },
    { name: 'RFA', group: 'Type' },
    { name: 'RFI', group: 'Type' }
  ])
  const [fileSelected, setFileSelected] = useState()
  const [fileSelectedId, setFileSelectedId] = useState()

  const [filterArraySearch, setFilterArraySearch] = useState([])

  const handleSearch = (term) => {

    const filteredList1 = userFolders.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );
    var filteredList2
    if (searchTerm == "" && !filterArraySearch.length) {

      filteredList2 = createdFiles.filter(item =>
        item.data.metadata.filter(value => filterArraySearch.includes(value))
      );
    } else if (searchTerm != "" && !filterArraySearch.length) {

      filteredList2 = createdFiles.filter(item =>
        item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
      );
    } else {
      console.log(searchTerm)

      filteredList2 = createdFiles.filter(item =>
        item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase() &&
          item.data.metadata.filter(value => !filterArraySearch.includes(value)))
      );
    }


    const filteredList3 = uploadedFiles.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );

    setList1(filteredList1);
    setList2(filteredList2);
    setList3(filteredList3)


  };


  const handleDeleteFile = async (docId) => {
    await deleteDoc(doc(db, "files", docId)).then(result => setMyState(result));
    toast.success("File deleted Successfully!");
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
            history: arrayUnion({ name: file.name, timestamp: new Date(), user: user.data.displayName })
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

  useEffect(async () => {

    if (uploadedFiles != null && list3 == null) {
      setList1(userFolders);
      setList2(createdFiles);
      setList3(uploadedFiles)
      console.log('IN USE EFFECT')
    }

  }, [uploadedFiles])

  useEffect(async () => {

    setList1(userFolders);
    setList2(createdFiles);
    setList3(uploadedFiles)
    console.log('IN USE EFFECT FOLDER ID')


  }, [folderId])


  // if (
  //   userFolders &&
  //   userFolders.length < 1 &&
  //   createdFiles &&
  //   createdFiles.length < 1 &&
  //   uploadedFiles &&
  //   uploadedFiles.length < 1
  // ) {
  //   return (
  //     <>
  //       <SubNav currentFolder={currentFolder} />
  //       <Row>
  //         <Col md="12">
  //           <p className="text-center small text-center my-5">Empty Folder</p>
  //         </Col>
  //       </Row>
  //     </>
  //   );
  // }
  return (
    <>
      <SubNav currentFolder={currentFolder} />
      <Col
        md={12}
        className={"d-flex align-items-center px-5 pt-3 justify-content-between"}
      >
        {currentFolder && currentFolder !== "root folder" ? (
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
            <p>Root</p>
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
      <p></p><p></p>
      <ListGroup>
        {userFolders && userFolders.length > 0 && list1 && (
          <>
            {list1.map(({ data, docId }) => (
              < ListGroup.Item
                action onDoubleClick={() => history.push(`/dashboard/folder/${docId}`)}
                key={docId}
              >
                <FaFolder /> {data.name}

              </ListGroup.Item>
            ))}
          </>
        )}
        {createdFiles && createdFiles.length > 0 && list2 && (
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
        {uploadedFiles && uploadedFiles.length > 0 && list3 && (
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
                    <td>{item.name}</td>
                    <td>{moment(item.timestamp.toDate()).format('l')}</td>
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
            <Button variant="primary" onClick={() => handleUpdateSubmit(false)}>Close</Button>

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
    </>
  );
};

export default FolderComponent;
