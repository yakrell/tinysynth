/* @flow */
import type { Track, Beats, EncodedTrack } from "./types";

import samples from "./samples.json";


const bassNotes = "A1,C2,D2,E2,G2,A2,C3,D3,E3,G3,A3".split(",");

export function initTracks(): Track[] {
  return [
    {id: 1, type: "drum", name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)},
    {id: 2, type: "drum", name: "hihat-plain", vol: .4, muted: false, beats: initBeats(16)},
    {id: 3, type: "drum", name: "snare-vinyl01", vol: .9, muted: false, beats: initBeats(16)},
    {id: 4, type: "drum", name: "kick-electro01", vol: .8, muted: false, beats: initBeats(16)},
    {id: 5, type: "bass", name: "bass", vol: .3, muted: false, beats: initBeats(16)},
  ];
}

export function initBeats(n: number): Beats {
  return new Array(n).fill(null);
}

function defaultBeat(note: ?string) {
  return {note: note || "A4", vol: 1, dur: "4n"};
}

export function getBassNotes(): string[] {
  return bassNotes;
}

export function addTrack(tracks: Track[]) {
  const id = Math.max.apply(null, tracks.map(t => t.id)) + 1;
  return [
    ...tracks, {
      id,
      name: "kick-electro01",
      vol: .8,
      muted: false,
      beats: initBeats(16),
    }
  ];
}

export function clearTrack(tracks: Track[], id: number): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, beats: initBeats(16)};
    }
  });
}

export function deleteTracks(tracks: Track[], id: number): Track[] {
  return tracks.filter((track) => track.id !== id);
}

export function toggleTrackBeat(tracks: Track[], id: number, index: number, note: string): Track[] {
  console.log(note);
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {
        ...track,
        beats: track.beats.map((beat, i) => {
          return i !== index ? beat : beat == null ? defaultBeat(note) : null;
        })
      };
    }
  });
}

export function setTrackVolume(tracks: Track[], id: number, vol: number): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, vol};
    }
  });
}

export function muteTrack(tracks: Track[], id: number): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, muted: !track.muted};
    }
  });
}

export function updateTrackSample(tracks: Track[], id: number, sample: string): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, name: sample};
    }
  });
}

function encodeBeats(beats: Beats): string {
  return beats.map(beat => beat ? "1" : "0").join("");
}

function decodeBeats(encodedBeats: string): Beats {
  return encodedBeats.split("").map(beat => beat === "1");
}

export function encodeTracks(tracks: Track[]): EncodedTrack[] {
  return tracks.map(({beats, ...track}) => {
    return {...track, beats: encodeBeats(beats)};
  });
}

export function decodeTracks(encodedTracks: EncodedTrack[]): Track[] {
  return encodedTracks.map(({beats, ...encodedTrack}) => {
    return {...encodedTrack, beats: decodeBeats(beats)};
  });
}

export function randomTracks(): Track[] {
  const nT = Math.floor(3 + (Math.random() * 10));
  const drumTracks = new Array(nT).fill().map((_, i) => {
    return {
      id: i + 1,
      type: "drum",
      name: samples[Math.floor(Math.random() * samples.length)],
      vol: Math.random(),
      muted: false,
      beats: initBeats(16).map(_ => Math.random() > .75 ? {
        note: "A4",
        vol: 1,
        dur: "4n",
      } : null),
    }
  });
  const bassTrack = {
    id: nT + 1,
    type: "bass",
    name: "bassline",
    vol: Math.random(),
    muted: false,
    beats: initBeats(16).map(_ => Math.random() > .2 ? {
      note: bassNotes[Math.floor(Math.random() * bassNotes.length)],
      vol: 1,
      dur: "4n",
    } : null),
  };
  return [...drumTracks, bassTrack];
}

export function randomSong(): {bpm: number, tracks: Track[]} {
  return {
    bpm: Math.floor(Math.random() * 75) + 75,
    tracks: randomTracks(),
  };
}
