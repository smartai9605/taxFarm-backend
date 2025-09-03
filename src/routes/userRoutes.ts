import express from 'express';
import {
  getAllUsers,
  getUserByWalletAddress,
  authenticateUser,
  updateUser,
  updateUserBalance,
  deleteUser
} from '../controllers/userController';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// POST /api/users/auth - Authenticate user with wallet address (create if doesn't exist)
router.post('/auth', authenticateUser);

// GET /api/users/:walletAddress - Get user by wallet address
router.get('/:walletAddress', getUserByWalletAddress);

// PUT /api/users/:walletAddress - Update user by wallet address
router.put('/:walletAddress', updateUser);

// PUT /api/users/:walletAddress/balance - Update user balance
router.put('/:walletAddress/balance', updateUserBalance);

// DELETE /api/users/:walletAddress - Delete user by wallet address
router.delete('/:walletAddress', deleteUser);

export default router;
