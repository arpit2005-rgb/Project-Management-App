import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
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

export { verifyJwt };

//The if (!token), catch (error) and if (!user) check and the thrown error are synchronous operations. However, since they are inside an async function, the thrown error is automatically converted into a rejected promise and handled by asyncHandler.

//       Case	        Behavior	   Need try-catch?
//    if (!token)	  Just a check	  ❌ No
//    if (!user)	  Returns null	  ❌ No
//    jwt.verify()	Throws error	 ✅ Yes

//asyncHandler does intercept errors from jwt.verify() because they are converted into rejected promises. However, we still use try...catch to handle these errors explicitly, customize the response, and prevent exposing sensitive internal error details before they reach the global error handler.
