import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Textarea,
  Checkbox,
  Text,
} from "@chakra-ui/react";

export const AddEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isError, setIsError] = useState(false);
  const [serverError, setServerError] = useState("");

  // Haal categorieën op van de server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setServerError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryIds((prevCategoryIds) =>
      e.target.checked
        ? [...prevCategoryIds, value]
        : prevCategoryIds.filter((id) => id !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoryIds.length === 0) {
      setIsError(true);
      return;
    }

    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      image,
      categoryIds,
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("Event added successfully");
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setImage("");
        setCategoryIds([]);
      } else {
        setServerError("Error adding event, please try again.");
      }
    } catch (error) {
      setServerError("Failed to add event.");
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={10}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Box>
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </Box>

          <Box>
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              required
            />
          </Box>

          <Box>
            <label htmlFor="startTime">Start Time</label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </Box>

          <Box>
            <label htmlFor="endTime">End Time</label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </Box>

          <Box>
            <label htmlFor="image">Image URL</label>
            <Input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
            />
          </Box>

          <Box>
            <label htmlFor="categories">Categories</label>
            <Box id="categories">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={category.id}
                    isChecked={categoryIds.includes(String(category.id))}
                    onChange={handleCategoryChange}
                    ml={3}
                  >
                    {category.name}
                  </Checkbox>
                ))
              ) : (
                <Text>Loading categories...</Text>
              )}
            </Box>

            {isError && (
              <Box color="red.500" mt={2}>
                At least one category must be selected.
              </Box>
            )}
          </Box>

          {serverError && (
            <Box color="red.500" mt={2}>
              {serverError}
            </Box>
          )}

          <Button type="submit" colorScheme="teal">
            Add Event
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
