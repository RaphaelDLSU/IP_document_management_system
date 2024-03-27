import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'
import notifsModel from "../../models/notifs";
import { toast } from "react-toastify";
export const createNotifs =
  ({ title, message, receiverID, link }, setError) =>
    async (dispatch) => {

      console.log(title + ' ' + message + ' ' + receiverID + ' ' + link)
      const database = getFirestore()
      const notifsRef = collection(database, "notifs")

      await addDoc(notifsRef, notifsModel(receiverID, title, message, link)).then(() => {
        toast.success('DOne')
      });
    };