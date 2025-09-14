# Adaptive E-Bike Controller Specification

## System Overview

An Arduino-based adaptive e-bike controller that learns rider baseline effort and provides intelligent assistance to maintain consistent pedaling feel across varying terrain and load conditions.

## Core Philosophy

- **Baseline Learning**: Establish rider's natural torque/speed curve on flat terrain
- **Effort Normalization**: Maintain consistent pedaling effort regardless of conditions
- **Adaptive Assistance**: Automatically adjust power based on real-time effort deviation
- **Range Optimization**: Minimize battery consumption while maximizing ride quality

## Hardware Requirements

### Motor System
- **Motor Type**: Direct drive hub motor (front wheel)
- **Battery**: 52V 18.5Ah Hailong lithium-ion pack (962Wh capacity)
- **Expected Motor Drag**: 20-50W at typical riding speeds

### Sensors
- **Torque Sensor**: Crank-mounted strain gauge or similar
  - Range: 0-200Nm
  - Resolution: 0.5Nm or better
  - Sample rate: 100Hz minimum
- **Speed Sensor**: Hall effect sensor on wheel
  - Resolution: 1 revolution per pulse minimum
  - Update rate: Real-time
- **Current Sensor**: Bidirectional DC current measurement
  - Range: ±50A
  - Accuracy: ±1A
  - Suggested: ACS712 series or shunt resistor
- **Voltage Monitor**: Battery pack voltage measurement
  - Range: 40-60V
  - Resolution: 0.1V
  - Protection: Voltage divider circuit

### Control Hardware
- **Microcontroller**: Arduino Uno/Nano or similar
- **Motor Controller**: Compatible ESC with PWM control input
- **User Interface**: 
  - Flat terrain learning button
  - Hill assist button
  - Mode selection switch/display
  - Battery level indicator

## Operating Modes

### 1. Learning Mode
**Purpose**: Establish baseline torque/speed curve for flat terrain riding

**Process**:
- User presses "Flat Button" when on known flat terrain
- System continuously samples torque vs speed data
- Builds lookup table: `baseline_torque[speed] = measured_torque`
- Requires data points across speed range (5-30 mph typical)

**Data Collection**:
```
if (flat_button_pressed && speed_stable && conditions_good) {
    baseline_curve[current_speed] = current_torque;
    confidence_level[current_speed] = HIGH;
    learning_progress++;
}
```

### 2. Drag Compensation Mode
**Purpose**: Eliminate motor drag to replicate normal bicycle feel

**Target**: Zero net resistance from motor
**Power Draw**: Minimal (20-50W typical)
**Algorithm**:
```
target_torque = baseline_curve[current_speed];
compensation_power = PID_control(target_torque - measured_torque);
```

### 3. Assist Levels
**Purpose**: Provide consistent effort reduction as percentage of baseline

**Implementation**:
- **Level 1**: 70% of baseline effort (30% assistance)
- **Level 2**: 50% of baseline effort (50% assistance) 
- **Level 3**: 30% of baseline effort (70% assistance)

**Algorithm**:
```
target_torque = baseline_curve[current_speed] * assist_factor;
motor_power = PID_control(target_torque - measured_torque);
```

### 4. Hill Flattening Mode
**Purpose**: Automatic terrain compensation to maintain flat-ground effort

**Trigger**: Manual hill button or automatic detection
**Detection**: `if (measured_torque > baseline_torque[speed] + threshold)`
**Compensation**: Add extra power to return effort to baseline level
**Auto-Release**: When torque/speed ratio returns to baseline range

**Algorithm**:
```
expected_effort = baseline_curve[current_speed];
terrain_difficulty = measured_torque - expected_effort;
if (terrain_difficulty > hill_threshold) {
    extra_assist = terrain_difficulty * hill_flatten_factor;
}
```

### 5. Trailer Compensation Mode
**Purpose**: Compensate for trailer drag using pre-defined load profiles

**Load Profiles**:
- **Empty Trailer**: 1.5x baseline effort
- **Light Load**: 2.0x baseline effort  
- **Medium Load**: 2.5x baseline effort
- **Heavy Load**: 3.0x baseline effort

**User Selection**: Manual profile selection via interface
**Algorithm**: Same as assist levels but with trailer-specific multipliers

## Battery Management

### State of Charge Estimation
**Primary Method**: Coulomb counting (amp-hour integration)
```
amp_hours_used += current_amps * time_delta_hours;
remaining_capacity = 18.5 - amp_hours_used;
state_of_charge = remaining_capacity / 18.5 * 100;
```

**Backup Method**: Load-compensated voltage measurement
**Calibration**: Reset to 100% when charger detected and voltage = 58.8V

### Low Battery Mode
**Trigger**: SOC < 20% (configurable)
**Behavior**: Automatically switch to drag compensation mode only
**Purpose**: Extend range by 50+ miles with minimal battery drain
**User Override**: Allow temporary hill assist with user confirmation

