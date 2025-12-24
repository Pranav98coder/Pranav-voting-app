import { ApiError } from "../Utilities/apiError.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";
import { ApiResponse } from "../Utilities/apiResponse.js";
import { ContestantProfile } from "../Models/contestant.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
import Voting from "../Models/voting.js";
import mongoose from "mongoose";

const electionDet = asyncHandler(async (req, res) => {
  const payload = req.body;
  const existingElection = await Voting.findOne({ electionName: payload.name });
  if (existingElection) {
    const update = await Voting.findOneAndUpdate(
      { electionName: payload.name },
      {
        electionName: payload.name,
        startTime: payload.startDate,
        endTime: payload.endDate,
        candidates: payload.candidates,
        voters: payload.voters,
        start: payload.start,
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, { update }, "Election Updated Successfully"));
  }
  const election = await Voting.create({
    electionName: payload.name,
    startTime: payload.startDate,
    endTime: payload.endDate,
    candidates: payload.candidates,
    voters: payload.voters,
    start: payload.start,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, { election }, "Election Started Successfully"));
});

const getActiveNames = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("ContestantProfile");
  const post = user.ContestantProfile?.post || null;

  const elections = await Voting.find({ start: true });
  elections.map(async (e) => {
    const currTime = new Date();
    if (currTime > new Date(e.endTime)) {
      await Voting.updateOne(
        { electionName: e.electionName },
        { $set: { expired: true } }
      );
    }
  });
  const electionNames = elections.map((election) => ({
    name: election.electionName,
    startTime: election.startTime,
    endTime: election.endTime,
    started: !election.expired,
  }));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { electionNames, post },
        "Election Names fetched successfully"
      )
    );
});

//contestant participating elections
const contestingNames = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const elections = await Voting.find({ start: true });
  const contest = elections.filter((e) => {
    return e.candidates.includes(userId);
  });

  contest.map(async (e) => {
    const currTime = new Date();
    if (currTime > new Date(e.endTime)) {
      await Voting.updateOne(
        { electionName: e.electionName },
        { $set: { expired: true } }
      );
    }
  });
  const electionNames = contest.map((election) => ({
    name: election.electionName,
    startTime: election.startTime,
    endTime: election.endTime,
    started: !election.expired,
  }));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { electionNames },
        "Election Names fetched successfully"
      )
    );
});

//voter voting elections

const votingNames = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const elections = await Voting.find({ start: true });
  const canVote = elections.filter((e) => {
    return e.voters.includes(userId);
  });

  canVote.map(async (e) => {
    const currTime = new Date();
    if (currTime > new Date(e.endTime)) {
      await Voting.updateOne(
        { electionName: e.electionName },
        { $set: { expired: true } }
      );
    }
  });

  const electionNames = canVote.map((election) => ({
    name: election.electionName,
    startTime: election.startTime,
    endTime: election.endTime,
    started: !election.expired,
  }));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { electionNames },
        "Election Names fetched successfully"
      )
    );
});

const getNames = asyncHandler(async (req, res) => {
  const elections = await Voting.find({});

  elections.map(async (e) => {
    const currTime = new Date();
    if (currTime > new Date(e.endTime)) {
      await Voting.updateOne(
        { electionName: e.electionName },
        { $set: { expired: true } }
      );
    }
  });

  const electionNames = elections.map((election) => ({
    name: election.electionName,
    startTime: election.startTime,
    endTime: election.endTime,
    started: !election.expired,
  }));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { electionNames },
        "Election Names fetched successfully"
      )
    );
});

const getElection = asyncHandler(async (req, res) => {
  const payload = req.body;
  const details = await Voting.findOne({ electionName: payload.electionName });
  const voters = await User.find({ _id: { $in: details.voters } })
    .populate("voterProfile")
    .populate("ContestantProfile");
  const candidates = await User.find({
    _id: { $in: details.candidates },
  }).populate("ContestantProfile");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { details, voters, candidates },
        "Election Details fetched Successfully"
      )
    );
});

const voteElection = asyncHandler(async (req, res) => {
  const payload = req.body;
  const userId = req.user.id;
  const details = await Voting.findOne({ electionName: payload.electionName });
  const voters = await User.find({ _id: { $in: details.voters } })
    .populate("voterProfile")
    .populate("ContestantProfile");

  if (!details.voters.includes(userId.toString())) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          203,
          null,
          "You are not authorized by admin to vote in this election"
        )
      );
  }
  const voted = details.haveVoted;
  if (details.haveVoted.includes(userId.toString())) {
    const message = "You have already voted";
    return res
      .status(200)
      .json(new ApiResponse(205, { message }, "You have already voted"));
  }

  // 4. Precise Time Check
  // 4. Time Comparison (Handles IST/UTC automatically via timestamps)
  const currTime = new Date();

  // Helper to format Date objects into IST strings for the response messages
  const formatIST = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium", // Shows: 23 Dec 2025
      timeStyle: "short",
      hour12: true,
    });

  if (currTime < new Date(details.startTime)) {
    const startTimeIST = formatIST(details.startTime);
    return res
      .status(200)
      .json(
        new ApiResponse(
          208,
          null,
          `Election will start at ${startTimeIST} (IST)`
        )
      );
  }

  if (currTime > new Date(details.endTime)) {
    const endTimeIST = formatIST(details.endTime);
    await Voting.updateOne(
      { electionName: payload.electionName },
      { $set: { expired: true } }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(209, null, `Election ended at ${endTimeIST} (IST)`)
      );
  }

  const candidates = await User.find({
    _id: { $in: details.candidates },
  }).populate("ContestantProfile");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { details, voters, candidates },
        "Election Details fetched Successfully"
      )
    );
});

