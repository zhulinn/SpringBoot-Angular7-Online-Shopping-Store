package me.zhulin.shopapi.service.impl;

import me.zhulin.shopapi.entity.OrderMain;
import me.zhulin.shopapi.entity.ProductInOrder;
import me.zhulin.shopapi.entity.ProductInfo;
import me.zhulin.shopapi.enums.OrderStatusEnum;
import me.zhulin.shopapi.exception.MyException;
import me.zhulin.shopapi.repository.OrderRepository;
import me.zhulin.shopapi.repository.ProductInfoRepository;
import me.zhulin.shopapi.service.ProductService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductInfoRepository productInfoRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private OrderMain orderMain;

    private ProductInfo productInfo;

    @Before
    public void setUp() {
        orderMain = new OrderMain();
        orderMain.setOrderId(1L);
        orderMain.setOrderStatus(OrderStatusEnum.NEW.getCode());

        ProductInOrder productInOrder = new ProductInOrder();
        productInOrder.setProductId("1");
        productInOrder.setCount(10);

        Set<ProductInOrder> set = new HashSet<>();
        set.add(productInOrder);

        orderMain.setProducts(set);

        productInfo = new ProductInfo();
        productInfo.setProductStock(10);
    }

    @Test
    public void finishSuccessTest() {
        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);

        OrderMain orderMainReturn = orderService.finish(orderMain.getOrderId());

        assertThat(orderMainReturn.getOrderId(), is(orderMain.getOrderId()));
        assertThat(orderMainReturn.getOrderStatus(), is(OrderStatusEnum.FINISHED.getCode()));
    }

    @Test(expected = MyException.class)
    public void finishStatusCanceledTest() {
        orderMain.setOrderStatus(OrderStatusEnum.CANCELED.getCode());

        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);

        OrderMain orderMainReturn = orderService.finish(orderMain.getOrderId());

        assertThat(orderMainReturn.getOrderId(), is(orderMain.getOrderId()));
        assertThat(orderMainReturn.getOrderStatus(), is(OrderStatusEnum.FINISHED.getCode()));
    }

    @Test(expected = MyException.class)
    public void finishStatusFinishedTest() {
        orderMain.setOrderStatus(OrderStatusEnum.FINISHED.getCode());

        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);

        OrderMain orderMainReturn = orderService.finish(orderMain.getOrderId());

        assertThat(orderMainReturn.getOrderId(), is(orderMain.getOrderId()));
        assertThat(orderMainReturn.getOrderStatus(), is(OrderStatusEnum.FINISHED.getCode()));
    }

    @Test
    public void cancelSuccessTest() {
        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);
        when(productInfoRepository.findByProductId(orderMain.getProducts().iterator().next().getProductId())).thenReturn(productInfo);

        OrderMain orderMainReturn = orderService.cancel(orderMain.getOrderId());

        assertThat(orderMainReturn.getOrderId(), is(orderMain.getOrderId()));
        assertThat(orderMainReturn.getOrderStatus(), is(OrderStatusEnum.CANCELED.getCode()));
        assertThat(orderMainReturn.getProducts().iterator().next().getCount(), is(10));
    }

    @Test
    public void cancelNoProduct() {
        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);
        orderMain.setProducts(new HashSet<>());

        OrderMain orderMainReturn = orderService.cancel(orderMain.getOrderId());

        assertThat(orderMainReturn.getOrderId(), is(orderMain.getOrderId()));
        assertThat(orderMainReturn.getOrderStatus(), is(OrderStatusEnum.CANCELED.getCode()));
    }

    @Test(expected = MyException.class)
    public void cancelStatusCanceledTest() {
        orderMain.setOrderStatus(OrderStatusEnum.CANCELED.getCode());

        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);

        orderService.cancel(orderMain.getOrderId());
    }

    @Test(expected = MyException.class)
    public void cancelStatusFinishTest() {
        orderMain.setOrderStatus(OrderStatusEnum.FINISHED.getCode());

        when(orderRepository.findByOrderId(orderMain.getOrderId())).thenReturn(orderMain);

        orderService.cancel(orderMain.getOrderId());
    }
}
