import { useCallback, useEffect, useRef, useState } from 'react';

import { CodeIcon, RouteIcon } from 'lucide-react';

import { createLog } from '@helpers/log';

import { renderFeatureCollection } from './components/canvas';
import { LayerToggles } from './components/layer-toggles';
import { data as initialData } from './data';
import { useDimensions } from './hooks/use-dimensions';
import { useScenario } from './hooks/use-scenario';

const log = createLog('RouteMap');

export interface RouteMapProps {
  scenarioId: string;
}

export const RouteMap = ({ scenarioId }: RouteMapProps) => {
  const { containerRef, dimensions } = useDimensions();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTextView, setIsTextView] = useState(false);
  const [textValue, setTextValue] = useState(() =>
    JSON.stringify(initialData, null, 2)
  );
  const [error, setError] = useState<string | null>(null);

  const {
    bbox: scenarioBbox,
    error: scenarioError,
    featureCollections: scenarioFeatureCollections,
    gpsFC,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useScenario(scenarioId);

  // log.debug('scenarioFeatureCollections', scenarioFeatureCollections);
  // log.debug('gpsFC', gpsFC);
  const gpsStr = gpsFC ? gpsFC.bbox?.join(',') : '';

  const [selectedFeatureCollections, setSelectedFeatureCollections] = useState<
    number[]
  >(Array.from({ length: scenarioFeatureCollections.length }, (_, i) => i));

  const handleFeatureCollectionChange = (index: number) => {
    setSelectedFeatureCollections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  useEffect(() => {
    setTextValue(JSON.stringify(gpsFC, null, 2));

    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsStr]);

  // Handle text changes and validate JSON
  const handleTextChange = (text: string) => {
    setTextValue(text);
    try {
      const parsed = JSON.parse(text);
      if (parsed?.features?.length >= 0) {
        // Basic validation that it's a FeatureCollection
        // setFeatureData(parsed);
        setError(null);
      } else {
        setError('Invalid FeatureCollection format');
      }
    } catch {
      setError('Invalid JSON format');
    }
  };

  // Render canvas effect
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scenarioFeatureCollections?.length) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ii = 0; ii < scenarioFeatureCollections.length; ii++) {
      const featureCollection = scenarioFeatureCollections[ii];
      if (!featureCollection || !selectedFeatureCollections.includes(ii)) {
        continue;
      }

      // console.debug('rendering featureCollection', featureCollection);
      renderFeatureCollection({
        bbox: scenarioBbox,
        canvas,
        ctx,
        featureCollection
      });
    }
  }, [scenarioFeatureCollections, scenarioBbox, selectedFeatureCollections]);

  // Call renderCanvas whenever dimensions, featureData changes or view toggles
  useEffect(() => {
    if (!isTextView && dimensions.width > 0 && dimensions.height > 0) {
      renderCanvas();
    }
  }, [isTextView, dimensions, renderCanvas]);

  const errorMessage = scenarioError ? scenarioError : error;

  return (
    <div
      className="relative h-[768px] w-[768px] bg-slate-400"
      ref={containerRef}
    >
      <button
        className="absolute top-2 right-2 z-10 rounded bg-white px-2 py-1 text-black shadow hover:bg-gray-100"
        onClick={() => setIsTextView(!isTextView)}
      >
        {isTextView ? (
          <RouteIcon className="h-4 w-4" />
        ) : (
          <CodeIcon className="h-4 w-4" />
        )}
      </button>

      <LayerToggles
        featureCollections={scenarioFeatureCollections}
        onChange={handleFeatureCollectionChange}
        selected={selectedFeatureCollections}
      />

      <div className="pointer-events-none absolute flex h-100 w-full items-center justify-center text-red-500">
        {errorMessage}
      </div>

      {isTextView ? (
        <div className="h-full w-full p-4">
          <textarea
            className="h-full w-full resize-none p-2 font-mono text-xs"
            onChange={e => handleTextChange(e.target.value)}
            spellCheck={false}
            value={textValue}
          />
          {error && (
            <div className="absolute right-2 bottom-2 left-2 rounded bg-red-100 px-2 py-1 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      ) : (
        <canvas
          className="h-full w-full"
          height={dimensions.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={canvasRef}
          style={{
            height: dimensions.height / (window.devicePixelRatio || 1),
            width: dimensions.width / (window.devicePixelRatio || 1)
          }}
          width={dimensions.width}
        />
      )}
    </div>
  );
};
