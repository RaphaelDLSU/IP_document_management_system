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
import { google } from 'googleapis';
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from './credentials.json' with { type: "json" };
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

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const auth = new JWT({
    // env var values here are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
});

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;
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
                { "role": "user", "content": tanong + '\n\n' + data.text }],
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

app.post("/sheettest", async function (req, res) {


    const floors = req.body.floors
    let factSheetID = req.body.factSheetID
    console.log('Creating Sheet..')
    //create Building Surface
    const newDocBuildingSurface = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, { title: 'Building Surface - ' + req.body.project });
    const buildingSurfaceId = newDocBuildingSurface.spreadsheetId
    const doc = new GoogleSpreadsheet(buildingSurfaceId, auth);
    // await newDocBuildingSurface.share('presidentmeth@gmail.com');
    await newDocBuildingSurface.setPublicAccessLevel('writer');
    var url, url2, url3

    for (var i = 0; i < floors.length; i++) {
        const sheet = await doc.addSheet({ title: floors[i].floorName, headerValues: ['Part', 'Unit', 'Type', 'Area'] });

        var isFirstRow = false

        for (var j = 0; j < floors[i].saleableArea.length; j++) {

            if (j == 0 && !isFirstRow) {
                isFirstRow = true
                await sheet.addRow({ 'Part': 'Saleable Area', Unit: floors[i].saleableArea[j].saleableAreaUnitNumberTag, Type: floors[i].saleableArea[j].saleableAreaType, Area: floors[i].saleableArea[j].saleableAreaSize })
            } else {
                await sheet.addRow({ Unit: floors[i].saleableArea[j].saleableAreaUnitNumberTag, Type: floors[i].saleableArea[j].saleableAreaType, Area: floors[i].saleableArea[j].saleableAreaSize })
            }

        }
        if (floors[i].parkingArea.length > 0) {
            await sheet.addRow({ Unit: 'park slot', Type: 'No: ' + floors[i].parkingArea[0].numberOfParking, Area: floors[i].parkingArea[0].parkingSlotSize })
        }

        for (var j = 0; j < floors[i].serviceArea.length; j++) {
            if (j == 0) {


                await sheet.addRow({ 'Part': 'Service Area', Unit: floors[i].serviceArea[j].serviceAreaUnitNumberTag, Type: floors[i].serviceArea[j].serviceAreaType, Area: floors[i].serviceArea[j].serviceAreaSize })
            }
            else {
                await sheet.addRow({ Unit: floors[i].serviceArea[j].serviceAreaUnitNumberTag, Type: floors[i].serviceArea[j].serviceAreaType, Area: floors[i].serviceArea[j].serviceAreaSize })
            }
        }
        for (var j = 0; j < floors[i].residentialArea.length; j++) {
            if (j == 0) {

                await sheet.addRow({ 'Part': 'Residential Area', Unit: floors[i].residentialArea[j].residentialAreaUnitType, Type: floors[i].residentialArea[j].residentialAreaNumberUnit, Area: floors[i].residentialArea[j].residentialAreaSize })
            }
            else {
                await sheet.addRow({ Unit: floors[i].residentialArea[j].residentialAreaUnitType, Type: floors[i].residentialArea[j].residentialAreaNumberUnit, Area: floors[i].residentialArea[j].residentialAreaSize })
            }
        }

        for (var j = 0; j < floors[i].amenitiesArea.length; j++) {
            if (j == 0) {
                await sheet.addRow({ 'Part': 'Amenities Area', Type: floors[i].amenitiesArea[j].amenitiesAreaType, Area: floors[i].amenitiesArea[j].amenitiesAreaSize })
            }
            else {
                await sheet.addRow({ Type: floors[i].amenitiesArea[j].amenitiesAreaType, Area: floors[i].amenitiesArea[j].amenitiesAreaSize })
            }
        }
        await sheet.addRow({ 'Type': '', 'Area': '' })
        await sheet.addRow({ 'Type': 'Headers', 'Area': 'Project Name: ' + req.body.project })
        await sheet.addRow({ 'Area': 'Generated in: ' + formattedDate })
        await sheet.addRow({ 'Area': 'Author: ' + req.body.createdBy })


    }
    console.log('Building Surface Id: ' + buildingSurfaceId)
    url = `https://docs.google.com/spreadsheets/d/${buildingSurfaceId}/edit#gid=0}`;

    //create Technical Description
    const newDocTechnicalDesc = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, { title: 'Technical Description - ' + req.body.project });
    const TechnicalDescId = newDocTechnicalDesc.spreadsheetId
    const doc2 = new GoogleSpreadsheet(TechnicalDescId, auth);

    const sheet3 = await doc2.addSheet({ title: 'Technical Description', headerValues: ['Floor', 'Number', 'Name', 'Details', 'Annotations'] });
    await newDocTechnicalDesc.setPublicAccessLevel('writer');

    var parkingNumber = 0

    for (var i = 0; i < floors.length; i++) {
        var isFirstRow = false
        for (var j = 0; j < floors[i].saleableArea.length; j++) {
            if (j == 0 && !isFirstRow) {
                isFirstRow = true
                await sheet3.addRow({ Floor: floors[i].floorName, 'Number': floors[i].saleableArea[j].saleableAreaUnitNumberTag, Name: 'Unit Area:', Details: floors[i].saleableArea[j].saleableAreaSize })

            } else {
                await sheet3.addRow({ 'Number': floors[i].saleableArea[j].saleableAreaUnitNumberTag, Name: 'Unit Area:', Details: floors[i].saleableArea[j].saleableAreaSize })

            }
            await sheet3.addRow({ Name: 'Type:', Details: floors[i].saleableArea[j].saleableAreaType })
            await sheet3.addRow({ Name: 'Location:', Details: floors[i].floorName + ', ' + req.body.address })
            await sheet3.addRow({ Name: 'Owner/Developer:', Details: ' Construction Company' })
        }

        for (var j = 0; j < floors[i].parkingArea.length; j++) {

            for (var p = 0; p < floors[i].parkingArea[0].numberOfParking; p++) {
                parkingNumber++
                if (j == 0 && !isFirstRow) {
                    isFirstRow = true
                    await sheet3.addRow({ Floor: floors[i].floorName, 'Number': 'Parking Unit P-' + parkingNumber, Name: 'Unit Area:', Details: floors[i].parkingArea[0].parkingSlotSize })
                } else {
                    await sheet3.addRow({ 'Number': 'Parking Unit P-' + parkingNumber, Name: 'Unit Area:', Details: floors[i].parkingArea[0].parkingSlotSize })
                }
                await sheet3.addRow({ Name: 'Type: ', Details: 'Parking' })
                await sheet3.addRow({ Name: 'Location: ', Details: floors[i].floorName + ', ' + req.body.address })
                await sheet3.addRow({ Name: 'Owner/Developer: ', Details: ' Construction Company' })
            }

        }

        for (var j = 0; j < floors[i].residentialArea.length; j++) {
            if (j == 0 && !isFirstRow) {
                isFirstRow = true
                await sheet3.addRow({ Floor: floors[i].floorName, 'Number': 'Unit No. ' + floors[i].residentialArea[j].residentialAreaUnitType, Name: 'Unit Area:', Details: floors[i].residentialArea[j].residentialAreaSize })

            } else {
                await sheet3.addRow({ 'Number': 'Unit No. ' + floors[i].residentialArea[j].residentialAreaUnitType, Name: 'Unit Area:', Details: floors[i].residentialArea[j].residentialAreaSize })

            }
            await sheet3.addRow({ Name: 'Type:', Details: floors[i].residentialArea[j].residentialAreaNumberUnit })
            await sheet3.addRow({ Name: 'Location:', Details: floors[i].floorName + ', ' + req.body.address })
            await sheet3.addRow({ Name: 'Owner/Developer:', Details: ' Construction Company' })
        }
    }
    await sheet3.addRow({ Floor: '', Number: '' })
    await sheet3.addRow({ Floor: '', Number: '' })
    await sheet3.addRow({ Floor: 'Headers', Number: 'Project Name: ' + req.body.project })
    await sheet3.addRow({ Number: 'Generated in: ' + formattedDate })
    await sheet3.addRow({ Number: 'Author: ' + req.body.createdBy })
    console.log('Technical Description Id: ' + TechnicalDescId)

    url2 = `https://docs.google.com/spreadsheets/d/${TechnicalDescId}/edit#gid=0}`;

    //create Fact Sheet
    const newDocFactSheet = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, { title: 'Fact Sheet - ' + req.body.project });
    const factSheetId = newDocFactSheet.spreadsheetId
    const doc3 = new GoogleSpreadsheet(factSheetId, auth);
    await newDocFactSheet.setPublicAccessLevel('writer');
    const sheet2 = await doc3.addSheet({ title: 'Fact Sheet', headerValues: [ 'FLOOR LOCATION', 'UNIT NO.', 'Area (m²)', 'UNIT TYPE', 'REMARKS', 'PRICE/SQM', 'Unit Price', '12% VAT', 'MISC. FEES', 'TOTAL CONTRACT PRICE'] });

    for (var i = 0; i < floors.length; i++) {

        for (var j = 0; j < floors[i].residentialArea.length; j++) {
            if (j == 0) {
                await sheet2.addRow({ 'FLOOR LOCATION': floors[i].floorName, 'UNIT NO.': 'UNIT ' + floors[i].residentialArea[j].residentialAreaUnitType, 'UNIT TYPE': floors[i].residentialArea[j].residentialAreaNumberUnit, 'REMARKS': '', 'PRICE/SQM': '', 'Area (m²)': floors[i].residentialArea[j].residentialAreaSize })
            } else {
                await sheet2.addRow({ 'FLOOR LOCATION': '', 'UNIT NO.': 'UNIT ' + floors[i].residentialArea[j].residentialAreaUnitType, 'UNIT TYPE': floors[i].residentialArea[j].residentialAreaNumberUnit, 'REMARKS': '', 'PRICE/SQM': '', 'Area (m²)': floors[i].residentialArea[j].residentialAreaSize })

            }

            if (i == floors.length - 1) {

                await sheet2.addRow({ 'FLOOR LOCATION': ' '})
                await sheet2.addRow({ 'TOTAL CONTRACT PRICE': ' HEADERS '+"\n"+ 'Project Name: ' + req.body.project +"\n"+ ' Address: ' + req.body.address +"\n"+' Date Issued: ' + formattedDate })

            }
        }
    }
    console.log('Fact Sheet Id: ' + factSheetId)
    factSheetID = factSheetId
    url3 = `https://docs.google.com/spreadsheets/d/${factSheetId}/edit#gid=0}`;

    res.json({
        url: url,
        url2: url2,
        url3: url3,
        factSheetID: factSheetID
    });

})

