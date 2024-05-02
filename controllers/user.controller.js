import User from "../models/user.model.js";
import Rules from "../models/admin.model.js";
import Exercise from "../models/trainer.model.js";
import asyncHandler from "../config/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

// add a new user to the db
const signup = asyncHandler(async (req, res) => {
  try {
    // Extract username, email, and password from request body
    const { username, email, password } = req.body;

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create/save the user via the model
    await User.create({ username, email, password: hashedPassword });
    // send the response
    res.status(201).json({ message: "user created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const login = asyncHandler(async (req, res) => {
  // handle the req.body username and password
  const { username, email, password } = req.body;
  // check if the user document exists
  const user = await User.findOne({ username, email });
  // check/verify that the password provided is correct, by comparing it with the hashed one
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (user && isPasswordValid) {
    // create jwt signature
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET
    );
    // send a response with jwt and message "login successful"
    res.status(200).json({ message: "login successful.", accessToken });
  } else {
    // res.status(401).json({message: "login failed"})
    res.status(401);
    throw new Error("login failed");
  }
});

const getProtected = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  // search for a user with the userId
  const user = await User.findById(userId);
  // send response (200) with the user info
  res.status(200).json({ data: user });
});

// Admin Section************************************************************************************

const getAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Hey admin" });
});

const postAdmin = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    // Check if the rule already exists
    const existingRule = await Rules.findOne({ title, description });
    console.log(existingRule);
    if (existingRule) {
      return res.status(400).json({ message: "The rule already exist" });
    }
    // Extract data from request body

    // Check if required fields are provided
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Create a new instance of Rules model
    const newRule = new Rules({ title, description });

    // Save the new rule to the database
    await newRule.save();

    // Return success message
    res.status(201).json({ message: "Rule posted successfully" });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllData = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models
    const allUser = await User.find();
    const allRules = await Rules.find();
    const allExercise = await Exercise.find();

    // Combine all data into a single object or array
    const allData = {
      user: allUser,
      rules: allRules,
      exercisr: allExercise,
    };

    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getDataById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Fetch data from different models by ID
    const singleUser = await User.findById(id);
    const singleRule = await Rules.findById(id);
    const singleExercise = await Exercise.findById(id);

    // Combine the fetched data into a single object
    const singleDataAdmin = {
      user: singleUser,
      rule: singleRule,
      exercise: singleExercise,
    };

    // Return the combined data in the response
    res.status(200).json(singleDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const putSingDataById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body

    // Update data in different models based on the endpoint
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      new: true,
    });
    const updatedRule = await Rules.findByIdAndUpdate(id, newData, {
      new: true,
    });
    const updatedExercise = await Exercise.findByIdAndUpdate(id, newData, {
      new: true,
    });

    // Combine the updated data into a single object
    const allUpdatedData = {
      user: updatedUser,
      rule: updatedRule,
      exercise: updatedExercise,
    };

    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteSingleDataById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Delete data in different models based on the endpoint
    const deletedUser = await User.findByIdAndDelete(id);
    const deletedRule = await Rules.findByIdAndDelete(id);
    const deletedExercise = await Exercise.findByIdAndDelete(id);

    // Return success message in the response
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Trainer Section**********************************************************************************

