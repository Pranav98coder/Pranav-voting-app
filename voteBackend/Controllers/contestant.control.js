import { ApiError } from "../Utilities/apiError.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiResponse } from "../Utilities/apiResponse.js";
import { ContestantProfile } from "../Models/contestant.js";
import { VoterProfile } from "../Models/voter.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
import Voting from "../Models/voting.js";

const registerContestant = asyncHandler(async (req, res) => {
  console.log("Backend received request body:", req.body);
  const { name, age, post, year, branch, section, rollno } = req.body;
  // const token =
  //   req.cookies?.accessToken ||
  //   req.header("Authorization")?.replace("Bearer ", "");
  // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // const userCur = await User.findById(decodedToken?._id);
  const user_id = req.user._id;
  // 1. Find the current user
  const user = await User.findById(user_id);

  // 2. DELETE existing profile if it's NOT null
  if (user.ContestantProfile) {
    await ContestantProfile.findByIdAndDelete(user.ContestantProfile);
  }

  if (
    [name, post, year, branch, section, rollno].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // const alreadyContestant = await User.exists({
  //   _id: user_id,
  //   ContestantProfile: { $ne: null },
  // });

  // if (alreadyContestant) {

  //   throw new ApiError(400, "Contestant profile already exists for this user ,go to update profile");
  // }
  const det = await ContestantProfile.create({
    name: name,
    age: age,
    post: post,
    year: year,
    branch: branch,
    section: section,
    rollno: rollno,
  });
  console.log("Created ContestantProfile:", det);
  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        ContestantProfile: det._id,
        role: "contestant",
      },
    },
    {
      new: true, // Returns the document AFTER the update
      runValidators: true, // Ensures the update follows schema rules
    }
  ).populate("ContestantProfile"); // Replaces the ID with the full profile data

  if (!updatedUser) {
    throw new ApiError(404, "User not found.");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { updatedUser },
        "Contestant profile updated successfully"
      )
    );
});

const registerOrUpdateContestant = asyncHandler(async (req, res) => {
  const { name, age, post, year, branch, section, rollno } = req.body;
  const userId = req.user._id;
  if (
    [name, branch, section, rollno].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (post === "NULL") {
    throw new ApiError(400, "Please select a post");
  }

  // Check for valid numbers (Age & Year)
  // Adjust the age limit (e.g., 17 or 18) as per your college rules
  if (!age) {
    throw new ApiError(400, "Please provide a valid age");
  }

  if (!year) {
    throw new ApiError(400, "Please provide a valid year");
  }

  // 1. Find the current user
  const user = await User.findById(userId);

  // 2. DELETE existing profile if it's NOT null
  if (!user.ContestantProfile) {
    const newProfile = await ContestantProfile.create({
      name: name,
      age: age,
      post: post,
      year: year,
      branch: branch,
      section: section,
      rollno: rollno,
    });
    user.ContestantProfile = newProfile._id;
    await user.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newProfile, "Profile created successfully"));
  }

  // 3. CREATE the new profile document

  // 4. LINK the new ID to the user
  const updatedUser = await ContestantProfile.findByIdAndUpdate(
    user.ContestantProfile,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "Profile updated successfully"));
});

const getAllContestants = asyncHandler(async (req, res) => {
  const contestants = await User.find({ role: "contestant" })
    .populate("ContestantProfile")
    .select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { contestants },
        "Contestant Data fetched successfully"
      )
    );
});
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (user.ContestantProfile || user.voterProfile) {
    const profile =
      (await ContestantProfile.findById(user.ContestantProfile)) ||
      (await VoterProfile.findById(user.voterProfile));
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { profile },
          "Contestant Profile fetched successfully"
        )
      );
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Please fill your contestant profile"));
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { post } = req.body; // 1. Fix: Destructure only the field you need

  const user = await User.findById(userId)
    .populate("ContestantProfile")
    .populate("voterProfile");

  // 2. Fix: Check if Voter Profile exists first
  // We need this because we are copying data (name, age, etc.) from it.
  if (!user.voterProfile) {
    throw new ApiError(
      400,
      "You must create a Voter Profile before contesting."
    );
  }

  // 3. Fix: Define 'o' (original data) in the main scope so both blocks can see it
  const o = user.voterProfile;

  // --- CASE A: CREATE NEW PROFILE ---
  if (!user.ContestantProfile) {
    const newProfile = await ContestantProfile.create({
      name: o.name,
      age: o.age,
      post: post,
      year: o.year,
      branch: o.branch,
      section: o.section,
      rollno: o.rollno,
    });

    // 4. Fix: Link the new profile to the User document
    user.ContestantProfile = newProfile._id;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, newProfile, "Created new Contestant Profile"));
  }

  // --- CASE B: UPDATE EXISTING PROFILE ---
  else {
    // 5. Fix: Use findByIdAndUpdate with the PROFILE ID, not the User ID
    const updatedProfile = await ContestantProfile.findByIdAndUpdate(
      user.ContestantProfile._id, // Use the ID from the populated object
      {
        $set: {
          post: post, // Update the post
          // Optional: Sync other details in case Voter Profile changed
          name: o.name,
          age: o.age,
          year: o.year,
          branch: o.branch,
          section: o.section,
          rollno: o.rollno,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProfile, "Updated your Post successfully")
      );
  }
});

export {
  registerContestant,
  registerOrUpdateContestant,
  getAllContestants,
  getProfile,
  updatePost,
};
