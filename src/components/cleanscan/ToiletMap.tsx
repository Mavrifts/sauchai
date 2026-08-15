import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";

import { STATUS_COLOR, type Facility } from "@/lib/cleanscan";

type Props = {
  facilities: Facility[];
  selectedId: string | null;
  priorityZones: boolean;
  onSelect: (facility: Facility) => void;
};

export default function ToiletMap({ facilities, selectedId, priorityZones, onSelect }: Props) {
  return (
    <MapContainer
      center={[26.865, 75.73]}
      zoom={11}
      zoomControl={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap, &copy; CARTO"
        maxZoom={19}
      />
      {facilities.map((f) => {
        const dimmed = priorityZones && f.status !== "alert";
        const selected = f.id === selectedId;
        return (
          <CircleMarker
            key={f.id}
            center={[f.lat, f.lng]}
            radius={selected ? 9 : 6}
            className="cs-dot"
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              opacity: dimmed ? 0.35 : 1,
              fillColor: STATUS_COLOR[f.status],
              fillOpacity: dimmed ? 0.25 : 1,
            }}
            eventHandlers={{ click: () => onSelect(f) }}
          />
        );
      })}
    </MapContainer>
  );
}
