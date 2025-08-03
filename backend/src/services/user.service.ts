import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/app-error";
import { UpdateUserType } from "../validators/user.validator";

export const findByIdUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserService = async (
  userId: string,
  updateData: any,
  profilePic?: any
): Promise<any> => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Handle profile picture upload
    if (profilePic) {
      const { uploadToCloudinary } = await import("../config/cloudinary.config");
      const imageUrl = await uploadToCloudinary(profilePic);
      updateData.profilePic = imageUrl;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update user error:", error);
    throw new NotFoundException(
      "Failed to update user"
    );
  }
};
