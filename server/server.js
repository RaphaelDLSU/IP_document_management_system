import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import pdf from 'pdf-parse';
import fileUploader from 'express-fileupload';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.post("/summary", async function (req, res) {
    console.log('Hello Hre')
    let sampleFile;

    let tanong = req.body.prompt


    sampleFile = req.files.uploadedFile
    const uploadPath = path.join(__dirname, '/tmp/', sampleFile.name)

    console.log('upload path: ' + uploadPath)

    sampleFile.mv(uploadPath, async function (err) {

        console.log('it worked')

        let dataBuffer = fs.readFileSync(uploadPath);
        let response

        pdf(dataBuffer).then(async function (data) {
            const completion = await openai.chat.completions.create({
                messages: [{ "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": tanong+'\n\n'+data.text }],
                model: "gpt-3.5-turbo",
            });
            res.json({
                id: new Date().getTime(),
                text: completion.choices[0].message.content,
            });
        });
    });
    console.log('Hell 2')
});

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
