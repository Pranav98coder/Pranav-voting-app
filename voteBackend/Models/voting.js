import mongoose from "mongoose";
const votingSchema = new mongoose.Schema({
  electionName: {
    type: String,

    trim: true,
  },
  start: {
    type: Boolean,
    default: false,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  candidates: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ContestantProfile",
  },
  voters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "VoterProfile",
  },
  haveVoted: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  votesRecieved: {
    president: { type: Map, of: Number, default: {} },
    vicePresident: { type: Map, of: Number, default: {} },
    sportsSecretary: { type: Map, of: Number, default: {} },
    culturalSecretary: { type: Map, of: Number, default: {} },
  },
});
const Voting = mongoose.model("Voting", votingSchema);

export default Voting;
