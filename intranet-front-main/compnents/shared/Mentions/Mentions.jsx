import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Mention, MentionsInput } from "react-mentions";
import merge from "lodash/merge";
import mentionStyles from "./mentionStyles";
import mentionsInputStyles from "./mentionsInputStyles";

export default function Mentions({comment, setComment}) {
  const users = useSelector((state) => state.users.users);
  let customStyle = merge({}, mentionsInputStyles, {
    input: {
      height: 42,
      overflow: "auto",
      outline: "unset",
      color: "var(--text)",
    },
    highlighter: {
      height: 42,
      overflow: "hidden",
      boxSizing: "border-box",
    },
  });

  return (
    <MentionsInput
      className="mentions"
      value={comment}
      onChange={(e) => {
        setComment(e.target.value);
      }}
      style={customStyle}
      placeholder={"Write a comments"}
      a11ySuggestionsListLabel={"Suggested mentions"}
    >
      <Mention data={users} style={mentionStyles} />
    </MentionsInput>
  );
}
