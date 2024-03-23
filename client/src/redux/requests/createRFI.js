import { PDFDocument, rgb, StandardFonts, PDFField, PDFButton } from "pdf-lib";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { where, getDoc, collection, getDocs, addDoc, deleteDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'

export const createRFI =
  ({ name,nameEmail, deadline, project, desc, images, submitter, date, response, id, step,origId }, setError) =>
    async (dispatch) => {
      const database = getFirestore()
      const storage = getStorage();
      let storageRef
      if (step==1){
        storageRef = ref(storage, 'rfiFiles/before');
      }else if (step==2){
        storageRef = ref(storage, 'rfiFiles/after');
      }
      console.log('DISPATHCINGGGGs FILES: ' + images)

      // Create a new PDFDocument
      const formUrl = "https://firebasestorage.googleapis.com/v0/b/italpinas-dms.appspot.com/o/files%2Fwyp6vGhpxTbjrRw0RbIU0mgoOcN2%2FRFI_Template.pdf?alt=media&token=6b558def-ed48-4652-8af6-c03f90196423";
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
      const attachmentButton = form.getButton("Attachment");

      //Fill in basic fields
      rfiField.setText(id);
      if(step==1){
        dateField.setText(new Date().toLocaleDateString());
      }else if (step ==2){
        dateField.setText(new Date(date.seconds * 1000).toLocaleString());
      }
      
      submitToField.setText('Manager');
      neededByField.setText(deadline);
      projectNameField.setText(project);
      projectNumberField.setText("12345");
      submitByField.setText(name);
      rfiDescriptionField.setText(desc);
      submitByField2.setText(name);
      responseDescriptionField.setText(response);
      if(step==1){
        dateField2.setText(date);
      }else if (step ==2){
        dateField2.setText(new Date().toLocaleDateString());
      }
      responseByField.setText(submitter);




      for (const image of images) {
        const imgUrl = image
        const imgBytes = await fetch(imgUrl).then((res) => res.arrayBuffer())

        const imageByte = await pdfDoc.embedPng(imgBytes)
        const page = pdfDoc.addPage()

        const imgDims = imageByte.scale(0.25)

        page.drawImage(imageByte, {
          x: page.getWidth() / 2 - imgDims.width / 2,
          y: page.getHeight() / 2 - imgDims.height / 2,
          width: imgDims.width,
          height: imgDims.height,
        })
      }


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
            console.log('what the fuck')
            const requestRef = collection(database, "requests")
            if (step == 1) {
              await addDoc(requestRef, {
                name: name,
                deadline: deadline,
                project: project,
                date: new Date(),
                desc: desc,
                images: images,
                submitter: submitter,
                date2: date,
                response: response,
                url: pdfUrl,
                status:'for assign',
                identifier:id,
                nameEmail: nameEmail,
                type:'RFI'
              })
            }
            if(step == 2){
              const requestDocRef =  doc(database, "requests", origId);
              await updateDoc(requestDocRef, {
                submittedUrl : pdfUrl,
                status:'for approval',
                assignTo:'manager@gmail.com',
                date2: new Date(),
              });
            }
          });
        },
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");



    };