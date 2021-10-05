package me.zhulin.shopapi.service.impl;

import me.zhulin.shopapi.entity.ProductCategory;
import me.zhulin.shopapi.exception.MyException;
import me.zhulin.shopapi.repository.ProductCategoryRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class CategoryServiceImplTest {

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @Test
    public void findByCategoryTypeTest() {
        ProductCategory productCategory = new ProductCategory();
        productCategory.setCategoryId(1);

        Mockito.when(productCategoryRepository.findByCategoryType(productCategory.getCategoryId())).thenReturn(productCategory);

        categoryService.findByCategoryType(productCategory.getCategoryId());

        Mockito.verify(productCategoryRepository, Mockito.times(1)).findByCategoryType(productCategory.getCategoryId());
    }

    @Test(expected = MyException.class)
    public void findByCategoryTypeExceptionTest() {
        ProductCategory productCategory = new ProductCategory();
        productCategory.setCategoryId(1);

        Mockito.when(productCategoryRepository.findByCategoryType(productCategory.getCategoryId())).thenReturn(null);

        categoryService.findByCategoryType(productCategory.getCategoryId());
    }
}
