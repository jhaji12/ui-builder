import React, { useState } from "react";
import { Box, Text, Link, Flex } from "@chakra-ui/react";

export const Canvas = ({ elements, setElements, onElementSelect }) => {
  const [draggedElement, setDraggedElement] = useState(null);

  const handleDragStart = (e, element) => {
    // Set the dataTransfer payload to the draggedElement itself
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ ...element, isDraggingWithinCanvas: true })
    );
    setDraggedElement(element);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    // Retrieve the dragged element from the dataTransfer payload
    const draggedElementData = e.dataTransfer.getData("application/json");
    const draggedElement = JSON.parse(draggedElementData);

    if (draggedElement) {
      const position = { top: e.clientY, left: e.clientX };

      if (draggedElement.isDraggingWithinCanvas) {
        // Dragged within the canvas, move the element
        moveElement(draggedElement, position);
      } else {
        // Dragged from sidebar, create a new element
        addElement(draggedElement.type, position);
      }

      setDraggedElement(null);
    }
  };

  const addElement = (type, position) => {
    const newElement = {
      id: Date.now(),
      type,
      position,
      style: {
        fontSize: "16",
        color: type === "Button" ? "white" : "black",
        backgroundColor: type === "Button" ? "blue.900" : "",
      },
      text: getTextForType(type),
    };

    setElements((prev) => [...prev, newElement]);
  };

  const moveElement = (element, newPosition) => {
    const updatedElements = elements.map((el) =>
      el.id === element.id ? { ...el, position: newPosition } : el
    );

    setElements(updatedElements);
  };

  const getTextForType = (type) => {
    switch (type) {
      case "Label":
        return "Label Text";
      case "Button":
        return "Button Text";
      case "Hyperlink":
        return "Link Text";
      default:
        return "";
    }
  };

  return (
    <Flex
      bg="gray.200"
      w="390px"
      h="98vh"
      flexDir={"column"}
      p={4}
      m={2}
      borderRadius={20}
      justifyContent={"flex-start"}
      gap={2}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
    >
      {elements.length > 0 ? (
        elements.map((element) => (
          <Box
            key={element.id}
            draggable
            onDragStart={(e) => handleDragStart(e, element)}
            onClick={() => onElementSelect(element.id)}
            style={{
              position: "absolute",
              top: element.position.top,
              left: element.position.left,
            }}
          >
            {renderElement(element)}
          </Box>
        ))
      ) : (
        <Flex h="100%" w="100%" justifyContent={"center"} align={"center"}>
          <Text fontWeight={700} color={"gray.500"}>
            + Add elements from the sidebar
          </Text>
        </Flex>
      )}
      {draggedElement && (
        <Box
          position="absolute"
          top={draggedElement.position.top}
          left={draggedElement.position.left}
          draggable
          onDragStart={(e) => handleDragStart(e, draggedElement)}
        >
          {renderElement(draggedElement)}
        </Box>
      )}
    </Flex>
  );
};

const renderElement = (element) => {
  switch (element.type) {
    case "Label":
      return (
        <Text
          fontSize={element.style?.fontSize}
          color={element.style?.color}
          cursor={"pointer"}
        >
          {element.text}
        </Text>
      );
    case "Button":
      return (
        <Box
          as="button"
          fontSize={element?.style?.fontSize}
          color={element?.style?.color}
          bg={element?.style?.backgroundColor}
          p={2}
          borderRadius={4}
        >
          {element?.text}
        </Box>
      );
    case "Hyperlink":
      return (
        <Link
          href={element?.url}
          fontSize={element?.style?.fontSize}
          color={element?.style?.color}
          textDecoration="underline"
          cursor={"pointer"}
        >
          {element?.text}
        </Link>
      );
    default:
      return null;
  }
};
