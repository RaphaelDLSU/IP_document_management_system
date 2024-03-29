import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'
import notifsModel from "../../models/notifs";
import { toast } from "react-toastify";
export const createNotifs =
  ({ title, message, receiverID, link }, setError) =>
    async (dispatch) => {

      let page
      if(link == 'tasks'){
        page = 'http://localhost:3000/tasks'
      }else if(link == 'requests'){
        page = 'http://localhost:3000/requests'
      }else if(link =='registration'){
        page = "http://localhost:3000/registrations"
      }else if(link == 'files'){
        page = "http://localhost:3000/dashboard"
      }else if(link == 'workflows'){
        page = "http://localhost:3000/workflows"
      }else if(link =='requestsmanager'){
        page = "http://localhost:3000/requestsmanager"
      }


      console.log(title + ' ' + message + ' ' + receiverID + ' ' + link)
      const database = getFirestore()
      const notifsRef = collection(database, "notifs")

      await addDoc(notifsRef, notifsModel(receiverID, title, message, page)).then(() => {
      });
    };