import { ApiError } from "../Utilities/apiError.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiResponse } from "../Utilities/apiResponse.js";
import { VoterProfile } from "../Models/voter.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
import { ContestantProfile } from "../Models/contestant.js";

const registerVoter = asyncHandler(async (req, res) => {
  console.log("Backend received request body:", req.body);
  const { name, age, year, branch, section, rollno } = req.body;
  const user_id = req.user._id;
  const user = await User.findById(user_id);
  if (!user.voterProfile) {
    const det = await VoterProfile.create({
      name: name,
      age: age,
      year: year,
      branch: branch,
      section: section,
      rollno: rollno,
    });

    user.voterProfile = det._id;
    await user.save();
    console.log("Created VoterProfile:", det);
    return res
      .status(201)
      .json(new ApiResponse(201, det, "Voter Profile Registered Successfully"));
  }

  const updatedUser = await VoterProfile.findByIdAndUpdate(
    user.voterProfile,
    {
      $set: {
        name: name,
        age: age,
        year: year,
        branch: branch,
        section: section,
        rollno: rollno,
      },
    },
    { new: true, runValidators: true }
  );
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { updatedUser },
        "Voter Profile Registered Successfully"
      )
    );
});

const getData = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const user = await User.find({ role: { $ne: "admin" } })
    .populate("voterProfile")
    .populate("ContestantProfile")
    .select("-password -refreshToken ");
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Voter Data fetched successfully"));
});

const handleVotes = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { candidates } = req.body;
  // Assuming votes is an object with post names as keys and contestant IDs as values
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new ApiError(400, "Invalid or empty votes data provided");
  }
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const voterInfo = await VoterProfile.findById(user.voterProfile);
  if (!voterInfo) {
    throw new ApiError(404, "Voter profile not found");
  }
  if (voterInfo.hasVoted) {
    throw new ApiError(
      400,
      `${voterInfo.name.toUpperCase()},You have already voted`
    );
  }

  const voteUpdates = candidates.map(async (candidateId) => {
    const contestant = await ContestantProfile.findById(candidateId);
    if (!contestant) {
      throw new ApiError(404, `Contestant with ID ${candidateId} not found`);
    }
    contestant.votesCount += 1;
    await contestant.save();
  });
  await Promise.all(voteUpdates);
  voterInfo.hasVoted = true;
  await voterInfo.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Votes recorded successfully"));
});

const userVoterProfile = asyncHandler(async (req, res) => {
  const user_id = req.user._id;

  const user = await User.findById(user_id)
    .populate("voterProfile")
    .populate("ContestantProfile");
  if (user.voterProfile || user.ContestantProfile) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { voterProfile: user.voterProfile || user.ContestantProfile },
          "Voter Profile fetched successfully"
        )
      );
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Please fill your Voter Profile "));
  }
});

export { registerVoter, getData, handleVotes, userVoterProfile };
