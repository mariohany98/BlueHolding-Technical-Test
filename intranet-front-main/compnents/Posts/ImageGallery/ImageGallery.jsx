import React, { Fragment, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Styles from "./ImageGallery.module.css";

export default function ImageGallery({ images = [] }) {
  const [index, setIndex] = useState(-1);
  const photos = images.map((image_path, index) => {
    const width = 500;
    const height = 256;
    return {
      src: `${image_path}`,
      key: `${index}`,
      width,
      height,
      alt: `Post Image`,
    };
  });

  const colGallery = () => {
    switch (photos.length) {
      case 1:
        return "one-col-gallery";
      case 2:
        return "two-cols-gallery";
      case 3:
        return "four-cols-gallery";
      default:
        return "three-cols-gallery";
    }
  };
  return (
    <div
      className={`gallery ${
        photos.length === 2 ? "count2" : ""
      }`}
    >
      {photos.map((gallery, index) => {
        if (index > 3) return;
        if (photos.length > 4 && index === 3) {
          return (
            <span 
              key={index}
              onClick={() => {
                setIndex(index);
              }}
            >
              <img
                alt="post"
                src={`${photos[index].src}`}
                loading="lazy"
              />
              <label>+{photos.length - 4} See More</label>
            </span>
          );
        } else {
          return (
            <img
              src={`${gallery.src}`}
              key={index}
              loading="lazy"
              alt="post"
              onClick={() => {
                setIndex(index);
              }}
            />
          );
        }
      })}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
        render={{
          slide: (image) => {
            return (
              <img
                src={image.slide.src}
                loading="lazy"
                alt={image.slide.alt}
                height={"100%"}
              />
            );
          },
        }}
        plugins={[Thumbnails]}
      />
    </div>
  );
}
