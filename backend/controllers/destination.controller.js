import { getDestinationInfo } from '../services/destinationService.js';

export const getDestination = async (req, res) => {
  try {
    const { placeName, type = "thành phố" } = req.body;
    
    if (!placeName) {
      return res.status(400).json({ 
        message: "placeName parameter is required" 
      });
    }

    console.log(`🔍 Getting destination info for: "${placeName}" (${type})`);
    
    const destinationInfo = await getDestinationInfo(placeName, type);
    
    if (!destinationInfo) {
      return res.status(404).json({ 
        message: "Could not get destination information" 
      });
    }

    console.log(`✅ Destination info retrieved:`, destinationInfo);
    
    res.status(200).json({
      success: true,
      data: destinationInfo
    });
    
  } catch (error) {
    console.error('❌ Error in getDestination:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
}; 