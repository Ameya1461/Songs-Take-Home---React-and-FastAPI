import { useMemo } from "react";
import type { Song } from "../types/Song";
import "../App.css";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ChartsProps {
  songs: Song[];
  onBack: () => void;
}

function Charts({ songs, onBack }: ChartsProps) {
  const scatterData = songs.map((song) => ({
    x: song.danceability,
    y: song.tempo,
    title: song.title,
  }));

  const durationBins = useMemo(() => {
    const durations = songs.map((s) => s.duration_ms / 1000);
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    const binCount = 10;
    const binSize = (max - min) / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${Math.floor(min + i * binSize)}-${Math.floor(
        min + (i + 1) * binSize
      )}`,
      count: 0,
    }));

    durations.forEach((duration) => {
      const binIndex = Math.min(
        Math.floor((duration - min) / binSize),
        binCount - 1
      );
      bins[binIndex].count++;
    });

    return bins;
  }, [songs]);

  const barChartData = songs.slice(0, 20).map((song) => ({
    title: song.title.substring(0, 20),
    acousticness: song.acousticness,
    tempo: song.tempo / 100,
  }));

  return (
    <div className="container">
      <header className="header">
        <h1>Music Dashboard - Charts</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onBack} className="btn-secondary">
            Back to Songs
          </button>
        </div>
      </header>

      <div className="charts-section">
        <h2>Visualizations</h2>

        <div className="chart-container">
          <h3>Danceability vs Tempo (Scatter Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Danceability" />
              <YAxis type="number" dataKey="y" name="Tempo" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter dataKey="y" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Song Duration Distribution (Histogram)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationBins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Acousticness and Tempo (Bar Chart - First 20 Songs)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="title"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="acousticness"
                fill="#8884d8"
                name="Acousticness"
              />
              <Bar
                yAxisId="right"
                dataKey="tempo"
                fill="#82ca9d"
                name="Tempo (scaled)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;
