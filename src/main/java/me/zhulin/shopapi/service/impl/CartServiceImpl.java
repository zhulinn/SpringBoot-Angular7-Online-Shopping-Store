package me.zhulin.shopapi.service.impl;


import me.zhulin.shopapi.dto.Item;
import me.zhulin.shopapi.entity.*;
import me.zhulin.shopapi.enums.ProductStatusEnum;
import me.zhulin.shopapi.enums.ResultEnum;
import me.zhulin.shopapi.exception.MyException;
import me.zhulin.shopapi.form.ItemForm;
import me.zhulin.shopapi.repository.CartRepository;
import me.zhulin.shopapi.repository.OrderRepository;
import me.zhulin.shopapi.repository.ProductInOrderRepository;
import me.zhulin.shopapi.repository.UserRepository;
import me.zhulin.shopapi.service.CartService;
import me.zhulin.shopapi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

/**
 * Created By Zhu Lin on 3/11/2018.
 */
@Service
public class CartServiceImpl implements CartService {
    @Autowired
    ProductService productService;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductInOrderRepository productInOrderRepository;
    @Autowired
    CartRepository cartRepository;
    private Map<String, Item> map = new LinkedHashMap<>();

    @Override
    public void addItem(ItemForm itemForm) {
        ProductInfo productInfo = productService.findOne(itemForm.getProductId());

        if (productInfo.getProductStatus() == ProductStatusEnum.DOWN.getCode()) {
            throw new MyException(ResultEnum.PRODUCT_OFF_SALE);
        }

        // Check whether is in the cart
        if (map.containsKey(itemForm.getProductId())) {
            // Update quantity
            Integer old = map.get(itemForm.getProductId()).getQuantity();
            itemForm.setQuantity(old + itemForm.getQuantity());
        }

        map.put(itemForm.getProductId(), new Item(productInfo, itemForm.getQuantity()));
    }

    @Override
    public void removeItem(String productId) {
        if (!map.containsKey(productId)) throw new MyException(ResultEnum.PRODUCT_NOT_IN_CART);
        map.remove(productId);
    }

    @Override
    public void updateQuantity(String productId, Integer quantity) {
        if (!map.containsKey(productId)) throw new MyException(ResultEnum.PRODUCT_NOT_IN_CART);
        Item item = map.get(productId);
        Integer max = item.getProductInfo().getProductStock();
        if (quantity > 0) {
            item.setQuantity(quantity > max ? max : quantity);
        }
    }

    @Override
    public Collection<Item> findAll() {
        return map.values();
    }

    @Override
    @Transactional
    public void checkout(User user) {
        OrderMain orderMain = new OrderMain(user);
        for (String productId : map.keySet()) {
            Item item = map.get(productId);
            ProductInOrder productInOrder = new ProductInOrder(item.getProductInfo(), item.getQuantity());
            productInOrder.setOrderMain(orderMain);
            orderMain.getProducts().add(productInOrder);
            productService.decreaseStock(productId, item.getQuantity());
        }
        orderMain.setOrderAmount(getTotal());
        orderRepository.save(orderMain);
        map.clear();
    }

    @Override
    public BigDecimal getTotal() {
        Collection<Item> items = findAll();
        BigDecimal total = new BigDecimal(0);
        for (Item item : items) {
            BigDecimal price = item.getProductInfo().getProductPrice();
            BigDecimal quantity = new BigDecimal(item.getQuantity());
            total = total.add(price.multiply(quantity));
        }
        return total;
    }

    @Override
    public void mergeLocalCart(Collection<Item> items, User user) {
        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart(user);
        }
        Cart finalCart = cart;
        if (items != null) {
            items.forEach(item -> {
                var productInfo = item.getProductInfo();
                ProductInOrder productInOrder;
                Set<ProductInOrder> set = finalCart.getProducts();
                Optional<ProductInOrder> old = set.stream().filter(e -> e.getProductId().equals(productInfo.getProductId())).findFirst();
                if (old.isPresent()) {
                    productInOrder = old.get();
                    productInOrder.setProductQuantity(item.getQuantity() + old.get().getProductQuantity());
                } else {
                    productInOrder = new ProductInOrder(item.getProductInfo(), item.getQuantity());
                    productInOrder.setCart(finalCart);
                    finalCart.getProducts().add(productInOrder);
                }
                productInOrderRepository.save(productInOrder);
            });
        }

        user.setCart(cart);
        userRepository.save(user);
        cartRepository.save(finalCart);
    }
}
