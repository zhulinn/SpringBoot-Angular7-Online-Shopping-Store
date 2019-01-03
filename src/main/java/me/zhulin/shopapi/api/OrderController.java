//package me.zhulin.shopapi.api;
//
//
//import me.zhulin.shopapi.entity.OrderMain;
//import me.zhulin.shopapi.entity.ProductInOrder;
//import me.zhulin.shopapi.service.OrderService;
//import me.zhulin.shopapi.service.UserService;
//import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import java.util.Collection;
//
///**
// * Created By Zhu Lin on 3/14/2018.
// */
//@Controller
//public class OrderController {
//    @Autowired
//    OrderService orderService;
//    @Autowired
//    UserService userService;
//
//    @GetMapping("/order")
//    public String OrderList(@RequestParam(value = "page", defaultValue = "1") Integer page,
//                            @RequestParam(value = "size", defaultValue = "10") Integer size,
//                            Authentication authentication,
//                            Model model) {
//        PageRequest request = PageRequest.of(page - 1, size);
//        Page<OrderMain> orderList;
//        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))) {
//            orderList = orderService.findByBuyerEmail(authentication.getName(), request);
//        } else {
//            orderList = orderService.findAll(request);
//        }
//
//
//        model.addAttribute("currentPage", page);
//        model.addAttribute("size", size);
//        model.addAttribute("statusArray", new String[]{"New", "Finished", "Canceled"});
//        model.addAttribute("orders", orderList);
//        return "/order/index";
//    }
//
//
//    @GetMapping("/order/cancel/{id}")
//    public String cancel(@PathVariable("id") Long orderId, Model model, Authentication authentication) {
//        OrderMain orderMain = orderService.findOne(orderId);
//        if (authentication.getName() != orderMain.getBuyerEmail() && authentication.getAuthorities().contains("ROLE_CUSTOMER")) {
//            return "redirect:" + "/403";
//        }
//        orderService.cancel(orderId);
//        return "redirect:" + "/order";
//    }
//
//    @GetMapping("/order/finish/{id}")
//    public String finish(@PathVariable("id") Long orderId, Model model) {
//        orderService.finish(orderId);
//        return "redirect:" + "/order";
//    }
//
//    @GetMapping("/order/show/{id}")
//    public String show(@PathVariable("id") Long orderId, Model model, Authentication authentication) {
//        boolean isCustomer = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        OrderMain orderMain = orderService.findOne(orderId);
//        if (isCustomer && !userDetails.getUsername().equals(orderMain.getBuyerEmail())) {
//            return "redirect:" + "/403";
//        }
//
//        Collection<ProductInOrder> items = orderMain.getProducts();
//        model.addAttribute("items", items);
//        return "/order/show";
//    }
//}
