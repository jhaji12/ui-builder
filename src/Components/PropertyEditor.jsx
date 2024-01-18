// PropertyEditor.js
import React, { useState, useEffect } from "react";
import {
  VStack,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Box,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Button,
  Card,
} from "@chakra-ui/react";
import { SaveButton } from "./SaveButton";

export const PropertyEditor = ({
  elements,
  selectedElement,
  handleStyleChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [code, setCode] = useState("");
  const [textValue, setTextValue] = useState(selectedElement?.text || "");
  const [url, setURL] = useState(selectedElement?.url || "");
  const [color, setColor] = useState(selectedElement?.style.color || "");
  const [marginTop, setMarginTop] = useState(
    selectedElement?.style.marginTop || 3
  );
  const [backgroundColor, setBackgroundColor] = useState(
    selectedElement?.style.backgroundColor || ""
  );

  const [sliderValue, setSliderValue] = useState(
    selectedElement?.style.fontSize || 16
  );

  useEffect(() => {
    setSliderValue(selectedElement?.style.fontSize || 16);
    setTextValue(selectedElement?.text || "");
    setURL(selectedElement?.url || "");
    setColor(selectedElement?.style.color || "");
    setBackgroundColor(selectedElement?.style.backgroundColor || "");
    setMarginTop(selectedElement?.style.marginTop || 3);
  }, [selectedElement]);

  const onPropertyValueChange = (property, value) => {
    let parsedValue = value;
    if (property === "fontSize" || property === "marginTop") {
      parsedValue = value.replace(/px$/, "");
    }
    handleStyleChange(selectedElement?.id, property, parsedValue);
  };

  const onFontSizeChange = (value) => {
    const fontSize = parseFloat(value);
    if (!isNaN(fontSize)) {
      onPropertyValueChange("fontSize", `${fontSize}px`);
      setSliderValue(fontSize);
    }
  };

  const onMarginTopChange = (value) => {
    const marginTop = parseFloat(value);
    if (!isNaN(marginTop)) {
      onPropertyValueChange("marginTop", `${marginTop}px`);
      setMarginTop(marginTop);
    }
  };

  const onSave = () => {
    // Define an array to store the JSON representation of all elements
    const allElementsJson = elements.map((element) => {
      return {
        elementType: element.type,
        value: element.text,
        styleProperties: {
          "margin-top": element.style.marginTop,
          "font-size": element.style.fontSize,
        },
      };
    });
    const modalContent = JSON.stringify(allElementsJson, null, "\t");
    // Generate HTML, CSS, and JS code snippets based on the JSON
    const htmlSnippet = generateHTML(allElementsJson);
    const cssSnippet = generateCSS(allElementsJson);
    const jsSnippet = generateJS(allElementsJson);

    // Combine the snippets for display
    setCode(`
        <div>
            <h2>HTML</h2>
            <pre>${htmlSnippet}</pre>
        </div>
        <div>
            <h2>CSS</h2>
            <pre>${cssSnippet}</pre>
        </div>
        <div>
            <h2>JavaScript</h2>
            <pre>${jsSnippet}</pre>
        </div>
    `);

    // Log or send the array of JSON representations as needed
    console.log("JSON Representations:", allElementsJson);

    // Set the modal content with the generated snippets
    setModalContent(modalContent);

    // Open the modal
    setIsModalOpen(true);
  };

  const generateHTML = (elements) => {
    // Generate HTML code snippet based on the elements
    return elements
      .map((element) => {
        return `<${element.elementType.toLowerCase()} style="margin-top: ${
          element.styleProperties["margin-top"]
        };
        font-size: ${element.styleProperties["font-size"]}">${
          element.value || ""
        }</${element.elementType.toLowerCase()}>`;
      })
      .join("\n");
  };

  const generateCSS = (elements) => {
    // Generate CSS code snippet based on the elements
    return elements
      .map((element) => {
        return `.${element.elementType.toLowerCase()} {
            margin-top: ${element.styleProperties["margin-top"]};
            font-size: ${element.styleProperties["font-size"]};
        }`;
      })
      .join("\n");
  };

  const generateJS = (elements) => {
    // Generate JavaScript code snippet based on the elements
    return `
        document.addEventListener("DOMContentLoaded", function () {
            const app = document.getElementById("app");

            // Create elements based on JSON
            ${elements
              .map((element) => {
                return `
                    const ${element.elementType.toLowerCase()} = document.createElement("${element.elementType.toLowerCase()}");
                    ${element.elementType.toLowerCase()}.textContent = "${
                  element.value || ""
                }";
                    ${element.elementType.toLowerCase()}.classList.add("${element.elementType.toLowerCase()}");
                    ${Object.entries(element.styleProperties)
                      .map(
                        ([property, value]) => `
                        ${element.elementType.toLowerCase()}.style.${property} = "${value}";
                    `
                      )
                      .join("\n")}
                    app.appendChild(${element.elementType.toLowerCase()});
                `;
              })
              .join("\n")}
        });
    `;
  };

  return (
    <VStack w="50%" spacing={4}>
      <Flex
        w="100%"
        h="390px"
        maxH="390px"
        overflowY={"scroll"}
        flexDir="row-reverse"
        gap={2}
        justifyContent={"space-between"}
        mt={2}
      >
        <SaveButton onSave={onSave} onClick={() => setIsModalOpen(true)} />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>JSON Representation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <Text>{modalContent}</Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex w="80%" spacing={4} flexWrap={"wrap"}>
          <FormControl>
            <FormLabel>Text Value</FormLabel>
            <Input
              type="text"
              value={textValue}
              onChange={(e) => {
                onPropertyValueChange("text", e.target.value);
                setTextValue(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Font Size</FormLabel>
            <Input
              type="number"
              value={sliderValue}
              onChange={(e) => onFontSizeChange(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Font Size Slider</FormLabel>
            <Slider
              min={12}
              max={36}
              step={1}
              value={sliderValue}
              onChange={(value) => onFontSizeChange(value)}
            >
              <SliderTrack>
                <SliderFilledTrack bg="blue.500" />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box
                  color="black"
                  fontSize="sm"
                  fontWeight="bold"
                  textAlign="center"
                  textTransform="uppercase"
                  mt="-20px"
                >
                  {sliderValue}
                </Box>
              </SliderThumb>
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel>Margin Top</FormLabel>
            <Input
              type="number"
              value={marginTop}
              onChange={(e) => onMarginTopChange(e.target.value)}
            />
          </FormControl>
          {selectedElement?.type === "Hyperlink" && (
            <FormControl>
              <FormLabel>URL</FormLabel>
              <Input
                type="text"
                value={url}
                onChange={(e) => {
                  onPropertyValueChange("url", e.target.value);
                  setURL(e.target.value);
                }}
              />
            </FormControl>
          )}
          <FormControl>
            <FormLabel>Color</FormLabel>
            <Input
              type="text"
              value={color}
              onChange={(e) => {
                onPropertyValueChange("color", e.target.value);
                setColor(e.target.value);
              }}
            />
          </FormControl>
          {selectedElement?.type === "Button" && (
            <>
              <FormControl>
                <FormLabel>Background Color</FormLabel>
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => {
                    onPropertyValueChange("backgroundColor", e.target.value);
                    setBackgroundColor(e.target.value);
                  }}
                />
              </FormControl>
            </>
          )}
        </Flex>
      </Flex>
      <Card
        h="370px"
        maxH="370px"
        w="100%"
        overflowY={"scroll"}
        p={4}
        border={"dashed"}
        borderColor={"gray.200"}
      >
        <Text fontWeight={600} my={2}>
          HTML/CSS/JS
        </Text>
        {code ? code : "Click on Save Button To Get the HTML/CSS/JS code"}
      </Card>
    </VStack>
  );
};
