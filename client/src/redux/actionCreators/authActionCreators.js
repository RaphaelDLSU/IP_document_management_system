import { toast } from "react-toastify";
import { auth, database } from "../../API/firebase";
import userModel from "../../models/users";
import { RESET_USER, SET_USER } from "../actions/authActions";
import { RESET_FOLDERS_FILES } from "../actions/filefoldersActions";
import { Link, useHistory } from "react-router-dom";



const setUser = (data) => ({
  type: SET_USER,
  payload: data,
});

const resetUser = () => ({
  type: RESET_USER,
});


export const registerUser =
  ({ name, email, password,role }, setError) =>
  (dispatch) => {

    toast.info('Registering User')

    console.log(name, email, password,role)
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        setError("");
        const newUser = userModel(email, name, user.user.uid,role,0);
        auth.currentUser.updateProfile({
          displayName: name,
          uid: user.user.uid,
          role:role
        });

        database.users.add(newUser).then((usr) => {
          // dispatch(
          //   setUser({
          //     userId: user.user.uid,
          //     user: { data: user.user.providerData[0] },
          //   })
          // );
          toast.success("User registered successfully!!");
        });
      }).then(()=>{
        toast.success('Registered User')

      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/email-already-in-use") {
          setError("Email Already Exists!");
        }
      });
  };

export const loginUser =
  ({ email, password }, setError) =>
  (dispatch) => {
   

    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (user) => {
        const usr = await database.users
          .where("uid", "==", user.user.uid)
          .get();
        console.log(usr.docs);
      }).then(()=>{
      })
      .catch(() => {
        setError("Invalid Email Or Password!");
      });
  };

export const getUser = () => (dispatch) => {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      dispatch(
        setUser({
          userId: auth.currentUser.uid,
          user: { data: auth.currentUser.providerData[0] },
        })
      );
    } else {
      dispatch(resetUser());
    }
  });
};

const reserFilesFolders = () => ({
  type: RESET_FOLDERS_FILES,
});

export const logoutUser = () => (dispatch) => {

  auth.signOut().then(() => {
    dispatch(resetUser());
    dispatch(reserFilesFolders());
  });
};
