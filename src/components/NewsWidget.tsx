import { useNews } from "../contexts/NewsContext";
import { Container, Typography, Card, CardContent, CardMedia, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const categories = [
  { label: "General", value: "general" },
  { label: "Business", value: "business" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health", value: "health" },
  { label: "Science", value: "science" },
  { label: "Sports", value: "sports" },
  { label: "Technology", value: "technology" },
];

export default function NewsWidget() {
  const { news, category, setCategory } = useNews();

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ marginTop: 3, textAlign: "center" }}>
        Latest News
      </Typography>

      {/* News Category Selector */}
      <FormControl fullWidth margin="normal">
        <InputLabel variant="filled">News Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* News Articles */}
      {news.slice(0, 3).map((article, index) => (
        <Card key={index} sx={{ display: "flex", marginTop: 2 }}>
          {article.urlToImage && (
            <CardMedia component="img" sx={{ width: 150 }} image={article.urlToImage} alt="News Image" />
          )}
          <CardContent>
            <Typography variant="h6">{article.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {article.description}
            </Typography>
            <Typography variant="body2" sx={{ color: "blue", marginTop: 1 }}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
