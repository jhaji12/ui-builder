// Element.js
import React from "react";
import { Box } from "@chakra-ui/react";

export const Element = ({ type, onClick }) => {
  return <Box onClick={onClick}>{type}</Box>;
};
