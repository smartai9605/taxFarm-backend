import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user by wallet address
export const getUserByWalletAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Authenticate user with wallet address (create if doesn't exist)
export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Authenticating user', req.body);
    const { walletAddress, chainId, balance } = req.body;
    
    if (!walletAddress) {
      res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    let isNewUser = false;
    
    if (user) {
      // Update existing user's last login and optional fields
      user.lastLogin = new Date();
      if (chainId !== undefined) user.chainId = chainId;
      if (balance !== undefined) user.balance = balance;
      await user.save();
    } else {
      // Create new user
      isNewUser = true;
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        chainId,
        balance,
        isActive: true,
        lastLogin: new Date()
      });
      await user.save();
    }
    
    // Add isNewUser flag to response
    const userResponse = {
      ...user.toObject(),
      isNewUser
    };
    
    res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser ? 'User created successfully' : 'User authenticated successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error authenticating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update user balance
export const updateUserBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    const { balance } = req.body;
    
    if (!balance) {
      res.status(400).json({
        success: false,
        message: 'Balance is required'
      });
      return;
    }
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    user.balance = balance;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Balance updated successfully',
      user: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating balance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update user by wallet address
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    const updates = req.body;
    
    const user = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete user by wallet address
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    
    const user = await User.findOneAndDelete({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
