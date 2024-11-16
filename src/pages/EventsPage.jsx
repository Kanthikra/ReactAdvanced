import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  Checkbox,
  Card,
  Heading,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResponse = await fetch("http://localhost:3000/events");
      const eventData = await eventResponse.json();
      setEvents(eventData);
    };

    const fetchCategories = async () => {
      const categoryResponse = await fetch("http://localhost:3000/categories");
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
    };

    fetchEvents();
    fetchCategories();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryIds((prevCategoryIds) =>
      e.target.checked
        ? [...prevCategoryIds, value]
        : prevCategoryIds.filter((id) => id !== value)
    );
  };

  const filteredEvents = events.filter((event) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const isInSearchTerm =
      event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.description.toLowerCase().includes(lowerCaseSearchTerm);

    const isInSelectedCategories =
      categoryIds.length === 0 ||
      event.categoryIds.some((id) => categoryIds.includes(String(id)));

    return isInSearchTerm && isInSelectedCategories;
  });

  const handleAddEvent = () => {
    navigate("/add-event");
  };

  return (
    <Box>
      <Heading mb={6}>List of Events</Heading>

      <Input
        type="text"
        placeholder="Search for events..."
        value={searchTerm}
        onChange={handleSearchChange}
        mb={6}
      />

      <Box mb={6}>
        <Text fontWeight="bold" mb={2}>
          Filter by Categories
        </Text>
        <Box>
          {categories.map((category) => (
            <Box key={category.id} display="inline-block" mr={4}>
              <Checkbox
                value={category.id}
                isChecked={categoryIds.includes(String(category.id))}
                onChange={handleCategoryChange}
              >
                {category.name}
              </Checkbox>
            </Box>
          ))}
        </Box>
      </Box>

      <Button colorScheme="teal" mb={4} onClick={handleAddEvent}>
        Add Event
      </Button>

      <Box display="flex" flexWrap="wrap" gap={6}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                width={["100%", "300px"]}
                padding="4"
                borderRadius="md"
                boxShadow="md"
                minHeight="350px"
                textAlign="center"
              >
                <Box mb={4}>
                  <Text fontSize="xl" fontWeight="bold">
                    {event.title}
                  </Text>
                  <Text mb={4}>{event.description}</Text>
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>

                <Text>
                  <strong>Start Time:</strong>{" "}
                  {new Date(event.startTime).toLocaleString()}
                </Text>
                <Text>
                  <strong>End Time:</strong>{" "}
                  {new Date(event.endTime).toLocaleString()}
                </Text>
                <Text>
                  <strong>Categories:</strong> {event.categoryIds.join(", ")}
                </Text>
              </Card>
            </Link>
          ))
        ) : (
          <Text>No events found for the selected filters.</Text>
        )}
      </Box>
    </Box>
  );
};
