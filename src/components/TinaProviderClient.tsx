"use client";

import React from "react";
import { TinaProvider, TinaCMS } from "tinacms";
import tinaConfig from "../../tina/config";

interface Props {
  children: React.ReactNode;
}

export const TinaProviderClient: React.FC<Props> = ({ children }) => {
  return (
    <TinaProvider cms={new TinaCMS(tinaConfig)}>
      {children}
    </TinaProvider>
  );
};

export default TinaProviderClient;