package me.zhulin.shopapi;

import me.zhulin.shopapi.service.impl.*;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
        CartServiceImplTest.class,
        CategoryServiceImplTest.class,
        OrderServiceImplTest.class,
        ProductInOrderServiceImplTest.class,
        ProductServiceImplTest.class,
        UserServiceImplTest.class
})
public class ShopApiApplicationTests {

}

