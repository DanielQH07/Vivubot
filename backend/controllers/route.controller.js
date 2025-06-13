export const calculateRoute = async (req, res) => {
    try {
        const { coordinates } = req.body;
        
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates. Need at least 2 points.'
            });
        }

        // For now, just return the coordinates as a route
        // In a real implementation, you would use a routing service like OSRM or Google Directions API
        const route = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        };

        res.status(200).json({
            success: true,
            features: [route]
        });
    } catch (error) {
        console.error('Error calculating route:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating route'
        });
    }
}; 