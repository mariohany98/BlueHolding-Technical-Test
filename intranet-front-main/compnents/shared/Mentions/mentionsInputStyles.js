export default {
  control: {
    backgroundColor: "transparent",
    fontSize: 16,
    // fontWeight: 'normal',
    placeholder: "red",
  },
  "&multiLine": {
    control: {
      fontFamily: "monospace",
    },
    highlighter: {
      padding: 9,
      border: "none",
    },
    input: {
      padding: 9,
      border: "none",
    },
  },
  "&singleLine": {
    display: "inline-block",
    width: 180,
    highlighter: {
      padding: 1,
      border: "none",
    },
    input: {
      padding: 1,
      border: "none",
    },
  },
  suggestions: {
    backgroundColor: `var(--navListBg)`,
    borderRadius: "5px",
    boxShadow: "3px 4px 34px 0px #022256",
    padding: "0",
    maxHeight: "200px",
    overflowY: "auto",
    list: {
      backgroundColor: `var(--navListBg)`,
      // border: '1px solid var(--navListBorderBot)',
      fontSize: 16,
    },
    item: {
      padding: "10px",
      borderBottom: "1px solid var(--navListBorderBot)",
      "&focused": {
        backgroundColor: "var(--hoverBg)",
        borderRadius: "5px",
      },
    },
  },
};
