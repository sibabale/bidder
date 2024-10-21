const { 
  doc, 
  where,
  query,
  getDoc,
  addDoc, 
  getDocs, 
  collection,
} = require('firebase/firestore');
const moment = require('moment');
const express = require('express');
const { body, validationResult } = require('express-validator');

const db = require('../../../firebase-config');
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken');

// router.post(
//   '/',
//   verifyToken,
//   [
//     body('image').isURL().withMessage('Image must be a valid URL'),
//     body('title').notEmpty().withMessage('Title is required'),
//     body('userId').isLength({ min: 28, max: 28 }).withMessage('Invalid user ID format'),
//     body('endTime').isISO8601().toDate().withMessage('Invalid end time'),
//     body('subTitle').notEmpty().withMessage('Title is required'),
//     body('startTime').isISO8601().toDate().withMessage('Invalid start time'),
//     body('startPrice').isFloat({ gt: 0 }).withMessage('Start price must be a positive number'),
//     body('description').notEmpty().withMessage('Description is required'),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { 
//       image, 
//       title, 
//       userId, 
//       endTime,
//       subTitle, 
//       startTime, 
//       startPrice, 
//       description, 
//     } = req.body;

//     try {
//       // Validate that endTime is after startTime
//       if (endTime <= startTime) {
//         return res.status(400).json({ message: 'End time must be after start time' });
//       }

//         // Check if the user exists by querying the document by ID
//         const userDocRef = doc(collection(db, 'users'), userId);
//         const userDoc = await getDoc(userDocRef);
  
//         if (!userDoc.exists()) {
//           return res.status(404).json({ message: 'User does not exist' });
//         }

//       // Check if the user already has a product with the same title
//       const productsQuery = query(
//         collection(db, 'products'),
//         where('title', '==', title),
//         where('userId', '==', userId)
//       );
//       const querySnapshot = await getDocs(productsQuery);

//       if (!querySnapshot.empty) {
//         return res.status(400).json({ message: 'You already have a product with this title' });
//       }

//       // Determine product status based on the current time
//       const now = new Date();
//       let status;
//       if (now < startTime) {
//         status = 'coming_soon';
//       } else if (now >= startTime && now <= endTime) {
//         status = 'live';
//       } else {
//         status = 'closed';
//       }

//       // Save product to Firestore
//       const newProduct = {
//         title,
//         image,
//         userId,
//         status,
//         endTime,
//         subTitle,
//         startTime,
//         timestamp: new Date(),
//         startPrice: parseFloat(startPrice),
//         description,
//       };

//       const productRef = await addDoc(collection(db, 'products'), newProduct);

//       res.status(201).json({ 
//         message: 'Product uploaded successfully', 
//         productId: productRef.id 
//       });
//     } catch (error) {
//       console.error('Error uploading product:', error);
//       res.status(500).json({ message: 'Failed to upload product' });
//     }
//   }
// );

router.post(
  '/',
  verifyToken,
  [
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('title').notEmpty().withMessage('Title is required'),
    body('userId').isLength({ min: 28, max: 28 }).withMessage('Invalid user ID format'),
    body('endDate').isISO8601().withMessage('Invalid end date'), // ISO8601 validation
    body('subTitle').notEmpty().withMessage('Subtitle is required'),
    body('startDate').isISO8601().withMessage('Invalid start date'), // ISO8601 validation
    body('startPrice').isFloat({ gt: 0 }).withMessage('Start price must be a positive number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('endTime').custom((value, { req }) => {
      if (!value || typeof value.hour !== 'number' || typeof value.minute !== 'number') {
        throw new Error('Invalid end time format');
      }
      return true; // Indicates the value is valid
    }),
    body('startTime').custom((value, { req }) => {
      if (!value || typeof value.hour !== 'number' || typeof value.minute !== 'number') {
        throw new Error('Invalid start time format');
      }
      return true; // Indicates the value is valid
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      image, 
      title, 
      userId, 
      endDate,
      endTime,
      subTitle, 
      startTime, 
      startPrice, 
      description,
      startDate,
    } = req.body;

    try {
      // Convert endTime and startTime to Date objects
      const startDateTime = moment(`${startDate}`).set({
        hour: startTime.hour,
        minute: startTime.minute,
        second: startTime.second,
        millisecond: startTime.millisecond,
      });

      const endDateTime = moment(`${endDate}`).set({
        hour: endTime.hour,
        minute: endTime.minute,
        second: endTime.second,
        millisecond: endTime.millisecond,
      });

      console.log(endDateTime.toISOString(), startDateTime.toISOString());
      

    // Validate that endTime is after startTime
    if (endDateTime.isBefore(startDateTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }


      // Check if the user exists by querying the document by ID
      const userDocRef = doc(collection(db, 'users'), userId);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      // Check if the user already has a product with the same title
      const productsQuery = query(
        collection(db, 'products'),
        where('title', '==', title),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(productsQuery);

      if (!querySnapshot.empty) {
        return res.status(400).json({ message: 'You already have a product with this title' });
      }

      // Determine product status based on the current time
      const now = new Date();
      let status;
      if (now < startDateTime) {
        status = 'coming_soon';
      } else if (now >= startDateTime && now <= endDateTime) {
        status = 'live';
      } else {
        status = 'closed';
      }

      // Save product to Firestore
      const newProduct = {
        title,
        image,
        userId,
        status,
        endTime: endDateTime.toISOString(),
        subTitle,
        startTime: startDateTime.toISOString(),
        timestamp: new Date(),
        startPrice: parseFloat(startPrice),
        description,
      };

      const productRef = await addDoc(collection(db, 'products'), newProduct);

      res.status(201).json({ 
        message: 'Product uploaded successfully', 
        productId: productRef.id 
      });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ message: 'Failed to upload product' });
    }
  }
);


module.exports = router;