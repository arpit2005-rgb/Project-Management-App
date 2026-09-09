import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access");
  }
});

//The if (!token), catch (error) and if (!user) check and the thrown error are synchronous operations. However, since they are inside an async function, the thrown error is automatically converted into a rejected promise and handled by asyncHandler.

//       Case	        Behavior	   Need try-catch?
//    if (!token)	  Just a check	  ❌ No
//    if (!user)	  Returns null	  ❌ No
//    jwt.verify()	Throws error	 ✅ Yes

//asyncHandler does intercept errors from jwt.verify() because they are converted into rejected promises. However, we still use try...catch to handle these errors explicitly, customize the response, and prevent exposing sensitive internal error details before they reach the global error handler.

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project id is missing");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!projectMember) {
      throw new ApiError(403, "You are not a member of this project");
    }

    const givenRole = projectMember.role;
    req.projectRole = givenRole;

    if (roles.length && !roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You don't have permission to perform this action",
      );
    }

    next();
  });
};
