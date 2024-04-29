import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
import Rules from "../models/adminRule.js";
import Data from "../models/trainerData.js";


// Authentication Endpoints

// Controller function for user signup
const signup = async (req, res) => {
  try {
    // Extract username, email, and password from request body
    const { username, email, password } = req.body;

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username: username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success message and token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function for user login
const login = async (req, res) => {
  try {
    // Extract email and password from request body
    const {username, email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username, email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username, email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token
    res.status(200).json({ token });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Section*********************************************************************************************

const postRulesViaAdmin = async (req, res) => {
  try {
    const { description, rulesName, image } = req.body;
    // Check if the rule already exists
    const existingRule = await Rules.findOne({ description, rulesName, image });
    if (existingRule) {
      return res.status(400).json({ message: 'Description, rulesName, and image already exist' });
    }
    // Extract data from request body

    // Check if required fields are provided
    if (!description || !rulesName || !image) {
      return res.status(400).json({ message: 'Description, rulesName, and image are required' });
    }

    // Create a new instance of Rules model
    const newRule = new Rules({ description, rulesName, image });

    // Save the new rule to the database
    await newRule.save();

    // Return success message
    res.status(201).json({ message: 'Rule posted successfully' });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all data via admin
const getAllDataViaAdmin = async (req, res) => {
  try {
    // Fetch all data from different models
    const allUser = await User.find();
    const allRules = await Rules.find();
    const allData = await Data.find();

    // Combine all data into a single object or array
    const allDataAdmin = {
      user: allUser,
      rules: allRules,
      data: allData
    };

    // Return all data in the response
    res.status(200).json(allDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single data via admin by ID
const getSingleDataViaAdminByID = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Fetch data from different models by ID
    const singleUser = await User.findById(id);
    const singleRule = await Rules.findById(id);
    const singleData = await Data.findById(id);

    // Combine the fetched data into a single object
    const singleDataAdmin = {
      user: singleUser,
      rule: singleRule,
      data: singleData
    };

    // Return the combined data in the response
    res.status(200).json(singleDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const putSingleDataViaAdminByID = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body

    // Update data in different models based on the endpoint
    const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true });
    const updatedRule = await Rules.findByIdAndUpdate(id, newData, { new: true });
    const updatedData = await Data.findByIdAndUpdate(id, newData, { new: true });

    // Combine the updated data into a single object
    const allUpdatedData = {
      user: updatedUser,
      rule: updatedRule,
      data: updatedData
    };

    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete single data via admin by ID
const deleteSingleDataViaAdminByID = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Delete data in different models based on the endpoint
    const deletedUser = await User.findByIdAndDelete(id);
    const deletedRule = await Rules.findByIdAndDelete(id);
    const deletedData = await Data.findByIdAndDelete(id);

    // Return success message in the response
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Trainers Management Endpoints*****************************************************************************
// Create a new training data via trainer
const postTrainingDataViaTrainer = async (req, res) => {
  try {
    // Extract data from request body
    const { dataName, description, image } = req.body;

    // Create a new instance of the Data model with the provided data
    const newData = new Data({ dataName, description, image });

    // Save the new data to the database
    await newData.save();

    // Return success message in the response
    res.status(201).json({ message: 'Training data posted successfully' });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all training data and user data by trainer
const getAllTrainerAndUserDataByTrainer = async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allUser = await User.find({}, 'username -_id'); // Exclude _id field
    const allRules = await Rules.find({}, 'rulesName description image -_id'); // Exclude _id field
    const allData = await Data.find({}, 'dataName description image'); // Exclude _id field

    // Combine all data into a single object
    const allDataAdmin = {
      user: allUser,
      rules: allRules,
      data: allData
    };

    // Return all data in the response
    res.status(200).json(allDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingleTrainerAndUserDataViaTrainerByID = async (req, res) => {
  try {
    // Fetch single data from the Data model based on ID
    const singleData = await Data.findById(req.params.id);

    // Check if data exists
    if (!singleData) {
      return res.status(404).json({ message: 'Training data not found' });
    }

    // Return the single data in the response
    res.status(200).json(singleData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update single posted data of trainer and user by ID via trainer
const putSinglePostedDataOfTrainerAndUserViaTrainerByID = async (req, res) => {
  try {
    // Extract data from request body
    const { id } = req.params;
    const newData = req.body; 

    // Update data part only
    const updatedData = await Data.findByIdAndUpdate(id, newData, { new: true });


    // Combine the updated data into a single object
    const allUpdatedData = {
      data: updatedData,
    };

     // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Management Endpoints*********************************************************************************

// Get user profile by ID
const getUserProfileByUserByID = async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allUser = await User.findOne({}, 'username email'); // Exclude _id field
    // const allRules = await Rules.find({}, 'rulesName description image -_id'); // Exclude _id field
    // const allData = await Data.find({}, 'dataName description image -_id'); // Exclude _id field

    // Combine all data into a single object
    const allDataAdmin = {
      user: allUser,
      // rules: allRules,
      // data: allData
    };

    // Return all data in the response
    res.status(200).json(allDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile by ID
const putUserProfileByUserByID = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const updatedProfile = req.body; // Extract the updated profile from the request body

    // Update user profile in the database
    const userProfile = await User.findByIdAndUpdate(id, updatedProfile, { new: true });

    // Check if user profile exists
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Return updated user profile in the response
    res.status(200).json(userProfile);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllTrainersPostedDataAndRulesByUser = async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    // const allUser = await User.find({}, 'username email -_id'); // Exclude _id field
    const allRules = await Rules.find({}, 'rulesName description image -_id'); // Exclude _id field
    const allData = await Data.find({}, 'dataName description image'); // Exclude _id field

    // Combine all data into a single object
    const allDataAdmin = {
      // user: allUser,
      rules: allRules,
      data: allData
    };

    // Return all data in the response
    res.status(200).json(allDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single trainer's posted data by ID via user
const getSingleTrainersPostedDataViaUserByID = async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allData = await Data.findOne({}, 'dataName description image'); // Exclude _id field

    // Combine all data into a single object
    const allDataAdmin = {
      data: allData,
    };

    // Return all data in the response
    res.status(200).json(allDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  signup,
  login,
  postRulesViaAdmin,
  getAllDataViaAdmin,
  getSingleDataViaAdminByID,
  putSingleDataViaAdminByID,
  deleteSingleDataViaAdminByID,
  postTrainingDataViaTrainer,
  getAllTrainerAndUserDataByTrainer,
  getSingleTrainerAndUserDataViaTrainerByID,
  putSinglePostedDataOfTrainerAndUserViaTrainerByID,
  getUserProfileByUserByID,
  putUserProfileByUserByID,
  getAllTrainersPostedDataAndRulesByUser,
  getSingleTrainersPostedDataViaUserByID
};
