export interface Song {
  id: number
  song_id: string
  title: string
  danceability: number
  energy: number
  mode: number
  acousticness: number
  tempo: number
  duration_ms: number
  num_sections: number
  num_segments: number
  latest_rating: number | null
}
