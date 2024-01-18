// Sidebar.js
import React from "react";
import { VStack, Button } from "@chakra-ui/react";

export const Sidebar = ({ addLabel, addButton, addHyperlink, onDragStart }) => {
  const handleDragStart = (e, elementType) => {
    const draggedElement = {
      id: Date.now(),
      type: elementType,
    };

    // Set the dataTransfer payload to the draggedElement object
    e.dataTransfer.setData("application/json", JSON.stringify(draggedElement));
    onDragStart(draggedElement);
  };

  return (
    <VStack spacing={4} w={"20%"} p={2} bg="blue.900">
      <Button
        w="100%"
        onClick={addLabel}
        onDragStart={(e) => handleDragStart(e, "Label")}
        draggable
      >
        Add Label
      </Button>
      <Button
        w="100%"
        onClick={addButton}
        onDragStart={(e) => handleDragStart(e, "Button")}
        draggable
      >
        Add Button
      </Button>
      <Button
        w="100%"
        onClick={addHyperlink}
        onDragStart={(e) => handleDragStart(e, "Hyperlink")}
        draggable
      >
        Add Hyperlink
      </Button>
    </VStack>
  );
};
