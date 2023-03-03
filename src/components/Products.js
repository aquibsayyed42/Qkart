import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productFound, setProductFound] = useState(true);
  const [timeoutDebounce, setTimeoutDebounce] = useState(null);
  const [productsInCart, setProductsInCart] = useState([]);

  const performAPICall = async () => {
    setIsLoading(true);
    await axios
      .get(`${config.endpoint}/products`)
      .then((res) => {
        setProducts(res.data);
      })

      .catch((err) => {
        if (err.response && err.response.status === 500) {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: `error` }
          );
        } else {
          enqueueSnackbar(err.response.data.message, { variant: `error` });
        }
      });
    setIsLoading(false);
  };

  // performAPICall();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    await axios
      .get(`${config.endpoint}/products/search?value=${text}`)
      .then((response) => {
        setProducts(response.data);
        setProductFound(true);
      })

      .catch((err) => {
        if (err.response && err.response.status === 500) {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: `error` }
          );
         } //else {
        //   enqueueSnackbar(err.response.data.message, { variant: `error` });
        // }
        setProductFound(false);
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    let timeOut = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);
    setTimeoutDebounce(timeOut);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchCart(localStorage.getItem("token"));
    }
  }, [products]);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) {
      return {
        success: false,
        message: "Protected route, 0auth2 Bearer token not found",
      };
    }

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        //Update cartItems
        setProductsInCart(generateCartItemsFrom(response.data, products));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let i = 0; i < items.length; i++) {
      if (productId === items[i].productId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      if (!isItemInCart(items, productId)) {
        addProductToCart(productId, qty);
      } else {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
    }
  };
  
  let addProductToCart = async (productId, qty) => {
    try {
      let response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProductsInCart(generateCartItemsFrom(response.data, products));
    } catch (err) {
      if (err.response && err.response.status === 400) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("cant add", {
          variant: "error",
        });
      }
    }
  }

  let handleCart = (productId) => {
    addToCart(localStorage.getItem("token"), productsInCart, products, productId, 1);
  };

  let handleQuantity = (productId, qty) => {
    addProductToCart(productId, qty);
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          onChange={(e) => debounceSearch(e, 500)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e) => debounceSearch(e, 500)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container>
        {localStorage.getItem("username") ? (
          <Grid item md={9} sm={12} className="product-grid" id="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>

            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                height={420}
              >
                <div sx={{ margin: "20 auto", mt: 10 }}>
                  <CircularProgress size={100} sx={{ m: 5 }} />
                  <h2>Loading Products...</h2>
                </div>
              </Box>
            ) : (
              <Grid container spacing={4} my={3} pl={3} pr={3}>
                {productFound ? (
                  products.map((product) => (
                    <Grid item spacing={2} xs={6} md={3}>
                      <ProductCard product={product} 
                      handleAddToCart={(e) => handleCart(product["_id"])}/>
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ margin: "auto", mt: 10 }} height={350}>
                    <SentimentDissatisfied />
                    <h1>No products found</h1>
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        ) : (
          <Grid item sm={12} className="product-grid" id="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>

            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                height={420}
              >
                <div sx={{ margin: "20 auto", mt: 10 }}>
                  <CircularProgress size={100} sx={{ m: 5 }} />
                  <h2>Loading Products...</h2>
                </div>
              </Box>
            ) : (
              <Grid container md={12} spacing={2} my={3} pl={3} pr={3}>
                {productFound ? (
                  products.map((product) => (
                    <Grid item spacing={2} xs={6} md={3}>
                      <ProductCard product={product} 
                      handleAddToCart={(e) => handleCart(product["_id"])}/>
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ margin: "auto", mt: 10 }} height={350}>
                    <SentimentDissatisfied />
                    <h1>No products found</h1>
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        )}
        {localStorage.getItem("username") && (
          <Grid item md={3} sm={12} className="cart-grid">
            <Cart items={productsInCart} products={products} handleQuantity={handleQuantity}/>
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
