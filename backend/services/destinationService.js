import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const extractDestinationsFromText = async (inputText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Bạn là trợ lý du lịch thông minh."
        },
        {
          role: "user",
          content: (
            `Đoạn văn: "${inputText}"

` +
            "Hãy xác định tất cả các địa danh xuất hiện trong câu trên (bao gồm điểm xuất phát, điểm đến, điểm dừng nếu có).\n" +
            "Trả về một mảng JSON, mỗi phần tử là object có:\n" +
            "- slug: tên địa danh không dấu, viết liền và chữ thường, ví dụ 'danang', 'myxuyen'.\n" +
            "- name: tên địa danh đầy đủ, có dấu tiếng Việt, ví dụ 'Đà Nẵng', 'Mỹ Xuyên'.\n" +
            "- type: một trong các giá trị 'tỉnh', 'thành phố', 'huyện', 'thị xã', 'quận',... tùy loại địa danh.\n" +
            "Không giải thích, chỉ trả về đúng một mảng JSON hợp lệ duy nhất."
          )
        }
      ]
    });

    const content = response.choices[0].message.content.trim();
    // Tìm mảng JSON đầu tiên trong content
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']') + 1;
    const jsonStr = content.substring(start, end);
    const destArr = JSON.parse(jsonStr);

    // Lấy thumbnail/intro cho từng địa danh
    const results = [];
    for (const dest of destArr) {
      const { thumbnail, intro } = await getWikiThumbnailAndIntro(dest.name, dest.type);
      results.push({ ...dest, thumbnail, intro });
    }
    return results;
  } catch (error) {
    console.error("❌ Lỗi khi extract destinations:", error);
    return [];
  }
};

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