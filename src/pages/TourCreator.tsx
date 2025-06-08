import React, { useState } from 'react';
import PanoramaViewer from '../components/PanoramaViewer';
import Hotspot from '../components/Hotspot';

interface Scene {
  id: string;
  imageUrl: string;
  hotspots: HotspotData[];
}

interface HotspotData {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  targetSceneId?: string;
}

const TourCreator: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const addScene = (imageUrl: string) => {
    const newScene: Scene = {
      id: Date.now().toString(),
      imageUrl,
      hotspots: []
    };
    setScenes([...scenes, newScene]);
    setCurrentScene(newScene.id);
  };

  const addHotspot = (sceneId: string, hotspot: Omit<HotspotData, 'id'>) => {
    setScenes(scenes.map(scene => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          hotspots: [...scene.hotspots, { ...hotspot, id: Date.now().toString() }]
        };
      }
      return scene;
    }));
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Tour Creator</h2>
        <div className="space-y-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Preview Mode' : 'Edit Mode'}
          </button>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Scenes</h3>
            {scenes.map(scene => (
              <div
                key={scene.id}
                className={`p-2 rounded cursor-pointer ${
                  currentScene === scene.id ? 'bg-blue-200' : 'bg-white'
                }`}
                onClick={() => setCurrentScene(scene.id)}
              >
                {scene.imageUrl}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        {currentScene && (
          <PanoramaViewer
            imageUrl={scenes.find(s => s.id === currentScene)?.imageUrl || ''}
          />
        )}
      </div>
    </div>
  );
};

export default TourCreator; 