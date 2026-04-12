package org.unibl.etf.pisio.alertservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.pisio.alertservice.model.ModeratorAlertStatus;

public interface ModeratorAlertStatusRepository extends JpaRepository<ModeratorAlertStatus, Long> {

    boolean existsByModeratorIdAndAlertId(Long moderatorId, Long alertId);

    long countByModeratorId(Long moderatorId);
}