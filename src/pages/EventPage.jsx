import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Gebruik useParams om URL-parameter op te halen
import {
  Box,
  Text,
  Image,
  Heading,
  Tag,
  Button,
  useToast,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmation) {
      try {
        await fetch(`http://localhost:3000/events/${eventId}`, {
          method: "DELETE",
        });
        toast({
          title: "Event deleted",
          description: "The event was successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(
          `http://localhost:3000/events/${eventId}`
        );
        const eventData = await eventResponse.json();
        setEvent(eventData);

        const userResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        const userData = await userResponse.json();
        setUser(userData);

        const categoryResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching event or user data:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (!event || !user || !categories.length) {
    return <Text>Loading...</Text>;
  }

  const eventCategories = categories.filter((category) =>
    event.categoryIds.includes(String(category.id))
  );

  return (
    <Box maxWidth="900px" mx="auto" mt={6}>
      <Heading mb={4}>{event.title}</Heading>

      <Image
        src={event.image}
        alt={event.title}
        boxSize="80%"
        objectFit="cover"
        mb={4}
      />

      <Text fontSize="lg" mb={4}>
        {event.description}
      </Text>

      <Text>
        <strong>Start Time:</strong>{" "}
        {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text>
        <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
      </Text>

      <Text mt={4}>
        <strong>Categories:</strong>
      </Text>
      <Box>
        {eventCategories.length > 0 ? (
          eventCategories.map((category) => (
            <Tag key={category.id} colorScheme="teal" mr={2}>
              {category.name}
            </Tag>
          ))
        ) : (
          <Text>No categories available.</Text>
        )}
      </Box>

      <Box mt={6}>
        <Text>
          <strong>Created by:</strong>
        </Text>
        <Box display="flex" alignItems="center">
          <Image
            src={user.image}
            alt={user.name}
            boxSize="50px"
            borderRadius="full"
            mr={4}
          />
          <Text fontWeight="bold">{user.name}</Text>
        </Box>
      </Box>

      <Box mt={4} display="flex" gap={4}>
        <Button
          colorScheme="blue"
          onClick={() => navigate(`/edit-event/${event.id}`)}
        >
          Edit Event
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete Event
        </Button>
      </Box>
    </Box>
  );
};
