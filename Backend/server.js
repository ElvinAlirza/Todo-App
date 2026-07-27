const express = require('express')
const mongoose = require('mongoose')

// using express
const app = express()
app.use(express.json())

// connecting to database
mongoose.connect('mongodb://127.0.0.1:27017/TodoApp-mern')
  .then(() => console.log("Connected to MongoDB"))
  .catch(e => console.log('Connection Error', e))

// imported the model
const Task = require('./Models/task')

// api for getting all of the tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (e) {
    console.log("Failed to fetch tasks:", e.message)
    res.status(500).json({ error: e.message })
  }
})

// api for creating a task
app.post('/task/new', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description
    })

    await task.save()
    res.status(201).json(task)

  } catch (e) {
    console.log("Failed to create task:", e.message)
    res.status(400).json({ error: e.message })
  }
})

// delete for deleting task
app.delete('/task/delete/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id)

    if (!result) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(result)
  } catch (e) {
    console.log("Failed to delete task:", e.message)
    res.status(400).json({ error: e.message })
  }
})

// api for changing the isCompleted status
app.patch('/task/complete/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    task.isCompleted = !task.isCompleted
    await task.save()
    res.json(task)

  } catch (e) {
    console.log("Failed to update task:", e.message)
    res.status(400).json({ error: e.message })
  }
})

// make express listen for requests
app.listen(3001, () => console.log("listening on port 3001"))
