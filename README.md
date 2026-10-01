<div align="center">

# Fahim Faisal

**Autonomy systems · robotics · embedded control**

Perception, estimation, and control for underwater, aerial, and ground robots.

[![Portfolio](https://img.shields.io/badge/PORTFOLIO-0b0d12?style=for-the-badge&logo=googlechrome&logoColor=8ecdf0)](https://fh1m.github.io/)
[![Mongla](https://img.shields.io/badge/MONGLA-0b0d12?style=for-the-badge&logo=ros&logoColor=d6a35e)](https://github.com/fh1m/mongla_ws)
[![Repositories](https://img.shields.io/badge/REPOSITORIES-0b0d12?style=for-the-badge&logo=github&logoColor=f4f1ea)](https://github.com/fh1m?tab=repositories)

</div>

## Technical record

<div align="center">

| **CONTROL** | **VISION** | **LATENCY** | **PROTOCOL** | **VERIFICATION** |
|:---:|:---:|:---:|:---:|:---:|
| ![500 Hz](https://img.shields.io/badge/500_Hz-board_loop-cc6b5c?style=flat-square) | ![53.9 Hz](https://img.shields.io/badge/53.9_Hz-Hailo--8-5b9bd5?style=flat-square) | ![18.0 ms](https://img.shields.io/badge/18.0_ms-photon_to_detection-d6a35e?style=flat-square) | ![44 bytes](https://img.shields.io/badge/44_bytes-MAVLink_2-7a8f65?style=flat-square) | ![4,208 tests](https://img.shields.io/badge/4,208-tests-8b78a5?style=flat-square) |

</div>

## System focus

```mermaid
flowchart LR
    S["sensors<br/>camera · IMU · depth"] --> P["perception<br/>Hailo-8 · vision"]
    P --> E["estimation<br/>EKF · optical flow"]
    E --> D["decision<br/>mission · safety gates"]
    D --> C["control<br/>500 Hz board loop"]
    C --> A["actuation<br/>mixer · ESC · vehicle"]
    C -. "feedback" .-> S
```

The engineering problem is the boundary between each block: timing, uncertainty, interfaces, and failure behavior.

## Selected systems

### [Mongla](https://github.com/fh1m/mongla_ws)

![ROS 2](https://img.shields.io/badge/ROS_2-Jazzy%20%7C%20Humble-22314e?style=flat-square&logo=ros)
![Control](https://img.shields.io/badge/control-500_Hz-cc6b5c?style=flat-square)
![Vision](https://img.shields.io/badge/vision-Hailo--8-5b9bd5?style=flat-square)

Underwater autonomy stack: board-level control, edge perception, optical flow, right-invariant EKF, and explicit `BENCH / BUILT / BLOCKED / WATER` capability states.

### [Dristy](https://github.com/fh1m/Dristy)

![K210](https://img.shields.io/badge/K210-on--device_vision-5b9bd5?style=flat-square)
![Camera](https://img.shields.io/badge/camera-320×240-7a8f65?style=flat-square)
![Runtime](https://img.shields.io/badge/runtime-25.4_FPS-d6a35e?style=flat-square)

Vision co-processor for detection, colour, motion, QR, tags, and optical flow. The robot receives a compact result, not a video stream.

### [Flight and field robotics](https://fh1m.github.io/)

![GNC](https://img.shields.io/badge/GNC-TVC_%7C_VSLAM-8b78a5?style=flat-square)
![Robotics](https://img.shields.io/badge/field-rovers_%7C_arms-7a8f65?style=flat-square)
![Navigation](https://img.shields.io/badge/navigation-GPS--denied-cc6b5c?style=flat-square)

Flight computers, trajectory prediction, rover manipulation, OCR, and competition data pipelines.

## Engineering surface

`ROS 2` · `Python` · `C/C++` · `ESP32` · `K210` · `Hailo-8` · `MAVLink 2` · `OpenCV` · `EKF` · `Gazebo` · `ArduPilot`

<div align="center">

[![Read the portfolio](https://img.shields.io/badge/READ_THE_PORTFOLIO-0b0d12?style=for-the-badge&logo=readthedocs&logoColor=8ecdf0)](https://fh1m.github.io/)

<sub>Dhaka, Bangladesh</sub>

</div>
