# Detailed Technical Specifications

## Core System Architecture

Our torque-sensing e-bike conversion system employs a distributed architecture with physically separated components to optimize thermal management, reliability, and adaptability.

### Torque Sensing System

#### Base Specifications
- **Sensor Type:** Strain gauge-based torque sensor (TSDZ2 replacement unit)
- **Sensitivity:** 0.2Nm minimum detectable torque
- **Resolution:** 12-bit ADC (4096 steps)
- **Response Time:** 4ms from force application to signal output
- **Operating Range:** 0-80Nm
- **Power Requirements:** 5V DC, 20mA
- **Output Signal:** 0.5-4.5V analog (1V = 0Nm, linear scale)
- **Weight:** 105g (sensor only)

#### Bottom Bracket Interface Options

| Interface Type | Weight | Compatible BB Standards | Bearing Type | Notes |
|----------------|--------|-------------------------|--------------|-------|
| Standard BSA | 145g | 68/73mm threaded | 6902-2RS | Simplest installation |
| PF30 Adapter | 165g | PF30, BB30 | 6806-2RS | For modern carbon frames |
| BB86/92 Adapter | 175g | BB86, BB92, BB90 | 6805-2RS | Common on newer bikes |
| Italian Thread | 148g | 70mm Italian threaded | 6902-2RS | For classic Italian frames |
| T47 Adapter | 170g | T47 (68/73/86/92mm) | 6902-2RS | Newer threaded standard |

#### Installation Requirements
- Bottom bracket removal tools specific to bike's BB standard
- 8mm and 10mm Allen wrenches
- Torque wrench (5-40Nm range)
- Bearing press (for press-fit installations)
- Anti-seize compound (for threaded installations)
- Waterproof grease

### Control System Options

#### Base Controller (Arduino)
- **Microcontroller:** ATmega328P @ 16MHz
- **Input Voltage:** 36-52V DC
- **Logic Voltage:** 5V DC isolated
- **Motor Control:** 12-bit PWM @ 16kHz
- **Current Sensing:** 0.5% precision hall-effect sensor
- **Maximum Current:** 20A continuous, 25A peak (30 seconds)
- **Protection:** Overcurrent, overvoltage, thermal, short-circuit
- **Communications:** Serial UART (115200 baud)
- **Inputs:** Torque sensor, speed sensor, brake sensor, throttle (optional)
- **Dimensions:** 65mm × 45mm × 15mm
- **Weight:** 35g
- **Operating Temperature:** -10°C to +60°C

#### Advanced Controller (ESP32-based)
- **Microcontroller:** ESP32 dual-core @ 240MHz
- **Input Voltage:** 36-52V DC
- **Logic Voltage:** 3.3V DC isolated
- **Motor Control:** 12-bit PWM @ 20kHz with sinusoidal drive
- **Current Sensing:** 0.25% precision hall-effect sensor
- **Maximum Current:** 25A continuous, 35A peak (30 seconds)
- **Protection:** Overcurrent, overvoltage, thermal, short-circuit
- **Communications:** Bluetooth 4.2, WiFi 802.11n, Serial UART
- **Inputs:** Torque sensor, speed sensor, brake sensor, throttle (optional)
- **Additional Features:** Smartphone connectivity, data logging, GPS integration (optional)
- **Dimensions:** 70mm × 48mm × 15mm
- **Weight:** 42g
- **Operating Temperature:** -20°C to +70°C

#### Premium Controller (VESC-based)
- **Microcontroller:** STM32F4 @ 168MHz
- **Input Voltage:** 36-60V DC
- **Logic Voltage:** 3.3V DC isolated
- **Motor Control:** Field Oriented Control (FOC) @ 30kHz
- **Current Sensing:** 0.1% precision hall-effect sensor
- **Maximum Current:** 30A continuous, 50A peak (30 seconds)
- **Protection:** Comprehensive with programmable limits
- **Communications:** USB, CAN bus, UART, Bluetooth (optional)
- **Inputs:** Multiple analog and digital inputs, configurable
- **Additional Features:** Advanced motor control algorithms, extensive data analysis
- **Dimensions:** 70mm × 50mm × 20mm
- **Weight:** 65g
- **Operating Temperature:** -20°C to +80°C

