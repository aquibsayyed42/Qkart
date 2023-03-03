import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card" sx={{ width: 1}}>
      <CardMedia
        sx={{ width: 1}}
        component="img"
        aria-label={`${product.rating}stars`}
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          ${product.cost}
        </Typography>
        <Rating
          name="read-only"
          value={product.rating}
        />
        <br />
        <Button variant="contained" sx={{width:1}} onClick={handleAddToCart}><AddShoppingCartOutlined />Add to cart</Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
