const express = require('express');
const mongoose = require('mongoose')
const csv = require('fast-csv');
const fs = require('fs');

const router = express.Router();
const { Medicines, PlaceOrder } =require('./model/medicine.js');
const upload = require('./middleware/multer');

router.post('/uploadCSV',upload.single('file'),(req, res) => {
    try {
            if (req.file == undefined) {
                return res.status(400).send({
                    message: "Please upload a CSV file!"
                });
            }
            let csvData = [];
            let filePath = __dirname + '/uploads/' + req.file.filename;
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on("error", (error) => { throw error.message; })
                .on("data", (row) => { csvData.push(row); })
                .on("end", () => {
                    Medicines.insertMany(csvData,(err,data) => {
                       if(err){
                           console.log(err)
                       } else {
                           fs.unlink(filePath, () => {
                                if (err) throw err;
                                console.log(`${filePath} was deleted`);
                           });
                            res.status(200).send({
                                message:
                                    "Upload/import the CSV data into database successfully: " + req.file.originalname,
                            });
                       }
                   })
                })
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
});

router.get('/getMedicineDetails', async(req, res) => {
    let { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const medicineDetails = await Medicines.findById(id);
    res.status(200).json(medicineDetails);
})

router.get('/searchMedicine', async(req, res) => {
    let { searchText } = req.query;
    const medicineList = await Medicines.find({ "c_name": { "$regex": searchText, "$options": "i" } })
    res.status(200).json(medicineList);
})

router.post('/placeorder', async(req, res) => {
    const orderCreated = await PlaceOrder({ medicines: req.body })
    try {
        await orderCreated.save();
        res.status(201).json({ orderId: orderCreated._id });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
})

// router.get('/getMedicines', async(req, res) => {
//     const medicineList = await Medicines.find()
//     res.status(200).json(medicineList);
// })

// router.get('/placeorder', async(req, res) => {
//     const PlaceOrderList = await PlaceOrder.find()
//     res.status(200).json(PlaceOrderList);
// })

module.exports = router;
