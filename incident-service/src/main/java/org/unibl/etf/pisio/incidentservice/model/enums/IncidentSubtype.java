package org.unibl.etf.pisio.incidentservice.model.enums;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum IncidentSubtype {
    BUILDING_FIRE(IncidentType.FIRE),
    FOREST_FIRE(IncidentType.FIRE),
    VEHICLE_FIRE(IncidentType.FIRE),
    ELECTRICAL_FIRE(IncidentType.FIRE),
    WASTE_FIRE(IncidentType.FIRE),

    RIVER_FLOOD(IncidentType.FLOOD),
    URBAN_FLOOD(IncidentType.FLOOD),
    SEWER_OVERFLOW(IncidentType.FLOOD),
    BASEMENT_FLOOD(IncidentType.FLOOD),

    CAR_ACCIDENT(IncidentType.ACCIDENT),
    BIKE_ACCIDENT(IncidentType.ACCIDENT),
    PEDESTRIAN_ACCIDENT(IncidentType.ACCIDENT),
    WORK_ACCIDENT(IncidentType.ACCIDENT),
    SPORT_ACCIDENT(IncidentType.ACCIDENT),

    ROBBERY(IncidentType.CRIME),
    ASSAULT(IncidentType.CRIME),
    VANDALISM(IncidentType.CRIME),
    BURGLARY(IncidentType.CRIME),
    DRUG_ABUSE(IncidentType.CRIME),
    ILLEGAL_DUMPING(IncidentType.CRIME),

    POWER_OUTAGE(IncidentType.INFRASTRUCTURE),
    WATER_OUTAGE(IncidentType.INFRASTRUCTURE),
    GAS_LEAK(IncidentType.INFRASTRUCTURE),
    ROAD_DAMAGE(IncidentType.INFRASTRUCTURE),
    BROKEN_TRAFFIC_LIGHT(IncidentType.INFRASTRUCTURE),
    BRIDGE_DAMAGE(IncidentType.INFRASTRUCTURE),

    MEDICAL_EMERGENCY(IncidentType.HEALTH),
    EPIDEMIC(IncidentType.HEALTH),
    ANIMAL_ATTACK(IncidentType.HEALTH),
    MISSING_PERSON(IncidentType.HEALTH),

    AIR_POLLUTION(IncidentType.ENVIRONMENT),
    WATER_POLLUTION(IncidentType.ENVIRONMENT),
    NOISE_POLLUTION(IncidentType.ENVIRONMENT),
    ILLEGAL_LOGGING(IncidentType.ENVIRONMENT),
    ANIMAL_CRUELTY(IncidentType.ENVIRONMENT);

    private final IncidentType parentType;

    IncidentSubtype(IncidentType parentType) {
        this.parentType = parentType;
    }

    public IncidentType getParentType() {
        return parentType;
    }

    public static List<IncidentSubtype> getByType(IncidentType type) {
        return Arrays.stream(values())
                .filter(subtype -> subtype.parentType == type)
                .collect(Collectors.toList());
    }
}