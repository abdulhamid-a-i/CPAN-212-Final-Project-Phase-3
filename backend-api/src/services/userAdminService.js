import { userRepository } from "../repositories/userRepository.js";
import { roleRepository } from "../repositories/roleRepository.js";
import { AppError } from "../utils/appError.js";
import { stripSensitiveUserFields } from "../utils/safeObject.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import bcrypt from "bcryptjs";

export const userAdminService = {
  async listUsers() {
    const users = await userRepository.findAll();
    return users.map(stripSensitiveUserFields);
  },

  async listCustomers() {
     const users = await userRepository.findCustomers();
    return users.map(stripSensitiveUserFields);
  },

  async getUser(userId){
    const user = await userRepository.findById(userId);
    console.log(user)
    return stripSensitiveUserFields(user);
  },

  async updateUser(userId, payload) {
    const {username, fullName, email, roles, status, phone, city, country, userType} = payload;

    const adminRole = await Role.findOne({name: "ADMIN"});
    const adminCountExcludingUser = await User.countDocuments({
        roles: adminRole._id,
        _id: { $ne: userId } 
      });


    const [firstName, lastName] = fullName.split(" ");

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const usernameExists = await User.findOne({ username: username.trim() });
    if (usernameExists && userId != user._id ) {
      throw new AppError("Username already taken", 409);
    }

    
    const validRoles = await roleRepository.findByNames(roles);

    if (validRoles.length !== roles.length) {
      throw new AppError("One or more roles are invalid", 400);
    }

    
    const isCurrentAdmin = user.roles.some(role => role.name === "ADMIN");
    const removingAdmin = !validRoles.some(role => role.name === "ADMIN");

    if (isCurrentAdmin && adminCountExcludingUser === 0 && removingAdmin){
          throw new AppError("Last Admin cannot remove admin role", 403)
      }

    const userRoles = validRoles.map(role => role._id);

    const updates = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: user.passwordHash,
      roles: userRoles,
      accountStatus: status,
      profile: {
        firstName: firstName,
        lastName: lastName,
        email: email.trim().toLowerCase(),
        userType: userType.trim(),
        phone: phone.trim(),
        city: city.trim(),
        country: country.trim()

      }
    }

    const updatedUser = await userRepository.updateById(userId, updates);

    const refreshedUser = await userRepository.findById(userId);
    
    return stripSensitiveUserFields(refreshedUser);
  }
  ,

  async updateUserStatus(userId, accountStatus) {
    const user = await userRepository.findById(userId);

    const adminRole = await Role.findOne({name: "ADMIN"});
    const adminCountExcludingUser = await User.countDocuments({
        roles: adminRole._id,
        _id: { $ne: userId } 
      });
    
    const isCurrentAdmin = user.roles.some(role => role.name === "ADMIN");

    if (isCurrentAdmin && adminCountExcludingUser === 0 && (accountStatus === "INACTIVE" || "SUSPENDED") ){
          throw new AppError("Cannot deactivate or suspend last admin", 403)
        }


    const updatedUser = await userRepository.updateById(userId, { accountStatus });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return stripSensitiveUserFields(updatedUser);
  },

  async createUser(payload) {
    const {username, fullName, password, email, roles, status, phone, city, country, userType} = payload;

    const [firstName, lastName] = fullName.split(" ");

    if(!lastName){
      throw new AppError("Last name is required", 400)
    }

    const usernameExists = await User.findOne({ username: username.trim() });
    if (usernameExists) {
      throw new AppError("Username already taken", 409);
    }

    const validRoles = await roleRepository.findByNames(roles);

    if (validRoles.length !== roles.length) {
      throw new AppError("One or more roles are invalid", 400);
    }

    const userRole = validRoles.map(role => role._id);


    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      username: username.trim(),
      passwordHash: passwordHash,
      roles: userRole,
      accountStatus: status,
      profile: {
        firstName: firstName,
        lastName: lastName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        country: country.trim(),
        userType: userType.trim()
      }
      
    });

    return {user: stripSensitiveUserFields(user)};
  },

  async deleteUser(userId){
    const user = await userRepository.findById(userId);


    const adminRole = await Role.findOne({name: "ADMIN"});
    const adminCountExcludingUser = await User.countDocuments({
        roles: adminRole._id,
        _id: { $ne: userId } 
      });

    
    const isCurrentAdmin = user.roles.some(role => role.name === "ADMIN");

    if (isCurrentAdmin && adminCountExcludingUser === 0 && (accountStatus === "INACTIVE" || "SUSPENDED") ){
          throw new AppError("Cannot deactivate or suspend last admin", 403)
        }
    
    return await User.findByIdAndDelete(user._id);
    

  }
};