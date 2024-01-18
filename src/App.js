// App.js
import React, { useState } from "react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Sidebar, Canvas, PropertyEditor } from "./Components";

const App = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [draggedElementType, setDraggedElementType] = useState(null);

  const addElement = (type, position) => {
    // Add a new element to the canvas
    const newElement = {
      id: Date.now(),
      type: type,
      position: position,
      style: {
        fontSize: "16px",
        color: "black",
      },
    };

    setElements((prev) => [...prev, newElement]);
  };

  const addLabel = () => {
    addElement("Label", { top: 0, left: 0 });
  };

  const addButton = () => {
    addElement("Button", { top: 0, left: 0 });
  };

  const addHyperlink = () => {
    addElement("Hyperlink", { top: 0, left: 0 });
  };

  const handleElementSelect = (elementId) => {
    const selected = elements.find((element) => element.id === elementId);
    setSelectedElement(selected);
  };

  const handleStyleChange = (elementId, property, value) => {
    setElements((prevElements) => {
      return prevElements.map((element) => {
        if (element.id === elementId) {
          return {
            ...element,
            [property]: value,
            style: {
              ...element.style,
              [property]: value,
            },
          };
        }
        return element;
      });
    });
  };

  const handleDragStart = (elementType) => {
    setDraggedElementType(elementType);
  };

  return (
    <ChakraProvider>
      <Flex gap={2}>
        <Sidebar
          addLabel={addLabel}
          addButton={addButton}
          addHyperlink={addHyperlink}
          onDragStart={handleDragStart}
        />
        <Canvas
          elements={elements}
          setElements={setElements}
          onElementSelect={handleElementSelect}
        />
        <PropertyEditor
          elements={elements}
          selectedElement={selectedElement}
          handleStyleChange={handleStyleChange}
        />
      </Flex>
    </ChakraProvider>
  );
};

export default App;