app.post('/sheetupdate', async function (req, res) {
    console.log('Updating Documents...')
    const floors = req.body.floors
    const project = req.body.project
    const isCreated = req.body.isCreated
    let factSheetID = req.body.factSheetID
    const existingFactSheetURL = req.body.factSheetURL

    const newDocBuildingSurface = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, { title: 'Building Surface - ' + project });
    const buildingSurfaceId = newDocBuildingSurface.spreadsheetId
    const doc = new GoogleSpreadsheet(buildingSurfaceId, auth);
    // await newDocBuildingSurface.share('presidentmeth@gmail.com');
    await newDocBuildingSurface.setPublicAccessLevel('writer');
    var url, url2, url3

    for (var i = 0; i < floors.length; i++) {
        const sheet = await doc.addSheet({ title: floors[i].floorName, headerValues: ['Part', 'Unit', 'Type', 'Area'] });

        var isFirstRow = false

        for (var j = 0; j < floors[i].saleableArea.length; j++) {

            if (j == 0 && !isFirstRow) {
                isFirstRow = true
                await sheet.addRow({ 'Part': 'Saleable Area', Unit: floors[i].saleableArea[j].saleableAreaUnitNumberTag, Type: floors[i].saleableArea[j].saleableAreaType, Area: floors[i].saleableArea[j].saleableAreaSize })
            } else {
                await sheet.addRow({ Unit: floors[i].saleableArea[j].saleableAreaUnitNumberTag, Type: floors[i].saleableArea[j].saleableAreaType, Area: floors[i].saleableArea[j].saleableAreaSize })
            }

        }
        if (floors[i].parkingArea.length > 0) {
            await sheet.addRow({ Unit: 'park slot', Type: 'No: ' + floors[i].parkingArea[0].numberOfParking, Area: floors[i].parkingArea[0].parkingSlotSize })
        }

        for (var j = 0; j < floors[i].serviceArea.length; j++) {
            if (j == 0) {


                await sheet.addRow({ 'Part': 'Service Area', Unit: floors[i].serviceArea[j].serviceAreaUnitNumberTag, Type: floors[i].serviceArea[j].serviceAreaType, Area: floors[i].serviceArea[j].serviceAreaSize })
            }
            else {
                await sheet.addRow({ Unit: floors[i].serviceArea[j].serviceAreaUnitNumberTag, Type: floors[i].serviceArea[j].serviceAreaType, Area: floors[i].serviceArea[j].serviceAreaSize })
            }
        }
        for (var j = 0; j < floors[i].residentialArea.length; j++) {
            if (j == 0) {

                await sheet.addRow({ 'Part': 'Residential Area', Unit: floors[i].residentialArea[j].residentialAreaUnitType, Type: floors[i].residentialArea[j].residentialAreaNumberUnit, Area: floors[i].residentialArea[j].residentialAreaSize })
            }
            else {
                await sheet.addRow({ Unit: floors[i].residentialArea[j].residentialAreaUnitType, Type: floors[i].residentialArea[j].residentialAreaNumberUnit, Area: floors[i].residentialArea[j].residentialAreaSize })
            }
        }

        for (var j = 0; j < floors[i].amenitiesArea.length; j++) {
            if (j == 0) {
                await sheet.addRow({ 'Part': 'Amenities Area', Type: floors[i].amenitiesArea[j].amenitiesAreaType, Area: floors[i].amenitiesArea[j].amenitiesAreaSize })
            }
            else {
                await sheet.addRow({ Type: floors[i].amenitiesArea[j].amenitiesAreaType, Area: floors[i].amenitiesArea[j].amenitiesAreaSize })
            }
        }
        await sheet.addRow({ 'Type': '', 'Area': '' })
        await sheet.addRow({ 'Type': 'Headers', 'Area': 'Project Name: ' + req.body.project })
        await sheet.addRow({ 'Area': 'Generated in: ' + formattedDate })
        await sheet.addRow({ 'Area': 'Author: ' + req.body.createdBy })
    }


    console.log('Building Surface Id: ' + buildingSurfaceId)
    url = `https://docs.google.com/spreadsheets/d/${buildingSurfaceId}/edit#gid=0}`;


    //create Technical Description
    const newDocTechnicalDesc = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, { title: 'Technical Description - ' + project });
    const TechnicalDescId = newDocTechnicalDesc.spreadsheetId
    const doc2 = new GoogleSpreadsheet(TechnicalDescId, auth);

    const sheet3 = await doc2.addSheet({ title: 'Technical Description', headerValues: ['Floor', 'Number', 'Name', 'Details', 'Annotations'] });
    await newDocTechnicalDesc.setPublicAccessLevel('writer');

    var parkingNumber = 0

    for (var i = 0; i < floors.length; i++) {
        var isFirstRow = false
        for (var j = 0; j < floors[i].saleableArea.length; j++) {
            if (j == 0 && !isFirstRow) {
                isFirstRow = true
                await sheet3.addRow({ Floor: floors[i].floorName, 'Number': floors[i].saleableArea[j].saleableAreaUnitNumberTag, Name: 'Unit Area:', Details: floors[i].saleableArea[j].saleableAreaSize })

            } else {
                await sheet3.addRow({ 'Number': floors[i].saleableArea[j].saleableAreaUnitNumberTag, Name: 'Unit Area:', Details: floors[i].saleableArea[j].parkingSlotSize })

            }
            await sheet3.addRow({ Name: 'Type:', Details: floors[i].saleableArea[j].saleableAreaType })
            await sheet3.addRow({ Name: 'Location:', Details: floors[i].floorName + ', ' + req.body.address })
            await sheet3.addRow({ Name: 'Owner/Developer:', Details: ' Construction Company' })
        }

        for (var j = 0; j < floors[i].parkingArea.length; j++) {

            for (var p = 0; p < floors[i].parkingArea[0].numberOfParking; p++) {
                parkingNumber++
                if (j == 0 && !isFirstRow) {
                    isFirstRow = true
                    await sheet3.addRow({ Floor: floors[i].floorName, 'Number': 'Parking Unit P-' + parkingNumber, Name: 'Unit Area:', Details: floors[i].parkingArea[0].parkingSlotSize })
                } else {
                    await sheet3.addRow({ 'Number': 'Parking Unit P-' + parkingNumber, Name: 'Unit Area:', Details: floors[i].parkingArea[0].parkingSlotSize })
                }
                await sheet3.addRow({ Name: 'Type: ', Details: 'Parking' })
                await sheet3.addRow({ Name: 'Location: ', Details: floors[i].floorName + ', ' + req.body.address })
                await sheet3.addRow({ Name: 'Owner/Developer: ', Details: ' Construction Company' })
            }

        }

        for (var j = 0; j < floors[i].residentialArea.length; j++) {
            console.log(' UNIT AREA: ' + floors[i].residentialArea[j].residentialAreaSize)

            if (j == 0 && !isFirstRow) {
                isFirstRow = true
                await sheet3.addRow({ Floor: floors[i].floorName, 'Number': 'Unit No. ' + floors[i].residentialArea[j].residentialAreaUnitType, Name: 'Unit Area:', Details: floors[i].residentialArea[j].residentialAreaSize })

            } else {
                await sheet3.addRow({ 'Number': 'Unit No. ' + floors[i].residentialArea[j].residentialAreaUnitType, Name: 'Unit Area:', Details: floors[i].residentialArea[j].residentialAreaSize })

            }
            await sheet3.addRow({ Name: 'Type:', Details: floors[i].residentialArea[j].residentialAreaNumberUnit })
            await sheet3.addRow({ Name: 'Location:', Details: floors[i].floorName + ', ' + req.body.address })
            await sheet3.addRow({ Name: 'Owner/Developer:', Details: ' Construction Company' })
        }
    }
    await sheet3.addRow({ Floor: '', Number: '' })
    await sheet3.addRow({ Floor: 'Headers', Number: 'Project Name: ' + req.body.project })
    await sheet3.addRow({ Number: 'Generated in: ' + formattedDate })
    await sheet3.addRow({ Number: 'Author: ' + req.body.createdBy })

    console.log('Technical Description Id: ' + TechnicalDescId)

    url2 = `https://docs.google.com/spreadsheets/d/${TechnicalDescId}/edit#gid=0}`;

    const arrayColumn = []
    for (var i = 0; i < floors.length; i++) {
        for (var j = 0; j < floors[i].residentialArea.length; j++) {
            for (var j = 0; j < floors[i].residentialArea.length; j++) {
                var something = []
                if (j == 0) {
                    something.push(floors[i].floorName)
                    something.push(floors[i].residentialArea[j].residentialAreaUnitType)
                    something.push(floors[i].residentialArea[j].residentialAreaSize)

                    something.push(floors[i].residentialArea[j].residentialAreaNumberUnit)
                } else {
                    something.push('')
                    something.push(floors[i].residentialArea[j].residentialAreaUnitType)
                    something.push(floors[i].residentialArea[j].residentialAreaSize)

                    something.push(floors[i].residentialArea[j].residentialAreaNumberUnit)
                }
                arrayColumn.push(something)
            }
        }

    }
    console.log('Array Column :' + arrayColumn)
    const sheets = google.sheets('v4')
    sheets.spreadsheets.values.clear({
        auth: auth, spreadsheetId: factSheetID, range: "Fact Sheet!A2:D300"
    })
    sheets.spreadsheets.values.update({
        auth: auth, spreadsheetId: factSheetID, range: "Fact Sheet!A2:D300", valueInputOption: 'USER_ENTERED', resource: {
            values: arrayColumn
        }
    })

    url3 = existingFactSheetURL

    console.log('URLS : ' + url, +' ' + url2 + ' ' + url3)

    res.json({
        url: url,
        url2: url2,
        url3: url3,
    });

})


app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
