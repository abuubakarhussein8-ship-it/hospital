package tz.ac.suza.wt.smchmsapi;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class SmchmsapiApplicationTests {

	@Test
	void applicationClassIsLoadable() {
		assertDoesNotThrow(() -> Class.forName(SmchmsapiApplication.class.getName()));
	}

}
