import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text } from "@chakra-ui/react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box p={5}>
      <Text fontSize="xl">{message}</Text>
    </Box>
  );
}

export default App;
