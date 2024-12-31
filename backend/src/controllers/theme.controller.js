import User from "../models/user.model.js";

export const getTheme = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ theme: user.theme });
  } catch (error) {
    console.log("Error in getTheme controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user._id;

    if (!theme) {
      return res.status(400).json({ message: "Theme is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { theme },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ theme: updatedUser.theme });
  } catch (error) {
    console.log("Error in updateTheme controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
