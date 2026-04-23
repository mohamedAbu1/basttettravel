module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
};
module.theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "3px",
          color: "var(--color)",
          minHeight: "64px",
          background: "rgba(255,255,255,0.08)",
        },
        notchedOutline: {
          borderColor: "var(--color)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#c9a34a",
          fontSize: "16px",
          fontWeight: 600,
        },
        focused: {
          color: "#b9972f",
        },
      },
    },
  },
});

