export const getRoute = async (locations) => {
  // Chuyển đổi sang [lng, lat] đúng chuẩn OpenRouteService
  const coordinates = locations.map(loc => [loc.lng, loc.lat]);
  const response = await fetch('http://localhost:8000/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coordinates })
  });
  if (!response.ok) throw new Error('Failed to fetch route');
  const data = await response.json();
  // Trả về mảng [lat, lng] cho Polyline
  return data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
};