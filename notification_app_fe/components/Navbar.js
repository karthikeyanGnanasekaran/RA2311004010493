import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Campus Notifications
        </Typography>
        <Box>
          <Link href="/">
            <Button
              color="inherit"
              variant={router.pathname === "/" ? "outlined" : "text"}
            >
              All Notifications
            </Button>
          </Link>
          <Link href="/priority">
            <Button
              color="inherit"
              variant={router.pathname === "/priority" ? "outlined" : "text"}
            >
              Priority
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}