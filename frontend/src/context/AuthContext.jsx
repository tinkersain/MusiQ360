import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { FetchSongPosterUrl } from "../utils/FetchSongPosterUrl";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [token, setToken] = useState(localStorage.getItem("eventToken"));
  const [currentSongData, setCurrentSongData] = useState();
  const [songList, setSongList] = useState([]);

  function login(data) {
    setName(data.name);
    setToken(data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("eventToken", data.token);
  }

  function logout() {
    setName(null);
    setToken(null);
    localStorage.removeItem("name");
    localStorage.removeItem("eventToken");
  }

  async function refreshCurrentSong(id) {
    try {
      const res = await axios.get(`/api/songs/${id}`);
      const song = res.data;
      const poster = await FetchSongPosterUrl(song.title);
      setCurrentSongData({ ...song, poster });
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
        login,
        logout,
        refreshCurrentSong,
        setSongList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
