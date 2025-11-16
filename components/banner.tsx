"use client";

import { Dispatch, SetStateAction } from "react";

type BannerProps = {
  hide: boolean;
  setHide: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Banner = ({ hide, setHide }: BannerProps) => {
  // Banner is disabled
  return null;
};

export default Banner;
