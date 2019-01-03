package me.zhulin.shopapi.api;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;

/**
 * Created By Zhu Lin on 3/12/2018.
 */
@Controller
public class MyErrorController implements ErrorController {

    private final static String ERROR_PATH = "/error";

//    @GetMapping(ERROR_PATH)
//    public String error(Model model) {
//        model.addAttribute("msg", "Unknown Error!");
//        return "/common/error";
//    }

    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }
}
