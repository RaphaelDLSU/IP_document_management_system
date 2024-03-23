import {
  faFile,
  faFileAlt,
  faFileAudio,
  faFileImage,
  faFileVideo,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
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
const FolderComponent = () => {
  const { folderId } = useParams();

  const { folders, isLoading, userId, files } = useSelector(
    (state) => ({
      folders: state.filefolders.userFolders,
      files: state.filefolders.userFiles,
      isLoading: state.filefolders.isLoading,
      userId: state.auth.userId,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const history = useHistory();

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

  if (isLoading) {
    return (
      <Row>
        <Col md="12">
          <h1 className="text-center my-5">Fetching data...</h1>
        </Col>
      </Row>
    );
  }

  if (
    userFolders &&
    userFolders.length < 1 &&
    createdFiles &&
    createdFiles.length < 1 &&
    uploadedFiles &&
    uploadedFiles.length < 1
  ) {
    return (
      <>
        <SubNav currentFolder={currentFolder} />
        <Row>
          <Col md="12">
            <p className="text-center small text-center my-5">Empty Folder</p>
          </Col>
        </Row>
      </>
    );
  }
  return (
    <>
      <SubNav currentFolder={currentFolder} />
      <p></p><p></p>
      <ListGroup>
        {userFolders && userFolders.length > 0 && (
          <>
            {userFolders.map(({ data, docId }) => (
              < ListGroup.Item
                action onDoubleClick={() => history.push(`/dashboard/folder/${docId}`)}
                key={docId}
              >
                <FaFolder /> {data.name}

              </ListGroup.Item>
            ))}
          </>
        )}
        {createdFiles && createdFiles.length > 0 &&  (
          <>
            {createdFiles.map(({ data, docId }) => (

              <ListGroup.Item
              action onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                key={docId}
              >
                <FaFileAlt />{data.name}

              </ListGroup.Item>
            ))}
          </>
        )}
        {uploadedFiles && uploadedFiles.length > 0 &&  (
          <>
            {uploadedFiles.map(({ data, docId }) => (
              <ListGroup.Item
              action onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                key={docId}
              >
                <FaFileAlt /> {data.name}

              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
    </>
  );
};

export default FolderComponent;
