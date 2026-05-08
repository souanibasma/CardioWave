import { Request, Response } from "express";
import User from "../models/User";
import ApprovedLicense from "../models/ApprovedLicense";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import { createAdminNotification } from "../utils/createNotification";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      fullName,
      email,
      password,
      role,

      // patient
      phone,
      dateOfBirth,
      gender,

      // doctor
      specialty,
      licenseNumber,
      hospitalOrClinic,
    } = req.body;

    if (role === "admin") {
      res.status(403).json({
        message: "Admin cannot register via this route",
      });
      return;
    }

    if (!fullName || !email || !password || !role) {
      res.status(400).json({
        message: "Missing required fields",
      });
      return;
    }

    if (role !== "doctor" && role !== "patient") {
      res.status(400).json({
        message: "Invalid role",
      });
      return;
    }

    if (role === "doctor") {
      if (!specialty || !licenseNumber || !hospitalOrClinic) {
        res.status(400).json({
          message:
            "Doctor must provide specialty, licenseNumber and hospitalOrClinic",
        });
        return;
      }
    }

    if (role === "patient") {
      if (!phone || !dateOfBirth) {
        res.status(400).json({
          message: "Patient must provide phone and dateOfBirth",
        });
        return;
      }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    // ── Auto-approval logic for doctors ──
    let isApproved = role === "patient"; // patients always approved
    if (role === "doctor") {
      const approved = await ApprovedLicense.findOne({
        licenseNumber: licenseNumber.trim().toUpperCase(),
      });
      isApproved = !!approved;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      isApproved,

      phone: role === "patient" ? phone : undefined,
      dateOfBirth: role === "patient" ? dateOfBirth : undefined,
      gender: role === "patient" ? gender || undefined : undefined,

      specialty: role === "doctor" ? specialty : undefined,
      licenseNumber: role === "doctor" ? licenseNumber : undefined,
      hospitalOrClinic: role === "doctor" ? hospitalOrClinic : undefined,
    });

    // Notifications admin
    if (role === "doctor") {
      if (isApproved) {
        await createAdminNotification({
          type: "verification",
          title: "Médecin auto-approuvé",
          description: `${newUser.fullName} a été automatiquement approuvé (licence ${licenseNumber} vérifiée).`,
          relatedUser: String(newUser._id),
        });
      } else {
        await createAdminNotification({
          type: "verification",
          title: "Nouvelle demande de vérification",
          description: `${newUser.fullName} a soumis une demande de vérification médecin (licence ${licenseNumber} non reconnue).`,
          actionLabel: "Vérifier",
          actionPath: "/admin/verification",
          relatedUser: String(newUser._id),
        });
      }
    }

    if (role === "patient") {
      await createAdminNotification({
        type: "inscription",
        title: "Nouveau patient inscrit",
        description: `${newUser.fullName} vient de créer un compte patient sur CardioWave.`,
        relatedUser: String(newUser._id),
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.isApproved,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    // ── Doctor pending approval — return user info without token ──
    if (user.role === "doctor" && !user.isApproved) {
      res.status(200).json({
        requiresApproval: true,
        message: "Votre compte médecin est en attente de validation par l'administrateur.",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
        },
      });
      return;
    }

    const token = generateToken(String(user._id), user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        specialty: user.specialty,
        hospitalOrClinic: user.hospitalOrClinic,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({
      message: "Server error during login",
    });
  }
};