import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc } from 'firebase/firestore'

export const getEstimatedHours =
    ({ startDate, endDate }, setError) =>
        async (dispatch) => {
            // Handle invalid input
            if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
                return new Error("Invalid input: Start and End date must be Date objects");
            }

            // Calculate working hours for a single day within working week
            const calculateDailyWorkingHours = (date) => {
                const startOfWork = Math.max(date, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0));
                const endOfWork = Math.min(endDate, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0));
                return Math.max(0, endOfWork - startOfWork);
            };

            // Check if dates are within working week (Mon-Fri)
            if (![...Array(endDate.getDay() + 1).keys()].every(day => new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000).getDay() <= 4)) {
                return new Error("Start and End date must be within a Monday-Friday work week");
            }

            // Calculate working hours for start and end days (if applicable)
            let totalWorkingHours = new Date(0);
            if (startDate.getDay() !== endDate.getDay()) {
                totalWorkingHours = new Date(calculateDailyWorkingHours(startDate));
                totalWorkingHours.setHours(totalWorkingHours.getHours() + calculateDailyWorkingHours(endDate));
            } else {
                totalWorkingHours = new Date(calculateDailyWorkingHours(startDate));
            }

            // Convert to hours
            return totalWorkingHours.getHours()+1;
        };