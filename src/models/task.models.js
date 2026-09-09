import mongoose, { Schema } from "mongoose";
import {
  AvailableTaskPriorities,
  AvailableTaskStatues,
  TaskPriorityEnum,
  TaskStatusEnum,
} from "../utils/constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: AvailableTaskStatues,
      default: TaskStatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: AvailableTaskPriorities,
      default: TaskPriorityEnum.MEDIUM,
    },
    attachments: {
      type: [
        {
          url: String,
          mimetype: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
