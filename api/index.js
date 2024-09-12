const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const socketIO = require('socket.io')
const http = require('http')
const app = express();
const Server = http.createServer(app)
const port = 3000;
const multer = require('multer');
app.use(cors());
app.use(bodyParser.json());

//image upload 
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  }
});
const upload = multer({ storage: storage, limits:{
  fieldSize: 10 * 1024 * 1024,
  fields: 10, 
  parts: 10 
} });



const io = socketIO(Server, {
  cors: {
    origin: 'http://localhost:19006', // Replace with your React Native app's URL
    methods: ['GET', 'POST'],
  },
});

Server.listen(8080, () => {
  console.log('server.io is running on port 8080');
}
)
app.use(cors({
  origin: 'http://localhost:19006',
  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'sample',
  
});
app.use(bodyParser.json());



connection.connect();

// Define your API routes here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`connected to mysql`);
});

const generatesecretkey=()=>{
  const secretkey= crypto.randomBytes(32).toString('hex');
  return secretkey;
};
const secretkey = generatesecretkey();



// endpoint for login 
app.post('/login', (req, res) => {
  try{
    const { username, password } = req.body;
    // Replace with your actual query
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  
    connection.query(query, [username, password], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
   
      if (results.length === 1) {
        const user = results[0];
        const token = jwt.sign({ userId: user.id, username: user.username , userType: user.userType}, secretkey);
        return res.status(200).json({ success: true, message: 'Login successful', token });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
    });
  }catch(error){
    console.log('error logging user', error)
  }
});


//end point to get user 

