import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function FooterMusicPlayer({ songList }) {
  const {
    currentSongData,
    refreshCurrentSong,
    shouldAutoPlay,
    setShouldAutoPlay,
  } = useAuth();

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load metadata and autoplay if needed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Autoplay if flagged
    if (shouldAutoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.error("Autoplay failed:", e));
      }
      setShouldAutoPlay(false);
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentSongData, shouldAutoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = async () => {
    if (!songList || !currentSongData) return;
    const currentIndex = songList.findIndex(
      (song) => song._id === currentSongData._id
    );
    const nextIndex = (currentIndex + 1) % songList.length;
    const nextSongId = songList[nextIndex]._id;
    setShouldAutoPlay(isPlaying);
    await refreshCurrentSong(nextSongId);
  };

  const handlePrevious = async () => {
    if (!songList || !currentSongData) return;
    const currentIndex = songList.findIndex(
      (song) => song._id === currentSongData._id
    );
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    const prevSongId = songList[prevIndex]._id;
    setShouldAutoPlay(isPlaying);
    await refreshCurrentSong(prevSongId);
  };

  if (!currentSongData) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
      bg="musiq.skin"
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      zIndex="999"
      px={4}
      py={2}
    >
      <audio
        ref={audioRef}
        src={`${axios.defaults.baseURL}${currentSongData.url}`}
        hidden
        onEnded={handleNext}
      />

      <Flex justify="space-between" align="center">
        <Text
          fontSize="md"
          fontWeight="bold"
          color="musiq.dark"
          noOfLines={1}
          maxW="60%"
        >
          {currentSongData.title}
        </Text>

        <Flex gap={4} align="center">
          <IconButton
            icon={<MdSkipPrevious />}
            onClick={handlePrevious}
            colorScheme="gray"
            aria-label="Previous"
            size="sm"
            isRound
          />
          <IconButton
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlay}
            colorScheme="orange"
            aria-label="Play/Pause"
            size="sm"
            isRound
          />
          <IconButton
            icon={<MdSkipNext />}
            onClick={handleNext}
            colorScheme="gray"
            aria-label="Next"
            size="sm"
            isRound
          />
        </Flex>
      </Flex>
    </Box>
  );
}

export default FooterMusicPlayer;
