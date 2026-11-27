package com.digitacourse.api.web;

import com.digitacourse.api.service.CatalogService;
import com.digitacourse.api.web.dto.CourseView;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CourseView> catalog() {
        return catalogService.getCatalog();
    }
}