#### Software/Firmware Options

| Feature | Base Firmware | Advanced Firmware | Premium Firmware |
|---------|---------------|-------------------|------------------|
| Assistance Levels | 3 preset | 5 customizable | Infinitely variable |
| Torque Curve | Linear | Customizable | Fully programmable |
| Power Limits | Fixed | User adjustable | Dynamic (terrain adaptive) |
| Cadence Detection | Basic | Enhanced | Precise with prediction |
| Range Prediction | No | Basic | Advanced with route analysis |
| Data Logging | No | Basic | Comprehensive |
| Temperature Management | Threshold based | Dynamic | Predictive |
| Smartphone Integration | No | Basic app | Full featured app |
| Anti-theft | No | Basic | GPS tracking capable |
| Hill Detection | No | Yes | Advanced with pre-emptive boost |
| Auto Power Adjustment | No | Basic | Advanced with rider learning |

### Motor System Options

#### 250W Front Hub
- **Rated Power:** 250W nominal, 500W peak
- **Voltage:** 36V/48V/52V compatible
- **Nominal Current:** 7A @ 36V
- **Peak Current:** 15A (30 seconds)
- **Motor Type:** Direct drive, gearless
- **Construction:** 12 pole, 9 phase
- **Efficiency:** 85-90%
- **Nominal Speed:** 380RPM @ 36V
- **Torque:** 10Nm nominal, 25Nm peak
- **Weight:** 1.4kg (motor only)
- **Diameter:** 118mm
- **Axle Width:** 100mm standard front dropout
- **Axle Type:** 10mm with flat sides
- **Spokes:** 36H, 13g stainless steel
- **Operating Temperature:** -10°C to +70°C
- **IP Rating:** IP65

#### 350W Front Hub
- **Rated Power:** 350W nominal, 700W peak
- **Voltage:** 36V/48V/52V compatible
- **Nominal Current:** 10A @ 36V
- **Peak Current:** 20A (30 seconds)
- **Motor Type:** Direct drive, gearless
- **Construction:** 12 pole, 9 phase
- **Efficiency:** 87-92%
- **Nominal Speed:** 360RPM @ 36V
- **Torque:** 14Nm nominal, 32Nm peak
- **Weight:** 1.6kg (motor only)
- **Diameter:** 122mm
- **Axle Width:** 100mm standard front dropout
- **Axle Type:** 12mm with flat sides
- **Spokes:** 36H, 13g stainless steel
- **Operating Temperature:** -10°C to +70°C
- **IP Rating:** IP65

#### 500W Front Hub
- **Rated Power:** 500W nominal, 900W peak
- **Voltage:** 36V/48V/52V compatible
- **Nominal Current:** 14A @ 36V
- **Peak Current:** 25A (30 seconds)
- **Motor Type:** Direct drive, gearless
- **Construction:** 16 pole, 12 phase
- **Efficiency:** 88-93%
- **Nominal Speed:** 340RPM @ 36V
- **Torque:** 18Nm nominal, 40Nm peak
- **Weight:** 1.9kg (motor only)
- **Diameter:** 128mm
- **Axle Width:** 100mm standard front dropout
- **Axle Type:** 12mm with flat sides
- **Spokes:** 36H, 12g stainless steel
- **Operating Temperature:** -15°C to +75°C
- **IP Rating:** IP65
- **Additional Features:** Temperature sensor, phase wire protection

### User Interface Options

#### Basic Display
- **Type:** 0.96" OLED monochrome
- **Resolution:** 128×64 pixels
- **Power:** 5V DC, 20mA
- **Interface:** 4-wire (power, ground, SCL, SDA)
- **Information:** Battery level, assistance level, speed, odometer
- **Controls:** 3-button pad (up, down, select)
- **Dimensions:** 45mm × 30mm × 12mm
- **Weight:** 25g
- **Mounting:** Handlebar clamp (22.2-31.8mm)
- **IP Rating:** IP65

