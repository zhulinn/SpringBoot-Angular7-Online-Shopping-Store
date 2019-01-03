package me.zhulin.shopapi.api;


import me.zhulin.shopapi.dto.Item;
import me.zhulin.shopapi.entity.Cart;
import me.zhulin.shopapi.entity.ProductInOrder;
import me.zhulin.shopapi.entity.User;
import me.zhulin.shopapi.form.ItemForm;
import me.zhulin.shopapi.repository.ProductInOrderRepository;
import me.zhulin.shopapi.service.CartService;
import me.zhulin.shopapi.service.ProductService;
import me.zhulin.shopapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;
import java.util.Collections;

/**
 * Created By Zhu Lin on 3/11/2018.
 */
@CrossOrigin
@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    CartService cartService;
    @Autowired
    UserService userService;
    @Autowired
    ProductService productService;

    @Autowired
    ProductInOrderRepository productInOrderRepository;

    @PostMapping("")
    public Cart mergeCart(@RequestBody Collection<Item> items, Principal principal) {
        User user = userService.findOne(principal.getName());
        cartService.mergeLocalCart(items, user);
        return user.getCart();
    }

    @PostMapping("/add")
    public boolean mergeCart(@RequestBody ItemForm form, Principal principal) {
        var productInfo = productService.findOne(form.getProductId());
        var item = new Item(productInfo, form.getQuantity());
        try {
            mergeCart(Collections.singleton(item), principal);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @PostMapping("/{itemId}")
    public ProductInOrder modifyItem(@PathVariable("itemId") String itemId, @RequestBody Integer quantity, Principal principal) {
        User user = userService.findOne(principal.getName());
        var op = user.getCart().getProducts().stream().filter(e -> itemId.equals(e.getProductId())).findFirst();
        final ProductInOrder[] res = {null};
        op.ifPresent(productInOrder -> {
            res[0] = productInOrder;
            productInOrder.setCount(quantity);
            productInOrderRepository.save(productInOrder);

        });
        return res[0];
    }

    @DeleteMapping("/{itemId}")
    @Transactional
    public Cart deleteItem(@PathVariable("itemId") String itemId, Principal principal) {
        User user = userService.findOne(principal.getName());
        var op = user.getCart().getProducts().stream().filter(e -> itemId.equals(e.getProductId())).findFirst();
        op.ifPresent(productInOrder -> {
            user.getCart().getProducts().remove(productInOrder);
            userService.save(user);
            productInOrderRepository.deleteById(productInOrder.getId());

        });
        return user.getCart();
    }


    @PostMapping("/checkout")
    public ResponseEntity checkout(Principal principal) {
        User user = userService.findOne(principal.getName());// Email as username
        Cart cart = user.getCart();
        if (cart != null) {
            cart.getProducts().forEach(productInOrder -> {
                productInOrder.setCart(null);
                productInOrderRepository.save(productInOrder);
            });
        }

        return ResponseEntity.ok(null);
    }

    @GetMapping("/remove")
    public String remove(@RequestParam("product_id") String productId) {
        cartService.removeItem(productId);
        return "redirect:" + "/cart";
    }

    @GetMapping("/change")
    public String plus(@RequestParam("product_id") String poductId, @RequestParam("quantity") Integer quantity) {
        cartService.updateQuantity(poductId, quantity);
        return "redirect:" + "/cart";
    }


}
