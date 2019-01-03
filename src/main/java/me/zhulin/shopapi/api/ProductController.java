package me.zhulin.shopapi.api;

import me.zhulin.shopapi.entity.ProductInfo;
import me.zhulin.shopapi.enums.ProductStatusEnum;
import me.zhulin.shopapi.service.CategoryService;
import me.zhulin.shopapi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Map;

/**
 * Created By Zhu Lin on 3/10/2018.
 */
@CrossOrigin
@RestController
public class ProductController {
    @Autowired
    CategoryService categoryService;
    @Autowired
    ProductService productService;

    /**
     * Show All Categories
     */

    @GetMapping("/product")
    public Page<ProductInfo> findAll(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                     @RequestParam(value = "size", defaultValue = "3") Integer size) {
        PageRequest request = PageRequest.of(page - 1, size);
        return productService.findAll(request);
    }

    @GetMapping("/product/{productId}")
    public ProductInfo showOne(@PathVariable("productId") String productId, Model model) {

        ProductInfo productInfo = productService.findOne(productId);

        // Product is not available
        if (productInfo.getProductStatus().equals(ProductStatusEnum.DOWN.getCode())) {
            productInfo = null;
        }

        return productInfo;
    }
//
//    /**
//     * Seller
//     */
//
//    @GetMapping({"/seller", "seller/product"})
//    public ModelAndView sellerFindAll(@RequestParam(value = "page", defaultValue = "1") Integer page,
//                                      @RequestParam(value = "size", defaultValue = "5") Integer size) {
//        PageRequest request = PageRequest.of(page - 1, size);
//        Page<ProductInfo> products = productService.findAll(request);
//        map.put("products", products);
//        map.put("statusArray", new String[]{"Available", "Unavailable"});
//        map.put("categoryArray", new String[]{"Books", "Food", "Clothes", "Drink"});
//        map.put("currentPage", page);
//        map.put("size", size);
//        return new ModelAndView("/product/sellerIndex", map);
//    }
//
//    @PostMapping("/seller/product/new")
//    public String create(
//            @RequestParam("categoryType") Integer categoryType,
//            @RequestParam("productStatus") Integer productStatus,
//            @Valid @ModelAttribute("product") ProductInfo product,
//            RedirectAttributes redirectAttributes,
//            BindingResult bindingResult, Model model) {
//        ProductInfo productIdExists = productService.findOne(product.getProductId());
//        if (productIdExists != null) {
//            bindingResult
//                    .rejectValue("productId", "error.product",
//                            "There is already a product with the code provided");
//        }
//        // 使用BindingResult来验证表单数据的正确性
//        if (bindingResult.hasErrors()) {
//            // 将提交的表单内容原封不动的返回到页面再展示出来
//            redirectAttributes.addFlashAttribute("product", product);
//            return "product/sellerCreate";
//        }
//        product.setProductStatus(productStatus);
//        product.setCategoryType(categoryType);
//        productService.save(product);
//        return "redirect:" + "/";
//    }
//
//    @GetMapping("/seller/product/new")
//    public String createForm(ProductInfo product,
//                             Model model) {
//
//        model.addAttribute("product", product);
//        return "product/sellerCreate";
//    }
//
//    @GetMapping("/seller/product/{id}/edit")
//    public String productEdit(@PathVariable("id") String productId,
//                              Model model) {
//        ProductInfo product = productService.findOne(productId);
//        model.addAttribute("product", product);
//
//        return "product/sellerEdit";
//    }
//
//    @PostMapping("/seller/product/{id}/edit")
//    public String edit(@PathVariable("id") String productId,
//                       @RequestParam("categoryType") Integer categoryType,
//                       @RequestParam("productStatus") Integer productStatus,
//                       @Valid @ModelAttribute("product") ProductInfo product,
//                       RedirectAttributes redirectAttributes,
//                       BindingResult bindingResult, Model model) {
//
//        // 使用BindingResult来验证表单数据的正确性
//        if (bindingResult.hasErrors()) {
//            // 将提交的表单内容原封不动的返回到页面再展示出来
//            redirectAttributes.addFlashAttribute("product", product);
//            return "/seller/product/" + productId + "/edit";
//
//        }
//        if (!productId.equals(product.getProductId())) {
//            model.addAttribute("msg", "Product id is not consistent!");
//            model.addAttribute("url", "/");
//            return "common/error";
//        }
//        product.setCategoryType(categoryType);
//        product.setProductStatus(productStatus);
//        productService.update(product);
//        return "redirect:" + "/";
//    }
//
//    @GetMapping("/seller/product/{id}/delete")
//    public String delete(@PathVariable("id") String productId) {
//        productService.delete(productId);
//        return "redirect:" + "/";
//    }

}
