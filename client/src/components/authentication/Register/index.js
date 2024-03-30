import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../../redux/actionCreators/authActionCreators";
import { where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, getBlob } from "firebase/storage";
import { createNotifs } from "../../../redux/notifs/createNotif";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState()
  const [ID, setID] = useState()

  const database = getFirestore()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const storage = getStorage();

  const handleSubmit = async (e) => {


    e.preventDefault();
    toast.info('Registering... Please wait')

    if (!name || !email || !password)
      return toast.dark("Please fill in all fields!");

    if (password !== confirmPassword)
      return toast.dark("Passwords do not match!");

    if (password.length < 8) {
      return toast.dark("Password must be of length 8 or more");
    }
    if (
      !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)
    ) {
      return toast.dark(
        "Password must have at least a number and a special character!"
      );
    }

    const q = query(collection(database, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      return toast.dark(
        'Email already Exists!'
      )
    });


    if (querySnapshot.empty) {

      dispatch(createNotifs({
        title: 'NEW REGISTRATION: ' + name,
        message: name+' wants to register to the system with the role '+role+ '. Please check the Registrations page',
        receiverID: 'manager@gmail.com',
        link: 'registration'
      }))
      console.log('FILE: ' + ID[0])
      const storageRef = ref(storage, 'registrationFiles/' + name + '/' + ID.name);
      const uploadTask = uploadBytesResumable(storageRef, ID[0]);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            const data = {
              name: name,
              email: email,
              password: password,
              role: role,
              url: downloadURL,
              date: new Date()
            };

            const registerRef = collection(database, 'registrations')

            await addDoc(registerRef, data).then(() => {

              toast.success('Registration successful! Please wait for the registration confirmation by the Manager')
            })
          });
        }
      );

    }


    // dispatch(registerUser(data, setError));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isLoggedIn) {
      history.push("/dashboard");
    }
  }, [error, isLoggedIn]);
  return (
    <Container>
      <Row>
        <Col md="12">
          <h1 className="display-1 my-5 text-center">Register</h1>
        </Col>
        <Col md="5" className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Control
              required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Control
              required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Control
              required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
              <Form.Control
              required
                type="password"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox" className="mb-3">
              <Form.Select required onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled selected hidden>Select Role</option>
                <option>Employee</option>
                <option>Requestor</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control required type="file" accept="image/*" onChange={(e) => setID(e.target.files)} />
            </Form.Group>
            <Form.Group controlId="formBasicBtn" className="mt-3">
              <Button
                variant="primary"
                type="submit"
                className="form-control"
                block
              >
                Register
              </Button>
            </Form.Group>
            <p className=" text-right d-flex align-items-center justify-content-end gap-2 ml-auto my-4">
              Already a Member?
              <Link to="/login" className="ml-2 text-decoration-none">
                Login
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
