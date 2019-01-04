package me.zhulin.shopapi.api;


import me.zhulin.shopapi.entity.OrderMain;
import me.zhulin.shopapi.entity.ProductInOrder;
import me.zhulin.shopapi.service.OrderService;
import me.zhulin.shopapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * Created By Zhu Lin on 3/14/2018.
 */
@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    OrderService orderService;
    @Autowired
    UserService userService;

    @GetMapping("/order")
    public Page<OrderMain> OrderList(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                     @RequestParam(value = "size", defaultValue = "10") Integer size,
                                     Authentication authentication) {
        PageRequest request = PageRequest.of(page - 1, size);
        Page<OrderMain> orderPage;
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))) {
            orderPage = orderService.findByBuyerEmail(authentication.getName(), request);
        } else {
            orderPage = orderService.findAll(request);
        }
        return orderPage;
    }


    @PutMapping("/order/cancel/{id}")
    public ResponseEntity cancel(@PathVariable("id") Long orderId, Authentication authentication) {
        OrderMain orderMain = orderService.findOne(orderId);
        if (authentication.getName() != orderMain.getBuyerEmail() && authentication.getAuthorities().contains("ROLE_CUSTOMER")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        orderService.cancel(orderId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order/finish/{id}")
    public ResponseEntity finish(@PathVariable("id") Long orderId) {
        orderService.finish(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/order/show/{id}")
    public ResponseEntity<Collection<ProductInOrder>> show(@PathVariable("id") Long orderId, Authentication authentication) {
        boolean isCustomer = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        OrderMain orderMain = orderService.findOne(orderId);
        if (isCustomer && !userDetails.getUsername().equals(orderMain.getBuyerEmail())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Collection<ProductInOrder> items = orderMain.getProducts();
        return ResponseEntity.ok(items);
    }
}
