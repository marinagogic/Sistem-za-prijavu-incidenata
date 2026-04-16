export const translateText = async (text, targetLang = "en") => {
  if (!text || !text.trim()) {
    return "";
  }

  try {
    const response = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=sr|en");

    if (!response.ok) {
      throw new Error("Greška pri prevodu.");
    }

    const data = await response.json();
    return data?.responseData?.translatedText || "";
  } catch (error) {
    console.error("Greška pri prevođenju:", error);
    return "";
  }
};