import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import mongoose from "mongoose";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  //  .populate Look at assignedTo field (which stores user ID)
  // Fetch that user from DB
  // Replace ID with actual user data
  // Only include:
  // avatar
  // username
  // fullname
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task fetched successfully"));
});
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status, priority } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    priority,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);
  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const { title, description, assignedTo, status, priority } = req.body;

  const task = await Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(taskId),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(assignedTo !== undefined && {
        assignedTo: new mongoose.Types.ObjectId(assignedTo),
      }),
      ...(status && { status }),
      ...(priority && { priority }),
    },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;

  const task = await Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const { title, isCompleted } = req.body;

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    isCompleted: isCompleted ?? false,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId, projectId } = req.params;
  const { title, isCompleted } = req.body;

  const subtask = await Subtask.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(subTaskId),
      task: {
        $in: await Task.find({
          project: new mongoose.Types.ObjectId(projectId),
        }).distinct("_id"),
      },
    },
    {
      ...(title && { title }),
      ...(isCompleted !== undefined && { isCompleted }),
    },
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId, projectId } = req.params;

  const subtask = await Subtask.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(subTaskId),
    task: {
      $in: await Task.find({
        project: new mongoose.Types.ObjectId(projectId),
      }).distinct("_id"),
    },
  });

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

export {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
