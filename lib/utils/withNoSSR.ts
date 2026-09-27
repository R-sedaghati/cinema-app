"use client";

import dynamic from "next/dynamic";
import React from "react";

const withNoSSR = <P extends object>(Component: React.ComponentType<P>) =>
  dynamic(() => Promise.resolve(Component), { ssr: false });

export default withNoSSR;
