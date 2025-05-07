import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  Stack,
  useBreakpointValue,
  SkeletonCircle,
  SkeletonText,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { FetchSongPosterUrl } from "../utils/FetchSongPosterUrl";
import { useAuth } from "../context/AuthContext";
import { FaSearch } from "react-icons/fa";

const TopCharts = () => {
  const [songsMemoize, setSongsMemoize] = useState();
  const [allSongs, setAllSongs] = useState();
  const [loaded, setLoaded] = useState(false);
  const { refreshCurrentSong, setSongList } = useAuth();

  useEffect(() => {
    async function getAllSongs() {
      try {
        setLoaded(false);
        const res = await axios.get("/api/songs");
        const data = res.data;

        if (data && Array.isArray(data)) {
          const updatedData = await Promise.all(
            data.map(async (item) => {
              const poster = await FetchSongPosterUrl(item.title);
              return { ...item, poster };
            })
          );

          setAllSongs(updatedData);
          setSongsMemoize(updatedData);
          setSongList(updatedData.map((item) => item._id));
          await refreshCurrentSong(updatedData[0]._id);
          setLoaded(true);
        }
      } catch (err) {
        console.log("Error fetching songs or posters:", err);
      }
    }

    getAllSongs();
  }, []);

  const scrollRef = useRef(null);
  const scrollAmount = useBreakpointValue({ base: 200, md: 300 });

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSongChange = async (id) => {
    await refreshCurrentSong(id);
  };

  const handleSongSearch = (e) => {
    let searchText = e.target.value.trim().toLowerCase();

    if (searchText.length === 0) {
      setAllSongs(songsMemoize);
      return;
    }

    setAllSongs(
      songsMemoize.filter(
        (song) =>
          song.title.toLowerCase().includes(searchText) ||
          song.album.toLowerCase().includes(searchText) ||
          song.artist.toLowerCase().includes(searchText)
      )
    );
  };

  return (
    <Box
      position="relative"
      px={{ base: 4, md: 8 }}
      py={6}
      backgroundColor="white"
      borderRadius={15}
    >
      <Flex align="center" justify="space-between" mb={4}>
        <Heading size="md">Charts: All Songs</Heading>
        <Flex>
          <InputGroup className="mr-2">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Search Song..."
              onChange={handleSongSearch}
            />
          </InputGroup>
          <IconButton
            aria-label="Scroll left"
            icon={<FiChevronLeft />}
            onClick={() => handleScroll("left")}
            variant="outline"
            mr={2}
          />
          <IconButton
            aria-label="Scroll right"
            icon={<FiChevronRight />}
            onClick={() => handleScroll("right")}
            variant="outline"
          />
        </Flex>
      </Flex>

      <Box
        ref={scrollRef}
        overflowX="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Flex gap={4}>
          {!loaded && (
            <Box padding="6" boxShadow="lg" bg="white" maxW="full" w="full">
              <SkeletonCircle size="10" />
              <SkeletonText
                mt="4"
                noOfLines={4}
                spacing="4"
                skeletonHeight="2"
              />
            </Box>
          )}
          {loaded && (
            <>
              {allSongs && allSongs.length > 0 ? (
                <>
                  {allSongs.map((song) => (
                    <Box
                      key={song._id}
                      minW={{ base: "140px", md: "180px" }}
                      bg="white"
                      borderRadius="lg"
                      boxShadow="sm"
                      _hover={{ boxShadow: "md", cursor: "pointer" }}
                      overflow="hidden"
                      onClick={() => handleSongChange(song._id)}
                    >
                      <Image
                        src={song.poster}
                        alt={song.title}
                        objectFit="cover"
                        w="100%"
                        h={{ base: "120px", md: "140px" }}
                      />
                      <Stack p={3} spacing={1}>
                        <Text fontWeight="semibold" noOfLines={1}>
                          {song.title}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {song.artist}
                        </Text>
                      </Stack>
                    </Box>
                  ))}
                </>
              ) : (
                <Text fontSize="xl">No Song Matches Your Search...</Text>
              )}
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default TopCharts;
