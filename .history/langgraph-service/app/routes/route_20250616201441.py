from fastapi import APIRouter, Request, HTTPException
import requests
import os

router = APIRouter()

@router.post('/api/route')
async def get_route(request: Request):
    body = await request.json()
    coordinates = body.get('coordinates')
    if not coordinates or len(coordinates) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 coordinates")
    api_key = os.getenv('VITE_OPENROUTE_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTE_API_KEY not set")
    url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }    try:
        resp = requests.post(url, headers=headers, json={'coordinates': coordinates}, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        # Fallback: return a simple straight line route if OpenRouteService fails
        print(f"OpenRouteService failed: {e}")
        return {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            }]
        }