import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#ff8000" },
        secondary: { main: "#ffd700" },
        background: { default: "#fff5e1" },
        text: { primary: "#4d2600" },
        error: { main: "#db4a39" },
    },
    typography: {
        fontFamily: "'Rubik', sans-serif",
        h1: { fontSize: "24px", color: "#4d2600" },
        h2: { fontSize: "22px", color: "#4d2600" },
        h3: { fontSize: "20px", color: "#4d2600" },
    },
    shape: {
        borderRadius: 5,
    },
});

export default theme;
