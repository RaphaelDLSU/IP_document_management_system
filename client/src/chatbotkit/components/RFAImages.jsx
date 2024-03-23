// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import Options from './Options/Options';
import { ConditionallyRender } from "react-util-kit";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getCountFromServer, where, collection, getDocs, addDoc, doc, runTransaction, orderBy, query, serverTimestamp, getFirestore, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { createRFA } from '../../redux/requests/createRFA';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import './styles.css'
const RFAImages = props => {
    const { setState, actionProvider, project, rfaDesc } = props;
    const [displaySelector, toggleDisplaySelector] = useState(true);
    const [task, setTask] = useState('');
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
        console.log('RFA DESC: '+rfaDesc)
        setImageButton([...imageButton, { id: imageButton.length }]);
    };

    const handleImageUpload = (index, event) => {

        
        // Handle image upload logic here, e.g., save the image to state or perform other actions
        const newItems = [...imageInputs, event.target.files[0]]

        setImageInputs(newItems)

    };
    const handleSubmit = async () => {

        const coll = collection(database, "requests");
        const snapshot = await getCountFromServer(coll);
        let newArray = []
        var bar = new Promise((resolve, reject) => {
            imageInputs.forEach((image, index, array) => {
                console.log('FILE: ' + image)
                const storageRef = ref(storage, 'rfaImages/' + image.name);
                const uploadTask = uploadBytesResumable(storageRef, image);

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

                            newArray.push(downloadURL)
                            if (index === array.length - 1) resolve();
                        });
                    }
                );

            })
        })
        bar.then(() => {
            console.log('URL 1: ' + newArray)
            dispatch(
                createRFA({
                    name: user.data.displayName,
                    deadline: 'None yet',
                    project: project,
                    desc: rfaDesc,
                    images: newArray,
                    submitter: '',
                    date: '',
                    response:'',
                    id:'RFA-'+toString(snapshot.data().count +1),
                    step:1,
                    nameEmail:user.data.uid,
                    check:''
                })
            );
        });
    };
    return (
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

                        {/* Button to add more image upload inputs */}
                        <button onClick={addImageInput}>Add Image</button>
                        
                        <button className="airport-button-confirm" onClick={handleSubmit}>Confirm</button>
                    </>
                }
                elseShow={
                    <>
                        <p>
                            Great! You have included your images for the RFA!
                        </p>
                    </>
                }
            />
        </div>
    );
};

export default RFAImages;