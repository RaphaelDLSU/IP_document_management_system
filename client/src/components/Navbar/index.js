import React, { useEffect, useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logoutUser } from "../../redux/actionCreators/authActionCreators";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from "react-icons";
import { BsFillPeopleFill } from "react-icons/bs";
import { PiFilesFill } from "react-icons/pi";
import { AiFillHome } from "react-icons/ai";
import { LuWorkflow } from "react-icons/lu";
import { FaTasks } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import '../Navbar/navbar.css'
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import Spinner from 'react-bootstrap/Spinner';
import { FaPersonCirclePlus } from "react-icons/fa6";
const NavbarComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const database = getFirestore()
  const [sidebarData1, setSidebarData1] = useState([])
  const { isLoggedIn, user } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
    }),
    shallowEqual
  );

  const logout = () => {
    history.push("/login")
    dispatch(logoutUser());
  };
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
  };





  useEffect(async () => {

    console.log('wtf')
    if (user) {

      let role
      const q = query(collection(database, "users"), where("email", "==", user.data.uid));
      let sidebarData
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        role = doc.data().role
      });

      console.log('USER DATA' + role)
      if (role == 'CEO') {
        sidebarData = [
          {
            title: "Home",
            path: "/",
            icon: <AiFillHome />,
            cName: "nav-text"
          },
          {
            title: "Workflows",
            path: "/workflows",
            icon: <LuWorkflow />,
            cName: "nav-text"
          },
          {
            title: "Requests",
            path: "/requests",
            icon: <MdEditDocument />,
            cName: "nav-text"
          },
          {
            title: "Tasks",
            path: "/tasks",
            icon: <FaTasks />,
            cName: "nav-text"
          },
          {
            title: "Files",
            path: "/dashboard",
            icon: <PiFilesFill />,
            cName: "nav-text"
          },
          {
            title: "Employees",
            path: "/employees",
            icon: <BsFillPeopleFill />,
            cName: "nav-text"
          },
          {
            title: "Notifications",
            path: "/notifications",
            icon: <IoIosNotifications />,
            cName: "nav-text"
          },
          {
            title: "Document Creation",
            path: "/documentcreation",
            icon: <IoDocuments />,
            cName: "nav-text"
          }
        ]
        setSidebarData1(sidebarData)
      } else if (role == 'Manager') {
        console.log('I am a manager')
        sidebarData = [
          {
            title: "Home",
            path: "/",
            icon: <AiFillHome />,
            cName: "nav-text"
          },
          {
            title: "Workflows",
            path: "/workflows",
            icon: <LuWorkflow />,
            cName: "nav-text"
          },
          {
            title: "Requests",
            path: "/requests",
            icon: <MdEditDocument />,
            cName: "nav-text"
          },
          {
            title: "Tasks",
            path: "/tasks",
            icon: <FaTasks />,
            cName: "nav-text"
          },
          {
            title: "Files",
            path: "/dashboard",
            icon: <PiFilesFill />,
            cName: "nav-text"
          },
          {
            title: "Employees",
            path: "/employees",
            icon: <BsFillPeopleFill />,
            cName: "nav-text"
          },
          {
            title: "Notifications",
            path: "/notifications",
            icon: <IoIosNotifications />,
            cName: "nav-text"
          },
          {
            title: "Document Creation",
            path: "/documentcreation",
            icon: <IoDocuments />,
            cName: "nav-text"
          },
          {
            title: "Registration",
            path: "/registrations",
            icon: <FaPersonCirclePlus />,
            cName: "nav-text"
          }
        ]
        setSidebarData1(sidebarData)
      } else if (role == 'Employee') {
        sidebarData = [
          {
            title: "Home",
            path: "/",
            icon: <AiFillHome />,
            cName: "nav-text"
          },
          {
            title: "Requests",
            path: "/requests",
            icon: <MdEditDocument />,
            cName: "nav-text"
          },
          {
            title: "Tasks",
            path: "/tasks",
            icon: <FaTasks />,
            cName: "nav-text"
          },
          {
            title: "Files",
            path: "/dashboard",
            icon: <PiFilesFill />,
            cName: "nav-text"
          },
          {
            title: "Notifications",
            path: "/notifications",
            icon: <IoIosNotifications />,
            cName: "nav-text"
          },
          {
            title: "Document Creation",
            path: "/documentcreation",
            icon: <IoDocuments />,
            cName: "nav-text"
          }
        ]
        setSidebarData1(sidebarData)
      } else if (role == 'Requestor') {
        sidebarData = [
          {
            title: "Home",
            path: "/",
            icon: <AiFillHome />,
            cName: "nav-text"
          },
          {
            title: "Files",
            path: "/dashboard",
            icon: <PiFilesFill />,
            cName: "nav-text"
          },
          {
            title: "Notifications",
            path: "/notifications",
            icon: <IoIosNotifications />,
            cName: "nav-text"
          }
        ]
        setSidebarData1(sidebarData)
      }

    }
  }, [user])


  if (!sidebarData1) {
    return (
      <div className='loadingcontain'>
        <Spinner className='loading' animation="border" variant="secondary" />
      </div>
    )
  } else {
    return (
      <>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiOutlineClose />
              </Link>
            </li>
            {sidebarData1.map((item, index) => {
              const { title, path, icon, cName } = item;
              return (
                <li key={index} className={cName}>
                  <Link to={path}>
                    {icon}
                    <span>{title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Navbar bg="dark" expand="lg" variant="dark">
          <Navbar.Brand style={{ marginLeft: "20px", cursor: 'pointer' }}>
            <FaBars onClick={showSidebar} />
          </Navbar.Brand>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{ marginRight: "auto" }}
          >
            Document Management System
          </Navbar.Brand>

          <Nav style={{ marginRight: "60px" }}>
            {isLoggedIn ? (
              <>
                <Nav.Link
                  className="text-white d-flex align-items-center justify-content-between"
                  style={{ pointerEvents: "unset", cursor: "text" }}
                >
                  Welcome,
                </Nav.Link>
                <Nav.Link
                  className="text-white d-flex align-items-center justify-content-between"
                  as={Link}
                  style={{ marginRight: "10px", marginLeft: "-10px" }}
                  to="/dashboard/profile"
                >
                  <strong>{user.data.displayName}</strong>
                </Nav.Link>

                <Navbar.Brand onClick={() => logout()}>
                  <IoLogOut style={{ cursor: 'pointer', width: '35px', height: '35px' }} />
                </Navbar.Brand>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Button}
                  variant="primary"
                  onClick={() => history.push("/login")}
                  active
                  style={{ marginRight: "5px" }}
                  size="sm"
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Button}
                  variant="success"
                  onClick={() => history.push("/signup")}
                  active
                  size="sm"
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>

        </Navbar>
      </>


    );
  }


};

export default NavbarComponent;
