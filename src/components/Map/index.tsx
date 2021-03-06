import { useRouter } from 'next/router';
import { MapConsumer, MapContainer, Marker, TileLayer } from 'react-leaflet';

import * as S from './styles';

export type MapProps = {
  places?: PlaceType[];
};

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
const MAPBOX_USER_ID = process.env.NEXT_PUBLIC_MAPBOX_USER_ID;
const MAPBOX_STYLE_ID = process.env.NEXT_PUBLIC_MAPBOX_STYLE_ID;

function CustomTileLayer() {
  if (!MAPBOX_API_KEY) {
    return (
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    );
  }

  return (
    <TileLayer
      attribution='© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url={`https://api.mapbox.com/styles/v1/${MAPBOX_USER_ID}/${MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`}
    />
  );
}

export function Map({ places = [] }: MapProps) {
  const router = useRouter();

  return (
    <S.MapWrapper>
      <MapContainer
        center={[0, -40]}
        minZoom={3}
        zoom={3}
        maxBounds={[
          [-180, 180],
          [180, -180],
        ]}
        style={{ height: '100%', width: '100%' }}
      >
        <MapConsumer>
          {(map) => {
            const width =
              window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth;

            if (width < 768) {
              map.setMinZoom(2);
            }

            return null;
          }}
        </MapConsumer>

        <CustomTileLayer />

        {places.map(({ id, name, slug, location }) => (
          <Marker
            key={id}
            position={[location.latitude, location.longitude]}
            title={name}
            eventHandlers={{ click: () => router.push(`/place/${slug}`) }}
          />
        ))}
      </MapContainer>
    </S.MapWrapper>
  );
}

export default Map;
