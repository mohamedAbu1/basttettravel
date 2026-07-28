"use client";
import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useNotifications } from "@/context/NotificationsContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function NotificationsDrawer({
  open,
  onClose,
  themeName,
  handleNotificationClick,
  theme,
}) {
  const { notifications, deleteNotification } = useNotifications();

  const now = Date.now();
  const twoDays = 2 * 24 * 60 * 60 * 1000; // يومين بالمللي ثانية

  // ✅ فلترة وترتيب الإشعارات
  const filteredNotifications = notifications
    .filter((n) => n.event_type !== "message")
    .filter((n) => {
      const createdTime = new Date(n.created_at).getTime();
      return now - createdTime < twoDays; // احتفظ فقط بالإشعارات الأقل من يومين
    })
    .sort((a, b) => {
      // غير مقروءة أولاً
      if (a.is_read === 0 && b.is_read !== 0) return -1;
      if (a.is_read !== 0 && b.is_read === 0) return 1;
      // لو الاتنين نفس الحالة، رتب حسب التاريخ (الأحدث أولاً)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "left" }}
    >
      <div
        style={{
          width: 400,
          padding: "16px",
          color: themeName === "dark" ? "#fff" : "#333",
          backgroundColor: themeName === "dark" ? "#121212" : "#f9f9f9",
          minHeight: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
          Notifications
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {filteredNotifications.map((n) => (
            <Fade in={true} timeout={500} key={n.id}>
              <Box sx={{ mb: 3 }}>
                <DividerWithIcon />

                <ListItem
                  button
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    alignItems: "flex-start",
                    backgroundColor:
                      n.is_read === 1
                        ? "transparent"
                        : themeName === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: n.is_read
                      ? "none"
                      : "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor:
                        themeName === "dark" ? "#333" : "#eaeaea",
                    },
                  }}
                >
                  {/* صورة المستخدم */}
                  <Avatar
                    src={n.user_image}
                    alt={n.user_name}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />

                  {/* النصوص */}
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: n.is_read ? "normal" : "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {n.user_name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            className="text-gradient"
                            sx={{
                              fontStyle: "italic",
                              fontWeight: 500,
                              filter: `drop-shadow(0 0 4px ${theme.logoBorder || "#C2A878"})`,
                            }}
                          >
                            {n.user_email}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              fontWeight: "bold",
                              letterSpacing: "0.5px",
                              background: "var(--text-gradient)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              filter: `drop-shadow(0 0 6px ${theme.logoBorder || "#C2A878"})`,
                            }}
                          >
                            {n.message}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.5,
                              fontWeight: 400,
                              opacity: 0.8,
                              background: "var(--text-gradient)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              filter: `drop-shadow(0 0 3px ${theme.logoBorder || "#C2A878"})`,
                            }}
                          >
                            {new Date(n.created_at).toLocaleString("en-GB", {
                              timeZone: "Africa/Cairo",
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </Box>

                  {/* زر الحذف */}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteNotification(n.id)}
                    sx={{ color: "red", ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>

                <DividerWithIcon />
              </Box>
            </Fade>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