const handleVoters = asyncHandler(async (req, res) => {
  // Use req.body, not res.body
  const { votes, electionName } = req.body;
  const userId = req.user._id;

  // 1. Validation: Check if election exists and if user already voted
  const election = await Voting.findOne({ electionName });
  if (!election) throw new ApiError(404, "Election not found");

  if (election.haveVoted.includes(userId)) {
    throw new ApiError(400, "You have already cast your vote");
  }

  // 2. Prepare Atomic Update
  const updateOps = {};

  // votes looks like: { "President": "id123", "Vice President": "id456" }
  // for (const [title, candidateId] of Object.entries(votes)) {
  //   // Convert "Vice President" to "vicePresident" to match your schema keys
  //   let categoryKey = "";
  //   if (title === "President") {
  //     categoryKey = "president";
  //   } else if (title === "Vice President") {
  //     categoryKey = "vicePresident";
  //   } else if (title === "Sports Secretary") {
  //     categoryKey = "sportsSecretary";
  //   } else if (title === "Cultural Secretary") {
  //     categoryKey = "culturalSecretary";
  //   }
  //   // const categoryKey =
  //   //   title.charAt(0).toLowerCase() + title.slice(1).replace(/\s+/g, "");

  //   // Create path: votesRecieved.president.candidateId
  //   updateOps[`votesRecieved.${categoryKey}.${candidateId}`] = 1;
  // }
  for (const [title, candidate] of Object.entries(votes)) {
    // 1. Map titles to schema keys
    const mapping = {
      President: "president",
      "Vice President": "vicePresident",
      "Sports Secretary": "sportsSecretary",
      "Cultural Secretary": "culturalSecretary",
    };

    const categoryKey = mapping[title];

    if (categoryKey) {
      // 2. CRITICAL FIX: Ensure candidateId is a string ID
      // If 'candidate' is an object { _id: '...' }, extract the ID.
      const cleanId =
        typeof candidate === "object" && candidate !== null
          ? candidate._id || candidate.id
          : candidate;

      // 3. Build the path with the string ID
      updateOps[`votesRecieved.${categoryKey}.${cleanId}`] = 1;
    }
  }

  // 3. Update Database (Increment votes AND add user to haveVoted list)
  const updatedElection = await Voting.findOneAndUpdate(
    { electionName },
    {
      $inc: updateOps, // Atomically plus-one for all selected candidates
      $push: { haveVoted: userId }, // Prevent double voting
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Votes recorded successfully"));
});

const getCount = asyncHandler(async (req, res) => {
  const dat = req.body;
  const election = await Voting.findOne({ electionName: dat.electionName });
  const know = election.votesRecieved.president;
  return res
    .status(200)
    .json(new ApiResponse(200, { know }, "Votes recorded successfully"));
});

// const LiveResults = asyncHandler(async (req, res) => {
//   const dat = req.body;
//   const details = await Voting.findOne({ electionName: dat.electionName });
//   const ballot = details.votesRecieved;
//   const president = ballot.president.map(async (e) => {
//     const id = mongoose.Types.ObjectId(e);
//     const user = await User.findOne({ _id: id });
//     const profile = await ContestantProfile.findOne({
//       ContestantProfile: user.ContestantProfile,
//     });
//     return {
//       name: profile.name,
//       post: profile.post,
//       year: profile.year,
//       branch: profile.branch,
//       rollno: profile.rollno,
//     };
//   });
// });

const LiveResults = asyncHandler(async (req, res) => {
  const { electionName } = req.body;

  // 1. Fetch election details
  const details = await Voting.findOne({ electionName });
  const st = details.startTime;
  const end = details.endTime;
  if (!details) {
    return res.status(404).json({ message: "Election not found" });
  }

  const ballot = details.votesRecieved;

  // Helper function to process each category Map
  const processCategory = async (categoryMap) => {
    // categoryMap.keys() gives the Candidate IDs
    const candidateIds = Array.from(categoryMap.keys());

    const results = await Promise.all(
      candidateIds.map(async (idString) => {
        const voteCount = categoryMap.get(idString);

        // Find User and their Profile
        // const id = new mongoose.Types.ObjectId(idString);
        // const user = await User.findById(id);
        // if (!user) return res.status(404).json({ message: "User not found" });

        const profile = await ContestantProfile.findOne({
          _id: idString, // Assuming user.ContestantProfile stores the ID
        });
        if (!profile)
          return res.status(404).json({ message: "Profile not found" });

        if (!profile) return null;

        return {
          name: profile.name,
          post: profile.post,
          year: profile.year,
          branch: profile.branch,
          rollno: profile.rollno,
          votes: voteCount,

          // Include the tally
        };
      })
    );
    // Filter out any null values if a user/profile wasn't found
    return results.filter((item) => item !== null);
  };

  // 2. Process all categories
  const results = {
    president: await processCategory(ballot.president),
    vicePresident: await processCategory(ballot.vicePresident),
    sportsSecretary: await processCategory(ballot.sportsSecretary),
    culturalSecretary: await processCategory(ballot.culturalSecretary),
  };

  // 3. Send Response
  res.status(200).json({
    success: true,
    electionName,
    results,
    startTime: st,
    endTime: end,
  });
});

export {
  electionDet,
  getNames,
  getElection,
  getActiveNames,
  voteElection,
  handleVoters,
  getCount,
  contestingNames,
  votingNames,
  LiveResults,
};
