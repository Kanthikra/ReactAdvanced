import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Text, Button, Input, Textarea } from "@chakra-ui/react";

export const EditEventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      const response = await fetch(`http://localhost:3000/events/${eventId}`);
      const data = await response.json();
      setEvent(data);
    };
    fetchEventData();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        navigate(`/event/${eventId}`);
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!event) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box maxWidth="900px" mx="auto" mt={6}>
      <Text fontSize="2xl" mb={4}>
        Edit Event
      </Text>

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
          placeholder="Event Title"
          mb={4}
        />
        <Textarea
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          placeholder="Event Description"
          mb={4}
        />

        <Button colorScheme="teal" type="submit">
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditEventPage;