const postExercise = asyncHandler(async (req, res) => {
  try {
    // Extract data from request body
    const { exercise, description } = req.body;
    // Check if user with the provided email already exists
    const existingExercise = await Exercise.findOne({ exercise });
    if (existingExercise) {
      return res
        .status(400)
        .json({ message: "Exercise already exists with this description" });
    }
     // Create a new instance of the Data model with the provided data
    const newExercise = new Exercise({ exercise, description });
    // Save the new data to the database
    await newExercise.save();
    // Return success message
    res.status(201).json({ message: "Exercise posted successfully" });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const getAllDataByTrainer = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allUsers = await User.find({});
    
    // Map through all users
    const users = allUsers.map(user => {
      // Check if the user is a trainer
      if (user.role === 'trainer') {
        // For trainer, include specific fields
        return {
          trainerId: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        };
      } else {
        // For other users, include only username and email
        return {
          username: user.username,
          email: user.email
        };
      }
    });

    const allRules = await Rules.find({}, 'title description -_id'); // Exclude _id field
    const allExercise = await Exercise.find({}); // Include _id field

    // Combine all data into a single object
    const allData = {
      user: users,
      rules: allRules,
      exercise: allExercise,
    };

    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const getSingleDataById = asyncHandler(async (req, res) => {
  try {

    const { id } = req.params; // Extract the ID from the request parameters
    // Fetch data from different models by ID
    const singleUser = await User.findById(id);
    // const singleRule = await Rules.findById(id);
    const singleExercise = await Exercise.findById(id);
    // Combine the data into a single object
    const singleData = {
      user: singleUser,
      // rule: singleRule,
      exercise: singleExercise
    };
    // Return the combined data in the response
    res.status(200).json(singleData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const updateSingDataById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body

    // Update data in different models based on the endpoint
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      new: true,
    });
    // if(User !== 'trainer' && id !== `trainerid`){
    //   return res.status(400).json({ message: "You are not authorized to update this data" });
    // }
    // const updatedRule = await Rules.findByIdAndUpdate(id, newData, {
    //   new: true,
    // });
    const updatedExercise = await Exercise.findByIdAndUpdate(id, newData, {
      new: true,
    });

    // Combine the updated data into a single object
    const allUpdatedData = {
      user: updatedUser,
      // rule: updatedRule,
      exercise: updatedExercise,
    };

    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
})

// User Section****************************************************************************************

const getAllDataByUser = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allUsers = await User.find({});
    
    // // Map through all users
    // const users = allUsers.map(user => {
    //   // Check if the user is a trainer
    //   if (user.role === 'user') {
    //     // For trainer, include specific fields
    //     return {
    //       userId: user._id,
    //       username: user.username,
    //       email: user.email,
    //       password: user.password,
    //       role: user.role,
    //       createdAt: user.createdAt,
    //       updatedAt: user.updatedAt,
    //       __v: user.__v
    //     };
    //   } else {
    //     // For other users, include only username and email
    //     return {
    //       username: user.username,
    //       email: user.email
    //     };
    //   }
    // });

    const allRules = await Rules.find({}, 'title description -_id'); // Exclude _id field
    const allExercise = await Exercise.find({}, `exercise description -_id`); // Exclude _id field

    // Combine all data into a single object
    const allData = {
      // user: users,
      rules: allRules,
      exercise: allExercise,
    };

    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({});
    
    // Map through all users
    const users = allUsers.map(user => {
      // Check if the user is a trainer
      if (user.role === 'user') {
        // For trainer, include specific fields
        return {
          userId: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        };
      } 
    });
    
    // Filter out null values from the array
    const filteredUsers = users.filter(user => user !== null);

    // Return the filtered users in the response
    res.status(200).json(filteredUsers);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
const updateUserProfileById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body

    // Update data in different models based on the endpoint
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      new: true,
    });
    // const updatedRule = await Rules.findByIdAndUpdate(id, newData, {
    //   new: true,
    // });
    // const updatedExercise = await Exercise.findByIdAndUpdate(id, newData, {
    //   new: true,
    // });

    // Combine the updated data into a single object
    const allUpdatedData = {
      user: updatedUser,
      // rule: updatedRule,
      // exercise: updatedExercise,
    };

    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export {
  signup,
  login,
  getProtected,
  getAdmin,
  postAdmin,
  getAllData,
  getDataById,
  putSingDataById,
  deleteSingleDataById,
  postExercise,
  getAllDataByTrainer,
  getSingleDataById,
  updateSingDataById,
  getAllDataByUser,
  getUserProfile,
  updateUserProfileById
};