#### Standard Display
- **Type:** 1.3" LCD color
- **Resolution:** 240×240 pixels
- **Power:** 5V DC, 40mA
- **Interface:** 5-wire (power, ground, SCL, SDA, interrupt)
- **Information:** Battery level, assistance level, speed, power output, range estimate, trip data
- **Controls:** 5-button pad (up, down, select, menu, power)
- **Dimensions:** 62mm × 40mm × 15mm
- **Weight:** 45g
- **Mounting:** Handlebar clamp (22.2-31.8mm)
- **IP Rating:** IP65
- **Additional Features:** Backlight, auto brightness

#### Premium Display
- **Type:** 2.4" TFT color touchscreen
- **Resolution:** 320×240 pixels
- **Power:** 5V DC, 80mA
- **Interface:** 6-wire (power, ground, SPI interface)
- **Information:** Comprehensive data display, customizable screens
- **Controls:** Touchscreen + 2 physical buttons
- **Dimensions:** 75mm × 50mm × 15mm
- **Weight:** 65g
- **Mounting:** Adjustable mount (22.2-31.8mm)
- **IP Rating:** IP67
- **Additional Features:** Bluetooth connectivity, smartphone pairing, custom screen configuration

#### Smartphone Integration (with ESP32 Advanced Controller)
- **Connectivity:** Bluetooth 4.2, WiFi for updates
- **App Compatibility:** iOS 12+, Android 8+
- **Features:** Firmware updates, customization, route recording, performance analysis
- **Real-time Data:** Power output, battery consumption, range estimation
- **Settings Adjustment:** Assistance levels, power limits, torque response
- **Advanced Features:** Theft alert, maintenance reminders, ride sharing

## System Integration Specifications

### Wiring Harness
- **Main Cable:** 4-pin waterproof connector (power, ground, hall sensor, throttle signal)
- **Sensor Cable:** 3-pin waterproof connector (power, ground, signal)
- **Display Cable:** 4-6 pin waterproof connector (depending on display type)
- **Wire Gauge:** 14AWG (power), 20AWG (signals)
- **Insulation:** Silicone jacket, UV and abrasion resistant
- **Waterproofing:** IP67 connectors with internal seals
- **Length:** 800mm main cable, 600mm sensor cable, 400mm display cable
- **Routing:** Internal where possible, protective braiding for external runs

### Mechanical Mounting
- **Controller Housing:** Machined aluminum enclosure with cooling fins
- **Mounting Options:** Water bottle mounts, frame tube straps, custom brackets
- **Motor Installation:** Standard dropout mounting with reinforced torque arms
- **Bottom Bracket Installation:** Standard bicycle tools with custom installation guide
- **Cable Management:** Included cable guides, heat-shrink tubing, zip ties

### System Integration
- **Brake Sensors:** Optional 2-wire magnetic sensors for power cutoff
- **Throttle Compatibility:** Standard 0-5V hall effect throttle (optional)
- **Gear Sensors:** Optional shift detection for momentary power reduction
- **Battery Compatibility:** Standard XT60/Anderson connectors, 36V/48V/52V systems
- **BMS Interface:** Compatible with standard battery management systems
- **External Sensors:** Expansion port for cadence, heart rate, or custom sensors

## Performance Specifications

### Power Delivery
- **Assistance Ratio:** 25-300% of rider input (adjustable)
- **Power Curve:** Customizable torque response curve
- **Maximum Assistance:** Legal limit compliance (250W/20mph EU, 750W/28mph US)
- **Power Measurement Accuracy:** ±3% across full range
- **Torque Measurement Accuracy:** ±5% across full range
- **Response Linearity:** ±2% deviation from ideal curve

### Efficiency
- **End-to-End Efficiency:** 85-92% (battery to mechanical power)
- **Controller Efficiency:** 95-98% (electrical input to output)
- **Motor Efficiency:** 90-94% (electrical to mechanical)
- **Standby Power:** <1W with display, <0.1W without display
- **Range Impact:** 35-80km additional range (battery dependent)

