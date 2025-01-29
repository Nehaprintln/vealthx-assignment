const Claim = require('./model/claimScema')

// 1) Get all claims
Claim.find();

// 2) Get by _id
Claim.findOne({_id: ObjectId("679086475da3c3c34c845772")});

// 3)Get all claims of a specific claimType
Claim.find({claimType: "Health Insurance"});

// 4) Get claims where claimAmount is greater than 500
Claim.find({ claimAmount: { $gt: 500 } });

// 5)  Get claims filed after a specific date
Claim.find({ incidentDate: { $gt: ISODate("2025-01-01T00:00:00.000Z") } });

// 6) Get claims filed between two dates
Claim.find({ 
    incidentDate: { 
        $gte: ISODate("2025-01-01T00:00:00.000Z"), 
        $lte: ISODate("2025-01-31T00:00:00.000Z") 
    } 
});

// 7)  Find claims where description/ typ/ contains a specific word
Claim.find({
    $or: [
        {claimType: {$regex: search, $option: 'i'}},
        {claimType: {$regex: search, $option: 'i'}}
    ]
});

//Queries with Sorting & Limiting
Claim.find().sort({claimAmount: -1}).limit(10);

// UPDATE data
// 8) Update claimAmount for a specific claim
Claim.updateOne({ _id: ObjectId("679086475da3c3c34c845772") }, { $set: { claimAmount: 1500 } })

// DELET
// 9) Delete a specific claim
Claim.deleteOne({ _id: ObjectId("679086475da3c3c34c845772") });

// 10) Delete all claims before a certain date
Claim.deleteMany({ incidentDate: { $lt: ISODate("2025-01-01T00:00:00.000Z") } })

// 11) specified file 
Claim.find({ filePath: { $regex: "Vealthx-pdf.pdf$", $options: "i" } });