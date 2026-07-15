package tz.ac.suza.wt.smchmsapi.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class AppointmentStatusConstraintFix {

    private final JdbcTemplate jdbcTemplate;

    public AppointmentStatusConstraintFix(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void ensureAppointmentStatusConstraint() {
        // Earlier versions created the status check with different names. Dropping only
        // one known name leaves an old constraint in place and makes every status update fail.
        jdbcTemplate.execute("""
                DO $$
                DECLARE constraint_name text;
                BEGIN
                    FOR constraint_name IN
                        SELECT c.conname
                        FROM pg_constraint c
                        JOIN pg_class t ON t.oid = c.conrelid
                        WHERE t.relname = 'appointments'
                          AND c.contype = 'c'
                          AND pg_get_constraintdef(c.oid) ILIKE '%status%'
                    LOOP
                        EXECUTE format('ALTER TABLE appointments DROP CONSTRAINT %I', constraint_name);
                    END LOOP;
                END $$;
                """);
        jdbcTemplate.execute("""
                ALTER TABLE appointments
                ADD CONSTRAINT appointments_status_check
                CHECK (status IN ('PENDING', 'APPROVED', 'RESCHEDULED', 'REJECTED', 'COMPLETED', 'CANCELLED'))
                """);
    }
}
