import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
  },
};

export default function EditProfilePage({ setCurrentUser }) {  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [profileImage, setProfileImage] = React.useState("");

  const [errors, setErrors] = React.useState({});

  const navigate = useNavigate();

  const [saving, setSaving] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  function validate() {
    const newErrors = {};

    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanBio = bio.trim();

    if (!cleanName) {
      newErrors.name = "Name is required";
    } else if (cleanName.length > 50) {
      newErrors.name = "Name must be 50 characters or less";
    }

    if (!cleanUsername) {
      newErrors.username = "Username is required";
    } else if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      newErrors.username = "Username must be between 3 and 50 characters";
    } else if (!/^[a-zA-Z0-9._@-]+$/.test(cleanUsername)) {
      newErrors.username =
        "Username can contain only letters, numbers, ., _, @ and -";
    }

    if (cleanBio.length > 150) {
      newErrors.bio = "Bio must be 150 characters or less";
    }

    if (
      profileImage.trim() &&
      !/^https?:\/\/.+/i.test(profileImage.trim())
    ) {
      newErrors.profileImage = "Please enter a valid image URL";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

 async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
        return;
    }

    setSaving(true);
    setServerError("");

    try {
        const response = await fetch(
        "http://localhost:8000/users/me",
        {
            method: "PATCH",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            name: name.trim(),
            username: username.trim(),
            bio: bio.trim() || null,
            profile_image: profileImage.trim() || null,
            }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                setErrors((prev) => ({
                ...prev,
                username: "This username is already taken",
                }));
            } else if (response.status === 401) {
                setServerError("You must be logged in to edit your profile");
            } else {
                setServerError(
                data.detail || "Could not update profile"
                );
            }
            return;
        }

        setCurrentUser((prev) => ({
            ...prev,
            name: data.user.name,
            username: data.user.username,
        }));

navigate(`/profile/${data.user.username}`);

    } catch (error) {
        console.error("Update profile failed:", error);
        setServerError("Could not connect to the server");
    } finally {
        setSaving(false);
    }
  }
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          borderRadius: 4,
          p: 3,
          bgcolor: "background.paper",
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
        >
          Edit Profile
        </Typography>

        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Avatar
            src={profileImage || undefined}
            sx={{ width: 90, height: 90 }}
          >
            {name?.[0]}
          </Avatar>

          <Typography variant="body2" color="text.secondary">
            Update your profile details
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
              inputProps={{ maxLength: 50 }}
              fullWidth
              sx={fieldStyle}
            />

            <TextField
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              error={Boolean(errors.username)}
              helperText={errors.username}
              inputProps={{ maxLength: 50 }}
              fullWidth
              sx={fieldStyle}
            />

            <TextField
              label="Bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              error={Boolean(errors.bio)}
              helperText={
                errors.bio || `${bio.length}/150`
              }
              multiline
              minRows={3}
              maxRows={3}
              inputProps={{ maxLength: 150 }}
              fullWidth
              sx={fieldStyle}
            />

            <TextField
              label="Profile image URL"
              value={profileImage}
              onChange={(event) =>
                setProfileImage(event.target.value)
              }
              error={Boolean(errors.profileImage)}
              helperText={errors.profileImage}
              fullWidth
              sx={fieldStyle}
            />
            {serverError && (
                <Typography
                    color="error"
                    variant="body2"
                    sx={{ textAlign: "center" }}
                >
                    {serverError}
                </Typography>
            )}

            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    py: 1.2,
                }}
                >
                {saving ? "Saving..." : "Save changes"}
                </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}