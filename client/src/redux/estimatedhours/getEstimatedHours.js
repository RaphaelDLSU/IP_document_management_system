import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc } from 'firebase/firestore'

export const getEstimatedHours =
    ({ startDate, endDate }, setError) =>
        async (dispatch) => {
            // Store minutes worked
            let minutesWorked = 0;

            // Validate input
            if (endDate < startDate) {
                return 0;
            }

            // Define work range
            const workHoursStart = 9; // 9:00 AM
            const workHoursEnd = 18; // 6:00 PM
            const includeWeekends = false; // Set to true if weekends should be included

            // Loop while currentDate is less than end Date (by minutes)
            let current = new Date(startDate);
            while (current <= endDate) {
                // Check if the current time is within work hours and not on a weekend
                if (
                    current.getHours() >= workHoursStart &&
                    current.getHours() < workHoursEnd &&
                    (includeWeekends ? current.getDay() !== 0 && current.getDay() !== 6 : true)
                ) {
                    minutesWorked++;
                }

                // Increment current time by 1 minute
                current.setTime(current.getTime() + 1000 * 60);
            }

            // Return the number of hours
            return Math.ceil(minutesWorked / 60);
        };