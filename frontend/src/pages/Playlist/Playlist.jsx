import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../utils/useNotification";
import axios from "axios";
import FooterMusicPlayer from "../../components/FooterMusicPlayer";

function Playlist() {
  const [allPlaylist, setAllPlaylist] = useState([]);
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);
  const { token, refreshCurrentSong } = useAuth();
  const notification = useNotification();

  useEffect(() => {
    async function getAllUserPlaylist() {
      await axios
        .get("/api/playlists/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAllPlaylist(res.data);
        })
        .catch((err) => {
          notification.error("Error", err.message);
        });
    }
    getAllUserPlaylist();
  }, [token]);

  const handlePlay = (song) => {
    refreshCurrentSong(song._id, true);
  };

  const selectedPlaylist = allPlaylist[selectedPlaylistIndex];

  return (
    <>
      {selectedPlaylist && selectedPlaylist.songs.length > 0 && (
        <FooterMusicPlayer songList={selectedPlaylist.songs} />
      )}
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] p-4 gap-4">
        <Box
          flex={1}
          bg="gray.100"
          rounded="lg"
          overflowY="auto"
          p={4}
          boxShadow="md"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Playlists
          </Text>
          <VStack align="stretch" spacing={3}>
            {allPlaylist.map((playlist, index) => (
              <Box
                key={playlist._id}
                p={3}
                borderRadius="md"
                bg={index === selectedPlaylistIndex ? "teal.100" : "white"}
                cursor="pointer"
                onClick={() => setSelectedPlaylistIndex(index)}
                _hover={{ bg: "teal.50" }}
              >
                <Text fontWeight="medium">{playlist.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {playlist.songs.length} Songs
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box
          flex={2}
          bg="gray.50"
          rounded="lg"
          overflowY="auto"
          p={4}
          boxShadow="md"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {selectedPlaylist?.name || "Songs"}
          </Text>
          <VStack align="stretch" spacing={3}>
            {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
              selectedPlaylist.songs.map((song) => (
                <HStack
                  key={song._id}
                  justify="space-between"
                  p={3}
                  borderRadius="md"
                  bg="white"
                  boxShadow="sm"
                >
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{song.title}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {song.artist || "Unknown Artist"}
                    </Text>
                  </VStack>
                  <IconButton
                    icon={<FaPlay />}
                    aria-label="Play song"
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handlePlay(song)}
                  />
                </HStack>
              ))
            ) : (
              <Text>No songs available in this playlist.</Text>
            )}
          </VStack>
        </Box>
      </div>
    </>
  );
}

export default Playlist;
