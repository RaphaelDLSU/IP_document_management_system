import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, increment } from 'firebase/firestore'

export const addWorkload =
    ({ id }, setError) =>
        async (dispatch) => {
            const database = getFirestore()
            await updateDoc(doc(database, "users", id), {
                tasks: increment(1)
            })
        };