package com.digitacourse.api.config;

import com.digitacourse.api.service.DemoDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DemoDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);

    private final DemoDataService demoDataService;

    public DemoDataInitializer(DemoDataService demoDataService) {
        this.demoDataService = demoDataService;
    }

    @Override
    public void run(ApplicationArguments args) {
        demoDataService.ensureDemoAccount();
        log.info("Conta de demonstração disponível em {} (senha: {})",
                DemoDataService.DEMO_EMAIL, DemoDataService.DEMO_PASSWORD);
    }
}
