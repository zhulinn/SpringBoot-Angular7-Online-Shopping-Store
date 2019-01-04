package me.zhulin.shopapi.api;

import me.zhulin.shopapi.service.OrderService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.Assert.*;

/**
 * Created By Zhu Lin on 1/4/2019.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(OrderController.class)
public class OrderControllerTest {

    @Autowired
    private MockMvc mvc;
    @MockBean
    private OrderService orderService;

    @Test
    public void cancel() {

    }

    @Test
    public void finish() {
    }

    @Test
    public void show() {
    }
}
