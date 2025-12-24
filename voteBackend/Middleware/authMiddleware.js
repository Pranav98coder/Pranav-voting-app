import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
import { ApiError } from "../Utilities/apiError.js";
import { asyncHandler } from "../Utilities/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      console.log("Redirecting to sign in page");
      //return Response.redirect("/signIn");
      throw new ApiError(401, "Unauthorized request session out");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
