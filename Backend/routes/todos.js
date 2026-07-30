import express from 'express';
import prisma from '../lib/prisma.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(authenticateToken);

// GET /api/todos - Retrieve all todos for the logged-in user
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Server error while fetching todos' },
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title is required',
          details: ['title is required'],
        },
      });
    }

    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Deadline cannot be in the past',
          details: ['deadline must be a future date'],
        },
      });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        deadline: deadline ? new Date(deadline) : null,
        userId: req.user.userId,
      },
    });

    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Server error while creating todo' },
    });
  }
});

// PUT/PATCH /api/todos/:id - Update an existing todo (full or partial update)
const updateTodoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isCompleted, deadline } = req.body;

    const existing = await prisma.todo.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Todo not found' },
      });
    }

    if (existing.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have access to this todo' },
      });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(isCompleted !== undefined && { isCompleted }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Server error while updating todo' },
    });
  }
};

router.put('/:id', updateTodoHandler);
router.patch('/:id', updateTodoHandler);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.todo.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Todo not found' },
      });
    }

    if (existing.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have access to this todo' },
      });
    }

    await prisma.todo.delete({ where: { id } });

    res.json({ success: true, data: { message: 'Todo deleted successfully' } });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Server error while deleting todo' },
    });
  }
});

export default router;
