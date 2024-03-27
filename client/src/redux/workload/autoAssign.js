import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc } from 'firebase/firestore'

export const autoAssign =
    ({ }, setError) =>
        async (dispatch) => {
            const database = getFirestore()
            let q
            for (let i = 0; i < 30; i++) {
                let r = query(collection(database, "users"), where('tasks', '==', i), where('role', '==', 'Employee'))
                const querySnapshots = await getDocs(r)
                if (!querySnapshots.empty) {
                    querySnapshots.forEach((user) => {
                        q = doc(database,'users',user.id)
                    })
                    break
                }
            }
            const employee = await getDoc(q);

            console.log(employee.id)

            return employee.id

        };