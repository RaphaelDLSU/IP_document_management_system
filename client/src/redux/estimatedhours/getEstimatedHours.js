import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc } from 'firebase/firestore'

export const getEstimatedHours =
    ({ startDate, endDate }, setError) =>
        async (dispatch) => {
            console.log(startDate + ' ' + endDate)

            endDate.setHours(endDate.getHours() + 23); // Add 23 hours
            endDate.setMinutes(endDate.getMinutes() + 59); // Add 59 minutes
            endDate.setSeconds(endDate.getSeconds() + 59); // Add 59 seconds

            function getWorkingHours(startDate, endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Define working hours
                const workStartHour = 9;
                const workEndHour = 17;

                // Helper function to check if a date is a weekend
                function isWeekend(date) {
                    const day = date.getDay();
                    return day === 0 || day === 6;
                }

                // Helper function to adjust time to working hours
                function adjustToWorkingHours(date) {
                    const hours = date.getHours();
                    if (hours < workStartHour) {
                        date.setHours(workStartHour, 0, 0, 0);
                    } else if (hours >= workEndHour) {
                        date.setHours(workEndHour, 0, 0, 0);
                    }
                    return date;
                }

                // Initialize total working hours
                let totalHours = 0;

                // Loop through each day between start and end date
                let currentDate = new Date(start);

                while (currentDate <= end) {
                    if (!isWeekend(currentDate)) {
                        // Adjust start and end times within working hours
                        const workStart = new Date(currentDate);
                        workStart.setHours(workStartHour, 0, 0, 0);
                        const workEnd = new Date(currentDate);
                        workEnd.setHours(workEndHour, 0, 0, 0);

                        let startBoundary = new Date(currentDate);
                        if (currentDate.getDate() === start.getDate() &&
                            currentDate.getMonth() === start.getMonth() &&
                            currentDate.getFullYear() === start.getFullYear()) {
                            startBoundary = adjustToWorkingHours(start);
                        } else {
                            startBoundary = workStart;
                        }

                        let endBoundary = new Date(currentDate);
                        if (currentDate.getDate() === end.getDate() &&
                            currentDate.getMonth() === end.getMonth() &&
                            currentDate.getFullYear() === end.getFullYear()) {
                            endBoundary = adjustToWorkingHours(end);
                        } else {
                            endBoundary = workEnd;
                        }

                        // Calculate working hours for the current day
                        if (startBoundary < endBoundary) {
                            totalHours += (endBoundary - startBoundary) / (1000 * 60 * 60);
                        }
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                    currentDate.setHours(0, 0, 0, 0); // Reset to the beginning of the day
                }
                totalHours = Math.round(totalHours)

                return totalHours;
            }


            // Convert to hours
            return getWorkingHours(startDate,endDate);
        };