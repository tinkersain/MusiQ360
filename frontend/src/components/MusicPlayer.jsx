import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  CardBody,
  Card,
  Image,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { CgPlayListAdd } from "react-icons/cg";
import { useNotification } from "../utils/useNotification";

function MusicPlayer() {
  const {
    currentSongData,
    refreshCurrentSong,
    setCurrentSongData,
    refreshUserDetails,
    token,
  } = useAuth();
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { songList } = useAuth();
  const notification = useNotification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const [userPlaylist, setUserPlaylist] = useState([]);

  // Load metadata and subscribe to time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [currentSongData]);

  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.error("Auto play failed:", e);
        });
      }
      setIsPlaying(true);
      setShouldAutoPlay(false); // reset the flag
    }
  }, [currentSongData]);

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek
  const handleSliderChange = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleNext = async () => {
    const currentIndex = songList.indexOf(currentSongData._id);
    const nextSongId = songList[(currentIndex + 1) % songList.length];
    setShouldAutoPlay(isPlaying);
    await refreshCurrentSong(nextSongId);
  };

  const handlePrevious = async () => {
    const currentIndex = songList.indexOf(currentSongData._id);
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    const prevSongId = songList[prevIndex];
    setShouldAutoPlay(isPlaying);
    await refreshCurrentSong(prevSongId);
  };

  // Format mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleFavourites = async () => {
    try {
      const res = await axios.post(
        "/api/songs/addToFavourites",
        {
          id: currentSongData._id,
          isDelete: currentSongData.isFavourite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notification.success(
        currentSongData.isFavourite
          ? "Removed from Favourites"
          : "Added to Favourites",
        ""
      );

      await refreshUserDetails();

      // Optimistically update the UI
      setCurrentSongData((prev) => ({
        ...prev,
        isFavourite: !prev.isFavourite,
      }));
    } catch (err) {
      notification.error("Error!", err.message);
    }
  };

  const handleAddToPlaylist = async () => {
    await axios
      .get("/api/playlists/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserPlaylist(res.data);
        onOpen();
      });
  };

  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.length === 0) {
      notification.error("Error", "Playlist Name Cannot be Empty !");
      return;
    } else {
      await axios
        .post(
          "/api/playlists",
          { name: newPlaylistName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(async () => {
          notification.success("Playlist Created", "");
          setNewPlaylistName("");
          await axios
            .get("/api/playlists/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log(res.data);
              setUserPlaylist(res.data);
            });
        })
        .catch((err) => {
          notification.error("Error", err.message);
        });
    }
  };

  const [selectedPlaylist, setSelectedPlaylist] = useState();

  const AddSong = async () => {
    console.log(currentSongData._id);
    console.log(selectedPlaylist);
    await axios
      .post(
        `/api/playlists/${selectedPlaylist}/add`,
        { songId: currentSongData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        notification.success("Success", "Songs Added !");
        onClose();
      })
      .catch((err) => notification.error("Error !", err.message));
  };

  return (
    <>
      {currentSongData && (
        <div className="flex items-center justify-center bg-red-lightest w-full max-w-full">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-full">
            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={`${axios.defaults.baseURL}${currentSongData.url}`}
              hidden
            />

            <div className="flex">
              <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded">
                <Card
                  className="max-w-full w-full m-4"
                  style={{
                    boxShadow: "0 0 15px 4px rgba(255, 165, 0, 0.5)",
                    border: "none",
                  }}
                >
                  <CardBody>
                    <Image
                      src={currentSongData.poster}
                      alt={currentSongData.title}
                      borderRadius="lg"
                      className="max-w-full w-full"
                    />
                  </CardBody>
                </Card>
              </div>

              <div className="w-full p-8 mx-2">
                <div className="flex justify-between">
                  <div>
                    <Text
                      fontSize={{ base: "25px", lg: "35px" }}
                      color="musiq.orange"
                    >
                      {currentSongData.title}
                    </Text>
                    <Text fontSize={{ base: "l", sm: "xl" }} color="musiq.dark">
                      {currentSongData.album}
                    </Text>
                  </div>
                  <div className="flex gap-4">
                    <div
                      className="text-green-500 text-3xl cursor-pointer"
                      onClick={handleAddToPlaylist}
                    >
                      <CgPlayListAdd />
                    </div>
                    <div
                      className={`${
                        currentSongData.isFavourite
                          ? "text-red-500"
                          : "text-black"
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavourites();
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex justify-around items-center mt-8">
                  {/* Shuffle
                  <div className="text-grey-darker cursor-pointer">
                    <div className="text-grey-darker cursor-pointer">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.59 12.83L4.4 15c-.58.58-1.59 1-2.4 1H0v-2h2c.29 0 .8-.2 1-.41l2.17-2.18 1.42 1.42zM16 4V1l4 4-4 4V6h-2c-.29 0-.8.2-1 .41l-2.17 2.18L9.4 7.17 11.6 5c.58-.58 1.59-1 2.41-1h2zm0 10v-3l4 4-4 4v-3h-2c-.82 0-1.83-.42-2.41-1l-8.6-8.59C2.8 6.21 2.3 6 2 6H0V4h2c.82 0 1.83.42 2.41 1l8.6 8.59c.2.2.7.41.99.41h2z" />
                      </svg>
                    </div>
                  </div> */}
                  {/* Previous */}
                  <div
                    className="text-grey-darker cursor-pointer"
                    onClick={handlePrevious}
                  >
                    <div className="text-grey-darker cursor-pointer">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 5h3v10H4V5zm12 0v10l-9-5 9-5z" />
                      </svg>
                    </div>
                  </div>
                  {/* Play/Pause */}
                  <div
                    onClick={togglePlay}
                    className="p-8 rounded-full bg-orange-400 shadow-lg cursor-pointer text-white"
                  >
                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                  </div>
                  {/* Next */}
                  <div
                    className="text-grey-darker cursor-pointer"
                    onClick={handleNext}
                  >
                    <div className="text-grey-darker cursor-pointer">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 5h3v10h-3V5zM4 5l9 5-9 5V5z" />
                      </svg>
                    </div>
                  </div>
                  {/* Repeat
                  <div className="text-grey-darker cursor-pointer">
                    <div className="text-grey-darker cursor-pointer">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 4a2 2 0 0 0-2 2v6H0l4 4 4-4H5V6h7l2-2H5zm10 4h-3l4-4 4 4h-3v6a2 2 0 0 1-2 2H6l2-2h7V8z" />
                      </svg>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="mx-8 py-4">
              <div className="flex justify-between text-sm text-grey-darker items-center">
                <p>{formatTime(currentTime)}</p>

                <Slider
                  aria-label="song-progress"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSliderChange}
                  className="mx-4"
                >
                  <SliderTrack bg="red.100">
                    <SliderFilledTrack bg="tomato" />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Box color="tomato" as={MdGraphicEq} />
                  </SliderThumb>
                </Slider>

                <p>{formatTime(duration)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <>
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select a Playlist</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="mb-4">
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Playlist Name..."
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    value={newPlaylistName}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      color="musiq.dark"
                      bg="musiq.skin"
                      onClick={handleCreatePlaylist}
                    >
                      Create
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </div>
              {userPlaylist && userPlaylist.length > 0 ? (
                <AddPlaylist
                  allPlaylist={userPlaylist}
                  selectedPlaylist={selectedPlaylist}
                  setSelectedPlaylist={setSelectedPlaylist}
                />
              ) : (
                "No Playlist Available"
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                background="musiq.orange"
                color="musiq.dark"
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                bg="musiq.dark"
                color="musiq.light"
                _hover={{ color: "musiq.dark", bg: "musiq.light" }}
                onClick={AddSong}
              >
                Add Song
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
}

const AddPlaylist = ({
  allPlaylist,
  selectedPlaylist,
  setSelectedPlaylist,
}) => {
  return (
    <>
      <RadioGroup onChange={setSelectedPlaylist} value={selectedPlaylist}>
        <Stack spacing={5} direction="column">
          {allPlaylist &&
            allPlaylist.map((item) => {
              return (
                <Radio colorScheme="red" value={item._id}>
                  {item.name}
                </Radio>
              );
            })}
        </Stack>
      </RadioGroup>
    </>
  );
};

export default MusicPlayer;
