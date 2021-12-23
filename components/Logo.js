import cx from "classnames";
import noBgLogo from "../public/logo-v1.svg";
import bgLogo from "../public/logo-v1-bg.svg";
import * as styles from "./Logo.module.css";
import Image from "next/image";

const IMAGE_SIZE = {
  normal: {width: 50, height: 50 }
}

export default function Logo({ size = "normal", type = "no-background" }) {
  const image = type === "no-background" ? noBgLogo : bgLogo;
  return (
    <Image src={image.src} className={styles.logo} {...IMAGE_SIZE[size]} alt="pCloud" />
  );
}
