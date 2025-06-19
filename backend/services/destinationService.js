import axios from 'axios';

export const getWikiThumbnailAndIntro = async (placeName, type) => {
  try {
    const encodedName = encodeURIComponent(placeName.replace(/ /g, '_'));
    const url = `https://vi.wikipedia.org/wiki/${encodedName}`;
    
    const response = await axios.get(url);
    const html = response.data;
    
    // Parse HTML để tìm infobox và ảnh
    const infoboxMatch = html.match(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>([\s\S]*?)<\/table>/);
    if (!infoboxMatch) {
      return { thumbnail: null, intro: "" };
    }
    
    const infoboxHtml = infoboxMatch[1];
    const imgMatches = infoboxHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/g);
    
    let thumbnail = null;
    if (imgMatches && imgMatches.length > 0) {
      // Nếu là tỉnh → ảnh thứ 2, ngược lại → ảnh đầu tiên
      const imgIdx = type && type.toLowerCase() === "tỉnh" ? 1 : 0;
      if (imgMatches[imgIdx]) {
        const srcMatch = imgMatches[imgIdx].match(/src="([^"]*)"/);
        if (srcMatch) {
          thumbnail = "https:" + srcMatch[1];
        }
      }
    }
    
    // Tìm intro text
    const introMatch = html.match(/<p[^>]*>([^<]+)<\/p>/);
    const intro = introMatch ? introMatch[1].trim() : "";
    
    return { thumbnail, intro };
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin Wikipedia:", error);
    return { thumbnail: null, intro: "" };
  }
};

export const getDestinationInfo = async (placeName, type = "thành phố") => {
  try {
    const { thumbnail, intro } = await getWikiThumbnailAndIntro(placeName, type);
    
    return {
      name: placeName,
      type: type,
      thumbnail,
      intro
    };
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin địa danh:", error);
    return null;
  }
}; 