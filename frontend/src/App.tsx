import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Charts from "./components/Charts";
import type { Song } from "./types/Song";
import "./App.css";

const API_BASE_URL = "http://localhost:8000";

type SortField = keyof Song;
type SortDirection = "asc" | "desc";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState<Song[] | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchAllSongs();
  }, []);

  const fetchAllSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Song[]>(`${API_BASE_URL}/songs`, {
        params: { skip: 0, limit: 1000 },
      });

      setSongs(response.data);
    } catch {
      setError("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTitle.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await axios.get<Song[]>(`${API_BASE_URL}/songs/search`, {
        params: { title: searchTitle },
      });
      setSearchResults(response.data);
      setCurrentPage(1);
    } catch {
      setError("Failed to search songs");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const processedSongs = useMemo(() => {
    const data = searchResults ?? songs;

    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [songs, searchResults, sortField, sortDirection]);

  const paginatedSongs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedSongs.slice(start, start + rowsPerPage);
  }, [processedSongs, currentPage]);

  const totalPages = Math.ceil(processedSongs.length / rowsPerPage);

  const handleRateSong = async (songIndex: number, rating: number) => {
    try {
      await axios.post(`${API_BASE_URL}/rate`, {
        song_index: songIndex,
        rating,
      });

      await fetchAllSongs();
      if (searchResults) handleSearch();
    } catch {
      setError("Failed to update rating");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Index",
      "Song ID",
      "Title",
      "Danceability",
      "Energy",
      "Mode",
      "Acousticness",
      "Tempo",
      "Duration (ms)",
      "Sections",
      "Segments",
      "Rating",
    ];

    const rows = processedSongs.map((song) =>
      [
        song.id,
        song.song_id,
        `"${song.title.replace(/"/g, '""')}"`,
        song.danceability,
        song.energy,
        song.mode,
        song.acousticness,
        song.tempo,
        song.duration_ms,
        song.num_sections,
        song.num_segments,
        song.avg_rating ?? "",
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "songs.csv";
    link.click();
  };

  if (showCharts) {
    return <Charts songs={songs} onBack={() => setShowCharts(false)} />;
  }

  if (loading) return <div className="container">Loading songs...</div>;
  if (error) return <div className="container error">{error}</div>;

  const sortIcon = (field: SortField) =>
    sortField === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="container">
      <header className="header">
        <h1>Music Dashboard</h1>
        <div>
          <button onClick={() => setShowCharts(true)}>Charts</button>
          <button onClick={exportToCSV}>Download CSV</button>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button onClick={handleSearch}>Get Song</button>
        {searchResults && (
          <button
            onClick={() => {
              setSearchResults(null);
              setSearchTitle("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      <table className="songs-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>Index{sortIcon("id")}</th>
            <th onClick={() => handleSort("song_id")}>
              Song ID{sortIcon("song_id")}
            </th>
            <th onClick={() => handleSort("title")}>
              Title{sortIcon("title")}
            </th>
            <th onClick={() => handleSort("danceability")}>
              Danceability{sortIcon("danceability")}
            </th>
            <th onClick={() => handleSort("energy")}>
              Energy{sortIcon("energy")}
            </th>
            <th onClick={() => handleSort("mode")}>Mode{sortIcon("mode")}</th>
            <th onClick={() => handleSort("acousticness")}>
              Acousticness{sortIcon("acousticness")}
            </th>
            <th onClick={() => handleSort("tempo")}>
              Tempo{sortIcon("tempo")}
            </th>
            <th onClick={() => handleSort("duration_ms")}>
              Duration{sortIcon("duration_ms")}
            </th>
            <th onClick={() => handleSort("num_sections")}>
              Sections{sortIcon("num_sections")}
            </th>
            <th onClick={() => handleSort("num_segments")}>
              Segments{sortIcon("num_segments")}
            </th>
            <th onClick={() => handleSort("avg_rating")}>
              Rating{sortIcon("avg_rating")}
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedSongs.map((song) => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.song_id}</td>
              <td>{song.title}</td>
              <td>{song.danceability.toFixed(3)}</td>
              <td>{song.energy.toFixed(3)}</td>
              <td>{song.mode}</td>
              <td>{song.acousticness.toFixed(3)}</td>
              <td>{song.tempo.toFixed(2)}</td>
              <td>{song.duration_ms}</td>
              <td>{song.num_sections}</td>
              <td>{song.num_segments}</td>
              <td>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRateSong(song.id, star)}
                    style={{
                      cursor: "pointer",
                      color:
                        song.avg_rating && star <= song.avg_rating
                          ? "gold"
                          : "gray",
                    }}
                  >
                    ★
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
