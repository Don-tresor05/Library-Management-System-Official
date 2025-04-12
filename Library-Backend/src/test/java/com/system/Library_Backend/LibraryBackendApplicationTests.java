package com.system.Library_Backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import	(SecurityConfig.class)
class LibraryBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
