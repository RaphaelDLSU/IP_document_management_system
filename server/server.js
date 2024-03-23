import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import pdf from 'pdf-parse';
import fileUploader from 'express-fileupload';
import OpenAI from 'openai';
import path from 'path';
const app = express()

dotenv.config()
const PORT = 5000

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY // This is also the default, can be omitted
});


app.use(express.json());
app.use(fileUploader())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.post("/summary", async function (req, res) {
    console.log('Hello Hre')
    // let sampleFile;



    // sampleFile = req.files.uploadedFile
    // const uploadPath = path.join(__dirname, '/tmp/', sampleFile.name)



    // console.log('upload path: ' + uploadPath)




    // sampleFile.mv(uploadPath, async function (err) {


    //     console.log('it worked')

    //     let dataBuffer = fs.readFileSync(uploadPath);

    //     pdf(dataBuffer).then(async function (data) {
    //         await openai.completions.create({

    //             model: "gpt-3.5-turbo-instruct",
    //             prompt: data.text + "\n\nTl;dr",
    //             temperature: 0.7,
    //             max_tokens: Math.floor(data.text?.length / 2),
    //             top_p: 1.0,
    //             frequency_penalty: 0.0,
    //             presence_penalty: 1,
    //         })

    //             .then((response) => {
    //                 fs.unlinkSync(uploadPath);

    //                 res.json({
    //                     id: new Date().getTime(),
    //                     text: response.choices[0].text,
    //                 });
    //             })
    //             .catch((err) => {
    //                 console.log("ERROR:", err);
    //                 res.status(500).send("An error has occured");
    //             });
    //     });
    // });
    // console.log('Hell 2')
});

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
