import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc } from 'firebase/firestore'

export const addWorkload =
    ({ name, deadline, project, desc, images, submitter, date, response }, setError) =>
        async (dispatch) => {
            const storage = getStorage();




        };