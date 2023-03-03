import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";




// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let cartItem = [];
  for (let i = 0; i < cartData.length; i++) {
    productsData.map((item) => {
      if (cartData[i].productId === item._id) {
        cartItem.push({
          name: item.name,
          qty: cartData[i].qty,
          category: item.category,
          cost: item.cost,
          rating: item.rating,
          image: item.image,
          productId: item._id,
        });
      } return null;
    });
  } 

  return cartItem;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  items.forEach((item) =>{
    total += item.cost * item.qty;
  });
  return total;
};

export const getTotalItems = (items = []) => {
  let total = 0;
  items.forEach((item) =>{
    total += item.qty;
  });
  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  if (!isReadOnly) {
    return (
      <>
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
      
      </>
    );
  } else {
    return (
      <h4>Qty:{value}</h4>    
    )
  }
  
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {

  const history = useHistory();
  const handleCheckout = () => {
  history.push("/checkout");
  
  };

  

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart" sx={{ bgcolor: "#ffffff" }}>
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        <>
        {items.map((item) => (
          <Box display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
              <img
                // Add product image
                src={item.image}
                // Add product name as alt eext
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                
                {isReadOnly ? (
                    <ItemQuantity
                      value={item.qty}
                      qty={item.qty}
                      isReadOnly
                    />
                  ) : (
                    <ItemQuantity
                      // Add required props by checking implementation
                      value={item.qty}
                      products={products}
                      items={items}
                      productId={item.productId}
                      handleAdd={() => {
                        handleQuantity(
                          item.productId,
                          item.qty + 1
                        );
                      }}
                      handleDelete={() => {
                        handleQuantity(
                          item.productId,
                          item.qty - 1
                        );
                      }}
                    />
                  )}
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        </>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleCheckout}
            className="checkout-btn"
          >
            Checkout
          </Button>
        </Box>
        )}
        
      </Box>
      {isReadOnly && (
        // items.map((item) => (
          <Box className="cart" sx={{ bgcolor: "#ffffff" }} px={2}>
            <Stack direction="column">
            <h2>Order Details</h2>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <p>Products</p>
              <p>{getTotalItems(items)}
              
              </p>
              </Box>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <p>Subtotal</p>
              <p>${getTotalCartValue(items)}</p>
              </Box>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <p>Shipping Charges</p>
              <p>$0</p>
              </Box>
              <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <h3>Total</h3>
              <h3>${getTotalCartValue(items)}</h3>
              </Box>
            </Stack>
      </Box>
        // ))
        
      )}
      
    </>
  );
};

export default Cart;
