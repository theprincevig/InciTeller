import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Avatar } from "../../components/common";
import { ImageInput, TextInput } from "../../components/inputs";

export default function Profile() {
  const {
    authUser,
    updateProfile,
    updateProfileLoading
  } = useAuthStore();

  // ProtectedRoute guarantees authUser exists before this page renders
  const [name, setName] = useState(authUser.name ?? "");
  const [file, setFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFile = (picked) => {
    setFile(picked);
    if (picked) setRemoveAvatar(false);
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateProfileLoading) return;
    setError("");
    setSuccess("");

    const trimmed = name.trim();
    const fd = new FormData(); // send only what changed
    if (trimmed !== authUser.name) fd.append("name", trimmed);
    if (file) fd.append("avatar", file);
    else if (removeAvatar) fd.append("removeAvatar", "true");

    if ([...fd.keys()].length === 0) {
      setError("You haven't changed anything.");
      return;
    }

    const result = await updateProfile(fd);
    if (result.success) {
      setFile(null);
      setRemoveAvatar(false);
      setSuccess("Profile updated.");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 flex items-center gap-5">
        <Avatar user={authUser} className="h-20 w-20 text-3xl" />
        <div className="min-w-0">
          <h1 className="truncate font-display text-4xl font-bold">Profile</h1>
          <p className="truncate">{authUser.email}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          label="Display name"
          name="name"
          minLength={2}
          maxLength={50}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuccess("");
          }}
          hint="Shown on your stories."
          required
        />

        <TextInput
          label="Email"
          value={authUser.email}
          disabled
          hint="Email can't be changed yet."
        />

        <ImageInput
          label="Avatar"
          file={file}
          onChange={handleFile}
          currentUrl={removeAvatar ? "" : (authUser.avatar ?? "")}
          hint="PNG, JPG or WEBP, up to 5MB."
        />

        {authUser.avatar && !file && (
          <label className="flex items-center gap-3 font-bold">
            <input
              type="checkbox"
              checked={removeAvatar}
              onChange={(e) => {
                setRemoveAvatar(e.target.checked);
                setSuccess("");
              }}
              className="h-5 w-5 accent-rose"
            />
            Remove current avatar
          </label>
        )}

        {error && (
          <p role="alert" className="form-alert">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="form-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={updateProfileLoading}
          className="btn-primary btn-auto"
        >
          {updateProfileLoading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}