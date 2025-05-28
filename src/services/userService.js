const { User, sequelize } = require('../models');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

class UserService {
  async registerUser(userData) {
    try {
      const { email, password, firstName, lastName } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user (password will be hashed by the model hook)
      const user = await User.create({
        email,
        password,
        firstName,
        lastName
      });

      logger.info(`New user registered: ${user.email} (${user.id})`);

      // Generate JWT token
      const token = generateToken(user);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login time
      await user.update({ lastLoginAt: new Date() });

      logger.info(`User logged in: ${user.email} (${user.id})`);

      // Generate JWT token
      const token = generateToken(user);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive fields that shouldn't be updated directly
      const { password, ...safeUpdateData } = updateData;

      await user.update(safeUpdateData);
      logger.info(`Updated user: ${user.email} (${user.id})`);
      
      return user.toJSON();
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Validate current password
      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password (will be hashed by the model hook)
      await user.update({ password: newPassword });
      logger.info(`Password changed for user: ${user.email} (${user.id})`);
      
      return { message: 'Password updated successfully' };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  async deactivateUser(userId) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: false });
      logger.info(`Deactivated user: ${user.email} (${user.id})`);
      
      return user.toJSON();
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }
}

module.exports = new UserService(); 