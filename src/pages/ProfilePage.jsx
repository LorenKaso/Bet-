import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import TerrainOutlinedIcon from "@mui/icons-material/TerrainOutlined";

function StatBlock({ value, label }) {
  return (
    <Stack alignItems="center" spacing={0.25} sx={{ minWidth: 68 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 20, lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontSize: 14 }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

function TabPanel({ value, index, children }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 1 }}>{children}</Box>;
}

// Placeholder grid — replace items with real content from your API
function ContentGrid({ items }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2px",
      }}
    >
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: "relative",
            aspectRatio: "1 / 1",
            bgcolor: "grey.100",
            backgroundImage: item.image ? `url(${item.image})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            transition: "opacity .15s ease",
            "&:hover": { opacity: 0.85 },
          }}
        />
      ))}
    </Box>
  );
}

export default function ProfilePage({ currentUser }) {  
  const { username } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = React.useState(0);
  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const challenges = [];
  const journey = [];
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [isFollowing, setIsFollowing] = React.useState(false);
  
  async function handleWatchClick() {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/users/${encodeURIComponent(username)}/follow`,
        {
          method: isFollowing ? "DELETE" : "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.detail || "Could not update follow");
        return;
      }
      setIsFollowing((prev) => !prev);

      setUser((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers:
            prev.stats.followers + (isFollowing ? -1 : 1),
        },
      }));
    } catch (error) {
      console.error("Follow request failed:", error);
    }
  }

  React.useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/users/${encodeURIComponent(username)}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("User not found");
          } else {
            setError("Could not load profile");
          }
          return;
        }

        const data = await response.json();

        setIsFollowing(data.is_following);
        
        setUser({
          name: data.user.name,
          handle: data.user.username,
          bio: data.user.bio ?? "",
          avatar: data.user.profile_image ?? "",
          stats: {
            posts: data.posts.length,
            followers: data.followers_count,
            following: data.following_count,
          },
          streak: 0,
        });

        setPosts(
          data.posts.map((post) => ({
            id: post.id,
            image: post.image_url,
            content: post.content,
            createdAt: post.created_at,
          }))
        );
      } catch (error) {
        console.error("Profile request failed:", error);
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Typography sx={{ mt: 4, textAlign: "center" }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Typography sx={{ mt: 4, textAlign: "center" }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  const isOwnProfile = currentUser?.username === user.handle;

  return (
    <Container
      maxWidth="sm"
      disableGutters
      sx={{ width: "100%", bgcolor: "background.paper", minHeight: "100vh" }}
    >
      {/* Top bar */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: "100%", px: 2, py: 1.5 }}
      >
        <IconButton edge="start" size="small" aria-label="Back">
          <ArrowBackIosNewOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="More options"
          sx={{ 
            ml: "auto",
            mr: 3.5,
           }}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Stack>

      {/* Identity row: avatar (+ handle beneath it) + stats */}
      <Stack direction="row" alignItems="flex-start" sx={{ px: 2, pt: 1 }}>
        <Stack alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
          <Avatar
            src={user.avatar || undefined}
            sx={{ width: 84, height: 84, fontSize: 30 }}
          >
            {user.name?.[0]}
          </Avatar>
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {user.handle}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
              flex: 1,
              minWidth: 0,
              pl: 4,
              pr: 4,
              mt: 3,
              ml:5,
              gap: 5,
            }}       
          >
          <StatBlock value={user.stats.posts} label="Posts" />
          <StatBlock value={user.stats.followers} label="Watchers" />
          <StatBlock value={user.stats.following} label="Watching" />
        </Stack>
      </Stack>

      {/* Name + bio — centered */}
      <Box sx={{ px: 2, pt: 1.5, textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            mt: 0.25,
            whiteSpace: "pre-line",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {user.bio}
        </Typography>

        {/* Days on the journey — centered beneath the bio.
            The real signal of this app: consistency, not popularity. */}
        {user.streak ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            sx={{ mt: 1 }}
          >
            <LocalFireDepartmentOutlinedIcon
              fontSize="small"
              sx={{ color: "warning.main" }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.streak}-day streak
            </Typography>
          </Stack>
        ) : null}
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ px: 2, pt: 2 }}>
        {isOwnProfile ? (
          <>
            <Button
              fullWidth
              variant="outlined"
              disableElevation
              onClick={() => navigate("/edit-profile")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "text.primary",
                borderColor: "grey.300",
              }}
            >
              Edit profile
            </Button>

            <Button
              fullWidth
              variant="outlined"
              disableElevation
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "text.primary",
                borderColor: "grey.300",
              }}
            >
              Share profile
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant={isFollowing ? "outlined" : "contained"}
              disableElevation
              onClick={handleWatchClick}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,

                ...(isFollowing
                  ? {
                      bgcolor: "white",
                      color: "text.primary",
                      borderColor: "grey.300",
                      "&:hover": {
                        bgcolor: "grey.50",
                        borderColor: "grey.400",
                      },
                    }
                  : {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }),
              }}
            >
              {isFollowing ? "Unwatch" : "Watch"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              disableElevation
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "text.primary",
                borderColor: "grey.300",
              }}
            >
              Message
            </Button>
          </>
        )}
      </Stack>

      {/* Tabs */}
      <Box sx={{ mt: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          TabIndicatorProps={{ sx: { height: 1, bgcolor: "text.primary" } }}
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 44,
              color: "grey.400",
              "&.Mui-selected": { color: "text.primary" },
            },
          }}
        >
          <Tab icon={<GridViewOutlinedIcon />} aria-label="Posts" />
          <Tab
            icon={<LocalFireDepartmentOutlinedIcon />}
            aria-label="Challenges"
          />
          <Tab icon={<TerrainOutlinedIcon />} aria-label="Journey" />
        </Tabs>
        <Divider />

        <TabPanel value={tab} index={0}>
          <ContentGrid items={posts} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ContentGrid items={challenges} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <ContentGrid items={journey} />
        </TabPanel>
      </Box>
    </Container>
  );
}