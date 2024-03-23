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

import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaFolder } from "react-icons/fa";
import ListGroup from 'react-bootstrap/ListGroup';
import { FaFileAlt } from "react-icons/fa";
import '../../../App.css'
import Spinner from 'react-bootstrap/Spinner';
import { FaTrash } from "react-icons/fa";
import {
  getAdminFiles,
  getAdminFolders,
  getUserFiles,
  getUserFolders,
} from "../../../redux/actionCreators/filefoldersActionCreators";
import SubNav from "../SubNav.js";

const Home = () => {
  const [myState, setMyState] = useState([]);

  const db = getFirestore()

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };


  const handleDeleteFolder = async (docId) => {
    await deleteDoc(doc(db, "docs", docId)).then(result => setMyState(result));
    toast.success("Folder deleted Successfully!");


  };

  const handleDeleteFile = async (docId) => {
    await deleteDoc(doc(db, "files", docId)).then(result => setMyState(result));
    toast.success("File deleted Successfully!");


  };


  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading, adminFolders, allUserFolders, userId, allUserFiles } =
    useSelector(
      (state) => ({
        isLoading: state.filefolders.isLoading,
        adminFolders: state.filefolders.adminFolders,
        allUserFolders: state.filefolders.userFolders,
        allUserFiles: state.filefolders.userFiles,
        userId: state.auth.userId,
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

  const [searchTerm, setSearchTerm] = useState('');


  const handleSearch = (term) => {

    const filteredList1 = userFolders.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );

    const filteredList2 = createdUserFiles.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );

    const filteredList3 = uploadedUserFiles.filter(item =>
      item.data.name.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
    );

    setList1(filteredList1);
    setList2(filteredList2);
    setList3(filteredList3)


  };


  if (isLoading && !list1 && !list2&& !list3 ) {

    return (
      <div className='loadingcontain'>
        <Spinner className='loading' animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <button> PDF MAKER </button>


      <SubNav currentFolder="root folder" />

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

              <ListGroup.Item
                action onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                key={docId}
              >
                <FaFileAlt />&nbsp;&nbsp;&nbsp;{data.name}

              </ListGroup.Item>
            ))}
          </>
        )}
        {uploadedUserFiles && uploadedUserFiles.length > 0 && list3 && list3.length > 0 && (
          <>
            {list3.map(({ data, docId }) => (
              <ListGroup.Item
                action onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                key={docId}
              >
                <FaFileAlt /> {data.name}<FaTrash />

              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
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