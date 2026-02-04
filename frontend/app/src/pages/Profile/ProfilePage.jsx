import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setLoading(false);
    }
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 w-full">
    <h3 className="font-bold">
      Profile Settings
      </h3>

      <div className="space-y-8 mt-6">

        {/* USER INFO */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">User Information</h3>

          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Username
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <User className="h-4 w-4 text-neutral-400" />
            </div>
            <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm">
              {username}
            </p>
          </div>

          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Mail className="h-4 w-4 text-neutral-400" />
            </div>
            <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm">
              {email}
            </p>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <form onSubmit={handleChangePassword} className="space-y-4">

            {/* Current Password */}
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              setValue={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
            />

            {/* New Password */}
            <PasswordInput
              label="New Password"
              value={newPassword}
              setValue={setNewPassword}
              show={showNew}
              setShow={setShowNew}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm New Password"
              value={confirmNewPassword}
              setValue={setConfirmNewPassword}
              show={showConfirm}
              setShow={setShowConfirm}
            />

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

  const PasswordInput = ({ label, value, setValue, show, setShow }) => (
  <div>
    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
      {label}
    </label>

    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <Lock className="h-4 w-4 text-neutral-400" />
      </div>

      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full h-9 pl-9 pr-10 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default ProfilePage;
