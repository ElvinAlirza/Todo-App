const mongoose = require("mongoose")
const schema = mongoose.Schema

const task = {
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
}

const taskSchema = new schema(task, { versionKey: false })

const taskModel = mongoose.model("Task", taskSchema)

module.exports = taskModel
