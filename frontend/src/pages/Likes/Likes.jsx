import React, { useEffect, useState } from "react";
import FooterMusicPlayer from "../../components/FooterMusicPlayer";
import {
  Box,
  StackDivider,
  Text,
  VStack,
  HStack,
  IconButton,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import { useNotification } from "../../utils/useNotification";

function Likes() {
  const { token, refreshCurrentSong } = useAuth();
  const [allUserFavourites, setAllUserFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    async function fetchAllUserFavourites() {
      setIsLoading(true);
      await axios
        .get("/api/users/getUserFavourites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          console.log(res.data);
          setAllUserFavourites(res.data);
          setIsLoading(false);
          await refreshCurrentSong(res.data.favourites[0]._id);
        })
        .catch((err) => {
          notification.error("Error !", err.message);
          setIsLoading(false);
        });
    }

    fetchAllUserFavourites();
  }, [token]);

  const handlePlay = async (song) => {
    await refreshCurrentSong(song._id, true);
  };

  return (
    <>
      {isLoading ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <div>
          <FooterMusicPlayer songList={allUserFavourites.favourites} />
          <Text fontSize="3xl" mb="1%">
            All Liked Songs
          </Text>
          <Box maxH="60vh" overflowY="auto">
            <VStack spacing={2} align="stretch">
              {allUserFavourites &&
              allUserFavourites.favourites &&
              allUserFavourites.favourites.length > 0 ? (
                allUserFavourites.favourites.map((song, index) => (
                  <HStack
                    key={index}
                    justify="space-between"
                    p={2}
                    borderRadius="5px"
                    bg="musiq.skin"
                  >
                    <Text fontSize="lg">{song.title}</Text>
                    <IconButton
                      aria-label="Play song"
                      icon={<FaPlay />}
                      onClick={() => handlePlay(song)}
                      colorScheme="teal"
                      size="sm"
                    />
                  </HStack>
                ))
              ) : (
                <Box h="40px" px={4}>
                  No Liked Songs to display...
                </Box>
              )}
            </VStack>
          </Box>
        </div>
      )}
    </>
  );
}

export default Likes;
