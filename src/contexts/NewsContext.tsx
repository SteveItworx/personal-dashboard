import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchNews } from "../services/newsService";

interface NewsContextType {
  news: any[];
  category: string;
  setCategory: (category: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [news, setNews] = useState<any[]>([]);
  const [category, setCategory] = useState("general"); // Default category

  useEffect(() => {
    const loadNews = async () => {
      try {
        const articles = await fetchNews(category);
        setNews(articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    loadNews();
  }, [category]);

  return (
    <NewsContext.Provider value={{ news, category, setCategory }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used within a NewsProvider");
  return context;
};
