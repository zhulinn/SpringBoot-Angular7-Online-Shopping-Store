package me.zhulin.shopapi.service;

import me.zhulin.shopapi.entity.Cart;
import me.zhulin.shopapi.entity.ProductInOrder;
import me.zhulin.shopapi.entity.User;

import java.util.Collection;

/**
 * Created By Zhu Lin on 3/10/2018.
 */
public interface CartService {
    Cart getCart(User user);

    Cart mergeLocalCart(Collection<ProductInOrder> productInOrders, User user);

    Cart delete(String itemId, User user);

    void checkout(User user);
}
