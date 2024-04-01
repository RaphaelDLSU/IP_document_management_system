import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'
import { createNotifs } from "../notifs/createNotif";
import moment from "moment";
import { toast } from 'react-toastify';
export const createRFI =
  ({ category, name, nameEmail, deadline, project, desc, images, submitter, date, response, id, step, origId, date2 }, setError) =>
    async (dispatch) => {
      const database = getFirestore()
      const storage = getStorage();
      let storageRef
      if (step == 1) {
        storageRef = ref(storage, 'rfiFiles/before' + id);
      } else if (step == 2) {
        storageRef = ref(storage, 'rfiFiles/after' + id);
      }
      console.log('DISPATHCINGGGGs FILES: ' + images)

      // Create a new PDFDocument
      const formUrl = "https://firebasestorage.googleapis.com/v0/b/italpinas-dms.appspot.com/o/files%2FgHUFtURzuuU0ZW5us1KuogcKpKi2%2FRFI_Template_v2.pdf?alt=media&token=200bdf06-2083-4947-a0b2-4685f74bf5d8";
      const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

      //Load PDF
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      //Get Form
      const form = pdfDoc.getForm();

      //Get all fields
      const rfiField = form.getTextField("rfi");
      const dateField = form.getTextField("Date1");
      const submitToField = form.getTextField("Submitted_To");
      const neededByField = form.getTextField("Needed_By");
      const projectNameField = form.getTextField("Project_Name");
      const projectNumberField = form.getTextField("Project_Number");
      const submitByField = form.getTextField("Submitted_By");
      const rfiDescriptionField = form.getTextField("RFI_Desc");
      const submitByField2 = form.getTextField("Submitted_By_2");
      const responseDescriptionField = form.getTextField("Response_Desc");
      const dateField2 = form.getTextField("Date2");
      const responseByField = form.getTextField("Response_By");

      //Fill in basic fields
      rfiField.setText(id);
      if (step == 1) {
        dateField.setText(moment(new Date()).format('l'));
      } else if (step == 2) {
        dateField.setText(moment(date.toDate()).format('l'));
      }


      // Create a Date object from the timestamp
      const dateObject = new Date(deadline * 1000); // Multiply by 1000 to convert seconds to milliseconds

      // Extract the components (month, day, and year)
      const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
      const day = dateObject.getDate();
      const year = dateObject.getFullYear();
      const formattedDate = `${month}/${day}/${year}`


      submitToField.setText('Manager');
      if (step == 1) {
        neededByField.setText(moment(new Date(deadline)).format('l'));
      } else if (step == 2) {
        neededByField.setText(moment(deadline.toDate()).format('l'));
      }

      projectNameField.setText(project);
      projectNumberField.setText(category);
      submitByField.setText(name);
      rfiDescriptionField.setText(desc);
      submitByField2.setText(name);
      responseDescriptionField.setText(response);
      if (step == 1) {
        dateField2.setText('');
      } else if (step == 2) {
        dateField2.setText(moment(new Date()).format('l'));
      }
      responseByField.setText(submitter);

      function isPng(url) {
        console.log('URL: ' + url)
        // Remove any query parameters from the URL
        const cleanUrl = url.split('?')[0];

        // Split the URL by dots to get the file extension
        const parts = cleanUrl.split('.');
        const extension = parts[parts.length - 1].toLowerCase();

        // Define the image extensions to test against
        const imageExtensions = ['png'];

        // Check if the extension matches any in the list
        return imageExtensions.includes(extension);
      }



      for (const image of images) {
        const imgUrl = image
        const imgBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())

        let imageByte
        if (isPng(imgUrl)) {
          imageByte = await pdfDoc.embedPng(imgBytes)
        } else {
          imageByte = await pdfDoc.embedJpg(imgBytes)
        }
        const page = pdfDoc.addPage()

        const imgDims = imageByte.scale(0.25)

        page.drawImage(imageByte, {
          x: page.getWidth() / 2 - imgDims.width / 2,
          y: page.getHeight() / 2 - imgDims.height / 2,
          width: imgDims.width,
          height: imgDims.height,
        })
      }



      const newDeadline = new Date(deadline)
      let pdfUrl
      // Serialize the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const uploadTask = uploadBytesResumable(storageRef, blob);

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
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL)
            pdfUrl = downloadURL
            const requestRef = collection(database, "requests")
            if (step == 1) {
              await addDoc(requestRef, {
                name: name,
                deadline: newDeadline,
                project: project,
                date: new Date(),
                desc: desc,
                images: images,
                submitter: submitter,
                date: date,
                response: response,
                url: pdfUrl,
                status: 'for assign',
                identifier: id,
                nameEmail: nameEmail,
                type: 'RFI',
                category: category
              }).then(() => {
                dispatch(createNotifs({
                  title: 'REQUEST SUBMITTED: ' + name,
                  message: 'An RFI was submitted by ' + id + '. Please check the Requests Manager page to assign an employee to the RFI',
                  receiverID: 'manager@gmail.com',
                  link: 'requestsmanager'
                }))
                toast.success('Creation of Request Done')
              })
            }
            if (step == 2) {
              const requestDocRef = doc(database, "requests", origId);
              await updateDoc(requestDocRef, {
                submittedUrl: pdfUrl,
                status: 'for approval',
                assignTo: 'manager@gmail.com',
                date2: new Date(),
              }).then(() => {
                dispatch(createNotifs({
                  title: 'NEW REQUEST APPROVAL: ' + name,
                  message: 'An RFI was submitted for approval. Please check the Requests Manager page to view the needed approval',
                  receiverID: 'manager@gmail.com',
                  link: 'requestsmanager'
                }))
                toast.success('Done. Please wait for the approval of your submission.')
              })
            }
          });
        },
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");



    };