### Reliability Metrics
- **Sensor MTBF:** >20,000 hours
- **Controller MTBF:** >15,000 hours
- **Motor MTBF:** >10,000 hours
- **System Design Life:** 5+ years with normal usage
- **Water/Dust Resistance:** IP65 minimum for all components
- **Operating Temperature Range:** -10°C to +60°C
- **Storage Temperature Range:** -20°C to +70°C
- **Vibration Tolerance:** Tested to bicycle industry standards
- **Impact Resistance:** Designed to withstand normal riding impacts

## System Configuration Matrix

| Component | Basic Package | Standard Package | Premium Package | Ultra Package |
|-----------|---------------|-----------------|-----------------|---------------|
| Torque Sensor | Standard | Standard | Standard | Standard |
| BB Adapters | BSA Only | BSA/PF30 | All Types | All Types |
| Controller | Arduino Base | ESP32 Advanced | VESC Premium | VESC Premium |
| Firmware | Base | Advanced | Premium | Premium |
| Motor | 250W Front | 350W Front | 500W Front | 500W Front |
| Display | Basic | Standard | Premium | Premium + App |
| Wiring | Standard | Enhanced | Premium | Premium |
| Battery | Not Included | Not Included | Not Included | Optional Add-on |
| Installation | DIY Guide | DIY Guide + Support | Installer Network | Professional Installation |
| Warranty | 6 Months | 12 Months | 24 Months | 36 Months |
| Retail Price | $199-249 | $299-349 | $399-449 | $549-649 |

## Customization Options

### Performance Tuning
- **Torque Curves:** Multiple preset curves or fully custom programming
- **Power Limits:** Adjustable maximum power (250W-500W)
- **Speed Limits:** Configurable maximum assisted speed
- **Cadence Preferences:** Optimized for low cadence (60-70 RPM) or high cadence (90-100 RPM)
- **Assistance Profiles:** Commuter, Sport, Range Maximizer, Climb Specialist

### Hardware Customization
- **Display Position:** Multiple mounting options and orientations
- **Controller Location:** Frame mount, bottle cage, or custom location
- **Cable Routing:** Internal, external, or hybrid options
- **Wheel Builds:** Standard 36H, lightweight 28H, or heavy-duty 40H
- **Color Options:** Black, silver, or custom anodizing for adapters

### Software Customization
- **User Interface:** Configurable data screens and information priority
- **Auto Features:** Automatic assistance based on heart rate, cadence, or grade
- **Smart Features:** Integration with fitness tracking, navigation, or smart home
- **Firmware Updates:** Regular feature additions and performance improvements
- **Custom Algorithms:** Special purpose algorithms for specific applications

## Compatibility Matrix

### Frame Compatibility

| Frame Type | Compatibility | Special Requirements | Notes |
|------------|---------------|----------------------|-------|
| Road Bike - Carbon | High | PF30/BB30 adapters | Check clearance for wiring |
| Road Bike - Aluminum | Very High | Various BB adapters | Ideal candidate |
| Road Bike - Steel | Very High | BSA adapters common | Excellent choice |
| Mountain Bike - Hardtail | High | Check BB standard | Good option |
| Mountain Bike - Full Suspension | Medium | Limited space for components | Careful placement needed |
| Hybrid/City Bike | Very High | Various BB standards | Ideal candidate |
| Folding Bike | Medium | Limited space, unique BBs | Case-by-case evaluation |
| Cargo Bike | High | Often BSA BB | Great for load assistance |
| Recumbent | Medium | Unique BB positions | Custom installation |

### Drivetrain Compatibility

| Drivetrain Type | Compatibility | Special Requirements | Notes |
|-----------------|---------------|----------------------|-------|
| 1x Systems | Very High | None | Ideal setup |
| 2x Systems | High | Careful FD adjustment | Works well |
| 3x Systems | Medium | May need FD adjustment | Compatible with care |
| Internal Gear Hub | Very High | None | Excellent match |
| Belt Drive | Very High | None | Excellent match |
| Single Speed | Very High | None | Excellent match |
| Fixed Gear | High | Consider freewheeling | Compatible with care |
| Electronic Shifting | High | Signal interference check | Works well with testing |