app.get('/user', async (req, res) => {
  const usertoken = req.headers.authorization;

  if (!usertoken) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  try {
    const token = usertoken.split(' ')[1]; // Extract the token part
    const decodedToken = jwt.verify(token, secretkey);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    // Replace with your actual MySQL query
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [decodedToken.userId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 1) {
        const user = results[0];
        return res.json(user);
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Endpoint to save a new patient
app.post('/patients', async (req, res) => {
  try {
    const {
      name,
      patientid,
      age,
      haemoglobin,
      bloodGroup,
      mobile,
      height,
      weight,
      doctorid,
    } = req.body;

    // Replace with your actual query
    const query = 'INSERT INTO addpatient (name, patientid, age, haemoglobin, bloodGroup, mobile, height, weight, doctorid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    connection.query(
      query,
      [
        name,
        patientid,
        age,
        haemoglobin,
        bloodGroup,
        mobile,
        height,
        weight,
        doctorid,
      ],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(501).json({ error: 'Error saving patient details' });
        }

        const newPatientId = results.insertId;

        // Emit the new-patient event to all connected clients
        io.emit('new-patient', { ...req.body, _id: newPatientId });

        return res.status(201).json({ success: true, newPatientId });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving patient details' });
  }
});
// Endpoint to update patient details
app.put('/patients/:patientid', async (req, res) => {
  try {
    const { patientid } = req.params;
    const { name, mobile, age, bloodGroup, weight, height } = req.body;

    const query = `
      UPDATE addpatient
      SET 
        name = ?,
        mobile = ?,
        age = ?,
        bloodGroup = ?,
        weight = ?,
        height = ?
      WHERE patientid = ?
    `;

    connection.query(
      query,
      [name, mobile, age, bloodGroup, weight, height, patientid],
      (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return res.status(501).json({ error: 'Error updating patient details' });
        }
        return res.status(200).json({ success: true });
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Error updating patient details' });
  }
});


// endpoint to delete patient 
app.delete('/patients/:patientid', async (req, res) => {
  try {
    const { patientid } = req.params;

    // Ensure `patientid` exists in the correct format
    const query = 'DELETE FROM addpatient WHERE patientid = ?';

    connection.query(query, [patientid], (error, results) => {
      if (error) {
        console.error('Error in query:', error);
        return res.status(500).json({ error: 'Error deleting patient' });
      }

      if (results.affectedRows === 0) {
        // Patient not found in the database
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Emit patient-deleted event to all connected clients
      io.emit('patient-deleted', { patientid });

      return res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Error deleting patient' });
  }
});

// endpoint for save data of anemia details
app.post('/save-details', (req, res) => {
  const { date, PatientID, HemoglobinLevel, BloodTransfusion, BleedingDisorder, MCV, MCH, MCHC, RDW, MentzerIndex,
     IronDeficiencyAnemia, targetHB, actualHB, prepregnancyWeight, IronDeficiencyAnemiaValue, otherReports } = req.body;
  // Insert user details into the database
  const query = 'INSERT INTO userdetailstwo (date, PatientID, HemoglobinLevel, BloodTransfusion, BleedingDisorder, MCV, MCH, MCHC, RDW, MentzerIndex, IronDeficiencyAnemia, targetHB, actualHB, prepregnancyWeight, IronDeficiencyAnemiaValue, otherReports) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [date, PatientID, HemoglobinLevel, BloodTransfusion, BleedingDisorder, MCV, MCH, MCHC, RDW, MentzerIndex, IronDeficiencyAnemia, targetHB, actualHB, prepregnancyWeight, IronDeficiencyAnemiaValue, otherReports], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error saving user details');
    } else {
      console.log('User details saved successfully');
      res.status(200).send('User details saved successfully');
    } 
  });
});

// Endpoint to fetch all data from anemiaone and anemiatwo pages
app.get('/fetch-anemia-data/:patientid', async (req, res) => {
  try {
    const patientID = req.params.patientid;

    // Fetch data from userdetailstwo table based on patientID
    const query = 'SELECT * FROM userdetailstwo WHERE patientID = ?';
    connection.query(query, [patientID], (error, results) => {
      if (error) {
        console.error('Error fetching Anemia Page Two data:', error);
        return res.status(500).json({ error: 'Error fetching Anemia Page Two data' });
      }

      // Send the fetched data as a response
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching Anemia data:', error);
    res.status(500).json({ error: 'Error fetching Anemia data' });
  }
});




// Handle POST request for image upload
app.post('/uploadImage', upload.single('fileName'), (req, res) => {
  console.log("req file :",req.file)
  const file =req.file;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageBuffer = file.buffer;
    console.log(imageBuffer);
    
    const encodedImage = file.toString('base64');
    const mimetype = req.file.mimetype;

    // Insert image into database
    connection.query('INSERT INTO images (data, mimetype) VALUES (?, ?)', [encodedImage, mimetype], (err, result) => {
      if (err) throw err;
      console.log('Image uploaded successfully');
      res.status(200).send('Image uploaded successfully');
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});


// Handle GET request for retrieving all images
app.get('/getAllImages', (req, res) => {
  connection.query('SELECT id, mimetype FROM images', (err, results) => {
    if (err) {
      console.error('Error retrieving images:', err);
      return res.status(500).send('Error retrieving images');
    }

    // Send the image IDs and mime types as a response
    res.json(results);
  });
});

// Handle GET request for retrieving a specific image
app.get('/getImage/:id', (req, res) => {
  const imageId = req.params.id;

  connection.query('SELECT data, mimetype FROM images WHERE id = ?', [imageId], (err, results) => {
    if (err) {
      console.error('Error retrieving image:', err);
      return res.status(500).send('Error retrieving image');
    }

    if (results.length === 0) {
      return res.status(404).send('Image not found');
    }

    const image = results[0];
    res.setHeader('Content-Type', image.mimetype);
    res.send(Buffer.from(image.data, 'base64'));
  });
});






// get list api
app.get('/patients', async (req, res) => {
  try {
    const doctorID = req.query.doctorID;

    // Replace with your actual query
    const query = 'SELECT * FROM addpatient WHERE doctorID = ?';

    connection.query(query, [doctorID], (error, results) => {
      if (error) {
        console.error('Error retrieving patients:', error);
        return res.status(500).json({ error: 'Error retrieving patients' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('Error retrieving patients:', error);
    res.status(500).json({ error: 'Error retrieving patients' });
  }
});

// // Define a new endpoint to fetch recently viewed patients
// app.get('/recently-viewed', async (req, res) => {
//   try {
//     const doctorID = req.query.doctorID;

//     // Replace with your actual SQL query to fetch recently viewed patients
//     const query = 'SELECT * FROM recently_viewed_patients WHERE doctorID = ?';

//     // Execute the query using the MySQL connection
//     connection.query(query, [doctorID], (error, results) => {
//       if (error) {
//         console.error('Error fetching recently viewed patients:', error);
//         return res.status(500).json({ error: 'Error fetching recently viewed patients' });
//       }

//       // Return the results as JSON
//       res.json(results);
//     });
//   } catch (error) {
//     console.error('Error fetching recently viewed patients:', error);
//     res.status(500).json({ error: 'Error fetching recently viewed patients' });
//   }
// });




// Define a new endpoint to save symptom and blood pressure data
app.post('/hypertwo', (req, res) => {
  const { date, PatientID, Headache, Blurringofvision, Epigastricpain, Urineoutput, SystolicBP, DiastolicBP,    
    Meditationtaken, HistoryofHypertension, Hemoglobin, Platelets,
    SGOT, SGPT, Albumin, Totalprotein, DirectBilirubin, TotalBilirubin, UREA, UrineAlbumin, Urineketone, UrineSugar, Otherreports
  } = req.body;

  // Insert symptom data into the symptoms table
  const query = 'INSERT INTO hypertensiontwo (date, PatientID, Headache, Blurringofvision, Epigastricpain, Urineoutput,SystolicBP, DiastolicBP,HistoryofHypertension, Meditationtaken,  Hemoglobin, Platelets, SGOT, SGPT, Albumin, Totalprotein, DirectBilirubin, TotalBilirubin, UREA, UrineAlbumin, Urineketone, UrineSugar, Otherreports) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [date,PatientID, Headache, Blurringofvision, Epigastricpain, Urineoutput,SystolicBP, DiastolicBP,HistoryofHypertension, Meditationtaken,  Hemoglobin, Platelets, SGOT, SGPT, Albumin, Totalprotein, DirectBilirubin, TotalBilirubin, UREA, UrineAlbumin, Urineketone, UrineSugar, Otherreports], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error saving user details');
    } else {
      console.log('User details saved successfully');
      res.status(200).send('User details saved successfully');
    }
  });

});



// // endpoint for save data of anemia pageone
// app.post('/generaldata', (req, res) => {
//   const { date, patientID, difficultyinbreathing, feelingtired, chestpain, palpitation, indigestion, swellinginlegs, bleedinghistory, bleedinghistorywhen,
//     bleedinghistorymanage, surgeries, surgeriesdetails, medicalillness, medicalillnessdetails, lastchildbirth } = req.body;
//   // Insert user details into the database
//   const query = 'INSERT INTO generaldata (date, patientID, difficultyinbreathing, feelingtired, chestpain, palpitation, indigestion, swellinginlegs, bleedinghistory, bleedinghistorywhen, bleedinghistorymanage, surgeries, surgeriesdetails, medicalillness, medicalillnessdetails, lastchildbirth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//   connection.query(query, [date, patientID, difficultyinbreathing, feelingtired, chestpain, palpitation, indigestion, swellinginlegs, bleedinghistory, bleedinghistorywhen, bleedinghistorymanage, surgeries, surgeriesdetails, medicalillness, medicalillnessdetails, lastchildbirth], (error, result) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Error saving user details');
//     } else {
//       console.log('User details saved successfully');
//       res.status(200).send('User details saved successfully');
//     } 
//   });
// });

// Define the POST endpoint
app.post('/generaldatas', (req, res) => {
  const {
    date, patientID, difficultyinbreathing, feelingtired, chestpain, palpitation, indigestion,
    swellinginlegs, bleedinghistory, bleedinghistorywhen, bleedinghistorymanage, surgeries,
    surgeriesdetails, medicalillness, medicalillnessdetails, lastchildbirth
  } = req.body;

  // SQL query to insert data into the table
  const query = `
    INSERT INTO generaldatas (
      date, patientID, difficultyinbreathing, feelingtired, chestpain, palpitation, indigestion,
      swellinginlegs, bleedinghistory, bleedinghistorywhen, bleedinghistorymanage, surgeries,
      surgeriesdetails, medicalillness, medicalillnessdetails, lastchildbirth
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    date, patientID, difficultyinbreathing, feelingtired, chestpain, palpitation, indigestion,
    swellinginlegs, bleedinghistory, bleedinghistorywhen, bleedinghistorymanage, surgeries,
    surgeriesdetails, medicalillness, medicalillnessdetails, lastchildbirth
  ];

  // Execute the query
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Error saving user details');
    } else {
      console.log('Data saved successfully');
      res.status(200).send('User details saved successfully');
    }
  });
});
// // Define a new endpoint to save LFT and RFT data
// app.post('/hypertwo', (req, res) => {
//   const {
//     SGOT,
//     SGPT,
//     Albumin,
//     Totalprotein,
//     DirectBilirubin,
//     TotalBilirubin,
//     UREA,
//     UrineAlbumin,
//     Urineketone,
//     UrineSugar
//   } = req.body;

//   const query = 'INSERT INTO hypertensiontwo (SGOT, SGPT, Albumin, Totalprotein, DirectBilirubin, TotalBilirubin, UREA, UrineAlbumin, Urineketone, UrineSugar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

//   connection.query(query, [SGOT, SGPT, Albumin, Totalprotein, DirectBilirubin, TotalBilirubin, UREA, UrineAlbumin, Urineketone, UrineSugar], (error, result) => {
//     if (error) {
//       console.error('Error saving lab reports:', error);
//       res.status(500).send('Error saving lab reports');
//     } else {
//       console.log('Lab reports saved successfully');
//       res.status(200).send('Lab reports saved successfully');
//     }
//   });
// });

// Save generalReport Endpoint
// app.post('/general', (req, res) => {
//   const { report } = req.body;
//   const query = 'INSERT INTO generalreports (report) VALUES (?)';
//   connection.query(query, [report], (error, result) => {
//     if (error) {
//       console.error('Error saving report:', error);
//       res.status(500).send('Error saving report');
//     } else {
//       console.log('Report saved successfully');
//       res.status(200).send('Report saved successfully');
//     }
//   });
// });

// // Endpoint to fetch generalReport
// app.get('/general', (req, res) => {
//   const query = 'SELECT report FROM generalreports ORDER BY id DESC LIMIT 1';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching report:', error);
//       res.status(500).send('Error fetching report');
//     } else {
//       if (results.length > 0) {
//         const reportData = results[0].report;
//         res.json({ report: reportData });
//       } else {
//         res.status(404).send('No report found');
//       }
//     }
//   });
// });

// Save patient data
// app.post('/generaldata', (req, res) => {
//   const data = req.body;
//   const sql = 'INSERT INTO generaldata SET ?';
//   db.query(sql, data, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.status(200).json({ message: 'Patient data saved successfully' });
//     }
//   });
// });

// // Route to handle GET request for /general
// app.get('/general', (req, res) => {
//   res.json({ report: reportData });
// });



// Endpoint to fetch all data from hyperone and hypertwo pages
app.get('/fetch-hyper-data/:patientid', async (req, res) => {
  try {
    // Fetch data from both tables (hyperone and hypertentiontwo)
    const patientID = req.params.patientid;
    const query = 'SELECT * FROM sample.hypertensiontwo WHERE patientID = ? ';

    // Execute queries and combine results
    connection.query(query, [patientID], (error, results) => {
      if (error) {
        console.error('Error fetching hypertention  data:', error);
        return res.status(500).json({ error: 'Error fetching hypertention data' });
      }
      // Send the fetched data as a response
     res.json(results);
      });
      } catch (error) {
      console.error('Error fetching Hypertension data:', error);
      res.status(500).json({ error: 'Error fetching Hypertension data' });
      }
      });

      // Endpoint to fetch all data from general page,
app.get('/fetch-General-data/:patientid', async (req, res) => {
  try {
    const patientID = req.params.patientid;

    // Fetch data from generaldatas table based on patientID
    const query = 'SELECT * FROM generaldatas WHERE patientID = ?';
    connection.query(query, [patientID], (error, results) => {
      if (error) {
        console.error('Error fetching general report data:', error);
        return res.status(500).json({ error: 'Error fetching general report data' });
      }

      // Send the fetched data as a response
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching General data:', error);
    res.status(500).json({ error: 'Error fetching General data' });
  }
});

// Assuming you have already set up your MySQL connection and configured Express

// // Endpoint to fetch patients data
// app.get('/patients', async (req, res) => {
//   try {
//     const doctorID = req.query.doctorID;

//     // Replace with your actual SQL query to fetch patients data based on doctorID
//     const query = 'INSERT INTO addpatient (name, patientid, age, haemoglobin, bloodGroup, mobile, height, weight, doctorid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

//     connection.query(query, [doctorID], (error, results) => {
//       if (error) {
//         console.error('Error fetching patients:', error);
//         return res.status(500).json({ error: 'Error fetching patients' });
//       }

//       res.json(results);
//     });
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//     res.status(500).json({ error: 'Error fetching patients' });
//   }
// });
// fetch patientlistrecord

app.get('/patients', async (req, res) => {
  try {
    const doctorID = req.query.doctorid;

    // Replace with your actual SQL query to fetch patients data based on doctorID
    const query = 'SELECT * FROM patients WHERE doctorID = ?';

    connection.query(query, [doctorID], (error, results) => {
      if (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ error: 'Error fetching patients' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Error fetching patients' });
  }
});


// Endpoint to fetch all reports
app.get('/reports', (req, res) => {
  const query = 'SELECT * FROM reports';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Error fetching reports' });
    } else {
      res.json(results);
    }
  });
});

// Define your endpoint for handling client requests
app.post('/upload', (req, res) => {
  // Handle file upload logic here
  console.log('Received file upload request:', req.body);
  // Process the uploaded file and respond back to the client
  res.send({ message: 'File uploaded successfully' });
});