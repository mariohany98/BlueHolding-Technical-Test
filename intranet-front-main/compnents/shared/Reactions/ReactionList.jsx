import React from "react";
import Image from "next/image";
import Styles from "./Reactions.module.css";

export default function ReactionList({
  likes,
  loves,
  celebrate,
  total_reactions,
}) {
  const list = [
    { count: likes, src: "/images/like.svg", alt: "Like" },
    { count: loves, src: "/images/love.svg", alt: "love" },
    { count: celebrate, src: "/images/celebrate.svg", alt: "celebrate" },
  ];

  list.sort((a, b) => b.count - a.count);

  if (total_reactions === 0) return <></>;

  return (
    <small>
      <span className={Styles.reactionsList}>
        {list.map((reaction, index) => {
          if (reaction.count > 0) {
            return (
              <Image
                key={index}
                src={reaction.src}
                alt={reaction.alt}
                width="20"
                height="20"
              />
            );
          }
        })}
        &nbsp; {total_reactions}
      </span>
    </small>
  );
}