## Control Algorithms

### PID Control Loop
```
error = target_torque - measured_torque;
integral += error * dt;
derivative = (error - previous_error) / dt;
output = Kp * error + Ki * integral + Kd * derivative;
motor_power = constrain(output, 0, max_power);
```

### Data Filtering
- **Torque Sensor**: Moving average filter (5-10 samples)
- **Speed Calculation**: Debounced hall sensor with timeout
- **Current Sensing**: Low-pass filter for noise reduction

### Safety Limits
- **Maximum Motor Power**: 1000W (configurable)
- **Thermal Protection**: Reduce power if controller overheating
- **Voltage Protection**: Shutdown if battery voltage < 42V
- **Sensor Failure**: Fallback to manual control mode

## Performance Specifications

### Range Estimates (52V 18.5Ah = 962Wh)

| Mode | Power Draw | Time | Range @ 15mph |
|------|------------|------|---------------|
| Drag Compensation | 30W | 32 hours | 480 miles |
| Level 1 Assist | 150W | 6.4 hours | 96 miles |
| Level 2 Assist | 300W | 3.2 hours | 48 miles |
| Hill Flattening | Variable | Variable | 200+ miles |

### Response Times
- **Torque Sampling**: 10ms (100Hz)
- **Control Loop Update**: 20ms (50Hz)  
- **Mode Switching**: < 100ms
- **Emergency Stop**: < 50ms

## User Interface

### Display Information
- Current assist mode
- Battery state of charge (%)
- Current speed (mph/kph)
- Power output (watts)
- Range estimate (miles)
- Learning progress indicator

### Control Inputs
- **Flat Button**: Initiate baseline learning
- **Hill Button**: Manual hill assist activation
- **Mode Selector**: Cycle through assist levels
- **Power Button**: System on/off

### Feedback
- **Visual**: LED indicators for mode status
- **Audio**: Beep confirmation for mode changes
- **Haptic**: Optional vibration for alerts

## Configuration Parameters

### Tunable Constants
```
// PID Controller Gains
float Kp = 1.0;  // Proportional gain
float Ki = 0.1;  // Integral gain  
float Kd = 0.05; // Derivative gain

// Assist Factors
float drag_assist = 1.0;     // 100% baseline effort
float level_1_assist = 0.7;  // 70% baseline effort
float level_2_assist = 0.5;  // 50% baseline effort
float level_3_assist = 0.3;  // 30% baseline effort

// Hill Detection
float hill_threshold = 50;    // Nm above baseline
float hill_flatten_factor = 0.8; // Partial compensation

// Battery Management
float low_battery_threshold = 20; // Percent SOC
float cutoff_voltage = 42.0;      // Volts

// Trailer Profiles
float empty_trailer = 1.5;   // Multiplier
float light_load = 2.0;
float medium_load = 2.5;
float heavy_load = 3.0;
```

## Data Storage

### Learning Data
- **Baseline Curve**: Speed/torque lookup table (EEPROM)
- **Confidence Levels**: Data quality indicators per speed point
- **Usage Statistics**: Total miles, battery cycles, etc.

### User Preferences
- **Preferred Assist Level**: Default startup mode
- **Hill Sensitivity**: Threshold for auto hill detection
- **Display Units**: mph/kph, watts/percentage, etc.

## Development Phases

### Phase 1: Basic Implementation
- [ ] Hardware assembly and sensor calibration
- [ ] Basic PID control loop
- [ ] Drag compensation mode
- [ ] Manual learning mode with flat button

### Phase 2: Adaptive Features  
- [ ] Automatic hill detection and compensation
- [ ] Multiple assist levels with baseline scaling
- [ ] Battery management and low-power mode
- [ ] User interface and mode switching

### Phase 3: Advanced Features
- [ ] Trailer compensation profiles
- [ ] Automatic flat terrain detection for learning
- [ ] Data logging and performance analytics
- [ ] Mobile app integration (optional)

### Phase 4: Optimization
- [ ] Machine learning for pattern recognition
- [ ] Predictive assist based on route history
- [ ] Energy optimization algorithms
- [ ] Advanced safety features

## Success Criteria

1. **Learning Accuracy**: System learns baseline within 5% of manual measurement
2. **Drag Compensation**: Motor drag imperceptible during normal riding
3. **Hill Flattening**: 15% grade feels like flat terrain
4. **Range Extension**: 200+ mile range with mixed terrain
5. **Response Time**: < 200ms lag between effort change and assist adjustment
6. **Reliability**: 1000+ mile operation without recalibration

## Safety Considerations

- **Fail-Safe Modes**: System defaults to manual control on any sensor failure
- **Emergency Stop**: Immediate power cutoff capability
- **Thermal Management**: Controller and motor temperature monitoring  
- **User Training**: Clear documentation for proper operation
- **Testing Protocol**: Comprehensive validation before real-world use

---

*Document Version: 1.0*  
*Last Updated: August 18, 2025*