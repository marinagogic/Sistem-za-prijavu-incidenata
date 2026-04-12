package org.unibl.etf.pisio.alertservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.pisio.alertservice.model.AlertRuleSettings;

public interface AlertRuleSettingsRepository extends JpaRepository<AlertRuleSettings, Integer> {
}