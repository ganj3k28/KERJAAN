import React from 'react';
import { VideoItem } from '../types';

interface VideoSectionProps {
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos, onPlayVideo }) => {
  const currentVideo = videos[0] || {
    id: 'vid-default',
    title: 'Saat Pendidikan Menjadi Bekal Ketahanan Iklim',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
  };

  return (
    <section className="section-block">
      <div className="section-header">
        <h3>Video</h3>
        <a href="#video" className="see-all">
          Lihat semua ›
        </a>
      </div>
      <div
        className="video-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onPlayVideo(currentVideo)}
      >
        <img src={currentVideo.thumbnailUrl} alt={currentVideo.title} />
        <div className="play-icon">&#9654;</div>
      </div>
      <div className="video-title">{currentVideo.title}</div>
    </section>
  );
};
