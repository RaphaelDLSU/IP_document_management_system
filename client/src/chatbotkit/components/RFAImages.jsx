// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import { ConditionallyRender } from "react-util-kit";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getCountFromServer, where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { createRFA } from '../../redux/requests/createRFA';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import './styles.css'
import { toast } from 'react-toastify';


import ProgressBar from 'react-bootstrap/ProgressBar';
import Modal from 'react-bootstrap/Modal';
const RFAImages = props => {
    const [progress, setProgress] = useState(0)

    const [show5, setShow5] = useState(false);
    const { setState, actionProvider, project, rfaDesc, rfaDeadline } = props;
    const [displaySelector, toggleDisplaySelector] = useState(true);
    const [category, setCategory] = useState('');
    const [textBoxes, setTextBoxes] = useState(['']);
    const database = getFirestore()
    const dispatch = useDispatch();
    const storage = getStorage();
    const { isLoggedIn, user, userId } = useSelector(
        (state) => ({
            isLoggedIn: state.auth.isLoggedIn,
            user: state.auth.user,
            userId: state.auth.userId,
        }),
        shallowEqual
    );

    const [imageButton, setImageButton] = useState([]);
    const [imageInputs, setImageInputs] = useState([]);
    const [imageUrl, setImageUrl] = useState([]);

    const addImageInput = () => {
        console.log('RFA DESC: ' + rfaDesc)
        setImageButton([...imageButton, { id: imageButton.length }]);
    };

    const removeImageInput = (index) => {
        const updatedTextBoxes = [...imageButton];
        updatedTextBoxes.splice(index, 1);
        setImageButton(updatedTextBoxes);
    };



    const handleImageUpload = (index, event) => {


        // Handle image upload logic here, e.g., save the image to state or perform other actions
        const newItems = [...imageInputs, event.target.files[0]]

        setImageInputs(newItems)

    };
    const handleSubmit = async () => {

        toast.info('Submitting Request. Please Wait..')
        const coll = collection(database, "requests");
        const snapshot = await getCountFromServer(coll);
        let newArray = []
        var bar = new Promise((resolve, reject) => {
            imageInputs.forEach((image, index, array) => {
                console.log('FILE: ' + image)
                const storageRef = ref(storage, 'rfaImages/' + image.name);
                const uploadTask = uploadBytesResumable(storageRef, image);
                setShow5(true)
                uploadTask.on('state_changed',
                    (snapshot) => {


                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(progress)
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

                            newArray.push(downloadURL)
                            if (index === array.length - 1) resolve();
                        });
                    }
                );

            })
        })
        bar.then(() => {

            let projectCat
            if (project == 'Miramonti') {
                projectCat = 'MIR'
            } else if (project == "Monumento") {
                projectCat = 'MNU'
            } else if (project == 'Montecristo') {
                projectCat = 'MNT'
            } else if (project == 'Muramana') {
                projectCat = 'MUR'
            }

            const data = snapshot.data().count + 1
            console.log('URL 1: ' + newArray)
            dispatch(
                createRFA({
                    name: user.data.displayName,
                    deadline: rfaDeadline,
                    project: project,
                    desc: rfaDesc,
                    images: newArray,
                    submitter: '',
                    date: '',
                    response: '',
                    id: 'RFA-' + projectCat + '-' + category + '-' + data.toString(),
                    step: 1,
                    nameEmail: user.data.uid,
                    check: '',
                    category: category,
                })
            );
            setShow5(false)
        });
    };
    return (
        <>
            <div className="airport-selector-container">
                <ConditionallyRender
                    ifTrue={displaySelector}
                    show={
                        <>
                            {imageButton.map((input, index) => (
                                <div key={input.id}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleImageUpload(index, event)}
                                    />
                                </div>
                            ))}
                            <p></p>
                            <select id="mySelect" onChange={(e) => setCategory(e.target.value)}>
                                <option value="" disabled selected>Select Category</option>
                                <option value="Arch">Arch</option>
                                <option value="CS">CS</option>
                            </select>
                            {/* Button to add more image upload inputs */}
                            <button className="airport-button-confirm" onClick={addImageInput}>Add Image</button>
                            <p></p>
                            <button className="airport-button-confirm" onClick={removeImageInput}>
                                Remove
                            </button>

                            <button className="airport-button-confirm" onClick={handleSubmit}>Confirm</button>
                        </>
                    }
                    elseShow={
                        <>
                            <p>
                                Great! You have included your images and category for the RFA!
                            </p>
                        </>
                    }


                />
            </div>
            <Modal show={show5} onHide={() => setShow5(false)}>
                <Modal.Header>
                    <Modal.Title>Progress</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProgressBar now={progress} />

                    {progress == 100 && (
                        <p>Done! Please wait a little bit more...</p>
                    )}
                </Modal.Body>

            </Modal>

        </>


    );
};

export default RFAImages;