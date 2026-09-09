import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createNoteValidator } from "../validators/index.js";
import {
  verifyJwt,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJwt);

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRoles), getNotes)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission(AvailableUserRoles), getNoteById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    updateNote,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;
