package me.zhulin.shopapi.service;

import me.zhulin.shopapi.dto.Item;
import me.zhulin.shopapi.entity.User;
import me.zhulin.shopapi.form.ItemForm;

import java.math.BigDecimal;
import java.util.Collection;

/**
 * Created By Zhu Lin on 3/10/2018.
 */
public interface CartService {
    void addItem(ItemForm itemForm);
    void removeItem(String productId);
    void updateQuantity(String productId, Integer quantity);

    Collection<Item> findAll();

    void  checkout(User user);

    BigDecimal getTotal();

    void mergeLocalCart(Collection<Item> items, User user);

}
