// SaveButton.js
import React from "react";
import { Button } from "@chakra-ui/react";

export const SaveButton = ({ onSave }) => {
  return (
    <Button backgroundColor="#2A4365" color="white" onClick={onSave} mt={2}>
      Save
    </Button>
  );
};
