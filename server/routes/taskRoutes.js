const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// GET tasks
router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    let where = {};

    if (role === 'admin') {
      // Admin sees all? Or maybe just their own? 
      // Spec: "Team leader can assign task or view the task of their subordinate"
      // Let's assume Admin sees all for debugging/management.
    } else if (role === 'team_leader') {
       // See own tasks AND tasks of subordinates
       const subordinates = await User.findAll({ where: { teamLeaderId: id }, attributes: ['id'] });
       const subIds = subordinates.map(s => s.id);
       where = {
         userId: { [Op.in]: [id, ...subIds] }
       };
    } else {
      // Subordinate: Sees only their own tasks
      where = { userId: id };
    }

    const tasks = await Task.findAll({ where, include: [{ model: User, as: 'Owner', attributes: ['username'] }] });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST task (Create/Assign)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, assignedToId } = req.body;
    const { role, id } = req.user;

    // RBAC for assignment
    if (role === 'subordinate') {
       // Spec: "subordinate cannot do it to the team leader"
       // Can they assign to themselves? Let's say yes for personal to-do.
       if (assignedToId && parseInt(assignedToId) !== id) {
           return res.status(403).json({ message: 'Subordinates cannot assign tasks to others' });
       }
    }
    
    // Team Leader Check: Can only assign to subordinates?
    if (role === 'team_leader' && assignedToId && parseInt(assignedToId) !== id) {
        const targetUser = await User.findByPk(assignedToId);
        if (targetUser.teamLeaderId !== id) {
             return res.status(403).json({ message: 'Can only assign tasks to your subordinates' });
        }
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      userId: assignedToId || id,
      creatorId: id,
      status: 'pending'
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT task (Update status/details)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status, title, description } = req.body;
        const task = await Task.findByPk(req.params.id);
        
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Permission: Owner can update status. Creator can update details.
        // Simplified: Owner or Creator or Admin can update.
        
        if (task.userId !== req.user.id && task.creatorId !== req.user.id && req.user.role !== 'admin') {
            // Check if team leader of owner
            const owner = await User.findByPk(task.userId);
            if (owner.teamLeaderId !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        if (status) task.status = status;
        if (title) task.title = title;
        if (description) task.description = description;
        
        await task.save();
        res.json(task);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
