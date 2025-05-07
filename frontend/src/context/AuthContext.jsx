import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { FetchSongPosterUrl } from "../utils/FetchSongPosterUrl";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [token, setToken] = useState(localStorage.getItem("eventToken"));
  const [currentSongData, setCurrentSongData] = useState();
  const [songList, setSongList] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    async function fetchCurrentUserDetails() {
      try {
        const res = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        setUserDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile during login:", err);
      }
    }

    if (name && token) fetchCurrentUserDetails();
  }, []);

  function refreshUserDetails() {
    if (!token || !name) return;

    return axios
      .get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => console.error("Failed to refresh user:", err));
  }

  async function login(data) {
    setName(data.name);
    setToken(data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("eventToken", data.token);

    try {
      const res = await axios.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      setUserDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile during login:", err);
    }
  }

  function logout() {
    setName(null);
    setToken(null);
    localStorage.removeItem("name");
    localStorage.removeItem("eventToken");
  }

  async function refreshCurrentSong(id, autoPlay = false) {
    try {
      const res = await axios.get(`/api/songs/${id}`);
      const song = res.data;
      const poster = await FetchSongPosterUrl(song.title);

      let isFavourite = false;
      if (
        userDetails &&
        userDetails.favourites &&
        userDetails.favourites.includes(id)
      ) {
        isFavourite = true;
      }

      setCurrentSongData({ ...song, poster, isFavourite });

      if (autoPlay) {
        setShouldAutoPlay(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        name,
        token,
        currentSongData,
        songList,
        userDetails,
        shouldAutoPlay,
        login,
        logout,
        refreshCurrentSong,
        setSongList,
        setCurrentSongData,
        refreshUserDetails,
        setShouldAutoPlay,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
