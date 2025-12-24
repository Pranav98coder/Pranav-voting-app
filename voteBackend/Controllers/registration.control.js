import { ApiError } from "../Utilities/apiError.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiResponse } from "../Utilities/apiResponse.js";
import { ContestantProfile } from "../Models/contestant.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
import Voting from "../Models/voting.js";
import { Register } from "../Models/register.js";
import { VoterProfile } from "../Models/voter.js";

const reg = asyncHandler(async (req, res) => {
  const { name, role, message } = req.body;
  const userId = req.user._id;
  // 2. Validate required fields
  if (!name || !role) {
    throw new ApiError(400, "Election name and Role are required");
  }

  // 3. CHECK FOR DUPLICATE: Has this user already registered for this specific election?
  const existingRegistration = await Register.findOne({
    user: userId,
    electionName: name,
  });

  if (existingRegistration) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "You have already registered for this election."
        )
      );
  }
  const upd = await Register.create({
    user: userId,
    electionName: name,
    post: role,
    message: message,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { upd }, "Register message given succesfully"));
});

// const show = asyncHandler(async (req, res) => {
//   const notify = await Register.find({});

//   const det = notify.map(async (cont) => {
//     const userDet = await User.find({ _id: cont.user });
//     if (userDet.voterProfile != null) {
//       const votDet = await VoterProfile.find({ _id: userDet.voterProfile });
//       const basic = {
//         name: votDet.name,
//         rollno: votDet.rollno,
//         branch: votDet.branch,
//       };
//     } else if (userDet.ContestantProfile != null) {
//       const constDet = await ContestantProfile.find({
//         _id: userDet.ContestantProfile,
//       });
//       const basic = {
//         userName: constDet.name,
//         rollno: constDet.rollno,
//         branch: constDet.branch,
//       };
//     }
//     const payload = {
//       electionName: cont.electionName,
//       post: cont.post,
//       message: cont.message,
//     };
//   });
// });

const show = asyncHandler(async (req, res) => {
  // 1. Get all registrations and populate the 'user' basic info immediately
  const notify = await Register.find({}).populate("user");

  // 2. Process each registration using Promise.all
  const formattedData = await Promise.all(
    notify.map(async (cont) => {
      const userDet = cont.user; // This is already the user object because of .populate()

      let basic = { name: "Unknown", rollno: "N/A", branch: "N/A" };

      // 3. Logic to fetch details from the specific Profile collection
      if (userDet.voterProfile) {
        const votDet = await VoterProfile.findById(userDet.voterProfile);
        if (votDet) {
          basic = {
            name: votDet.name,
            rollno: votDet.rollno, // Ensure this matches DB casing (rollNo vs rollno)
            branch: votDet.branch,
          };
        }
      } else if (userDet.ContestantProfile) {
        const constDet = await ContestantProfile.findById(
          userDet.ContestantProfile
        );
        if (constDet) {
          basic = {
            name: constDet.name,
            rollno: constDet.rollno,
            branch: constDet.branch,
          };
        }
      }

      // 4. Return the combined object structure required by your Frontend
      return {
        _id: cont._id, // Needed for keys in React
        userName: basic.name,
        rollNo: basic.rollno,
        branch: basic.branch,
        electionName: cont.electionName,
        post: cont.post,
        message: cont.message,
      };
    })
  );

  // 5. Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, formattedData, "Notifications fetched successfully")
    );
});

const deleteNotification = asyncHandler(async (req, res) => {
  // 1. Get the ID from the URL (e.g., /api/v1/admin/register/65a...)
  const { id } = req.body;

  // 2. Find and Delete the document
  const deletedRegister = await Register.deleteOne({ _id: id });

  // 3. Check if it existed
  //   if (!deletedRegister) {
  //     throw new ApiError(
  //       404,
  //       "Registration request not found or already deleted"
  //     );
  //   }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification marked as read (deleted)"));
});

export { reg, show, deleteNotification };
