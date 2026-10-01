<div align="center">

# Fahim Faisal

**Autonomy systems · robotics · embedded control**

Perception, estimation, and control for machines that operate outside the screen.

[![Portfolio](https://img.shields.io/badge/PORTFOLIO-0b0d12?style=for-the-badge&logo=googlechrome&logoColor=8ecdf0)](https://fh1m.github.io/)
[![24 repositories](https://img.shields.io/badge/24_PUBLIC_REPOSITORIES-0b0d12?style=for-the-badge&logo=github&logoColor=f4f1ea)](https://github.com/fh1m?tab=repositories)
[![Engineering log](https://img.shields.io/badge/ENGINEERING_LOG-0b0d12?style=for-the-badge&logo=readthedocs&logoColor=d6a35e)](https://fh1m.github.io/log)

</div>

## The record

<div align="center">

| **PUBLIC WORK** | **ACTIVE PERIOD** | **CONTROL** | **VISION** | **TESTED STACK** |
|:---:|:---:|:---:|:---:|:---:|
| `24 repos` | `2023 → now` | `500 Hz` | `53.9 Hz` | `4,208 tests` |

</div>

```mermaid
flowchart LR
    S["sense<br/>camera · IMU · depth"] --> P["perceive<br/>vision · ML"]
    P --> E["estimate<br/>EKF · optical flow"]
    E --> C["control<br/>firmware · GNC"]
    C --> A["act<br/>ESC · gimbal · vehicle"]
    A -. feedback .-> S
```

The recurring problem is not “which framework?” It is whether the measurement arrives in time, the estimate is honest, and the actuator does what the model asked.

## Engineering trajectory

**Foundations**<br>
[Scripts](https://github.com/fh1m/Scripts) · [PDE](https://github.com/fh1m/PDE) · [linear regression](https://github.com/fh1m/Linear-Regression) · [decision trees](https://github.com/fh1m/decision-tree-classifier) · [calibration challenge](https://github.com/fh1m/calib_challenge_fh1m)

Python, C, computer vision, first-principles ML, developer tooling, and the first attempts to make a machine infer something useful.

**Vehicle systems**<br>
[BRACU Duburi](https://github.com/fh1m/Duburi) · [Duburi R&D](https://github.com/fh1m/duburi-codebase_RND) · [Duburi simulator](https://github.com/fh1m/duburi-sim_ws) · [Arduino Vision](https://github.com/fh1m/Arduino-Vision)

Underwater robotics, simulation, embedded sensing, mission software, and vision that had to work on hardware rather than in a notebook.

**Perception becomes a subsystem**<br>
[Dristy](https://github.com/fh1m/Dristy) · [tracking and prediction](https://github.com/fh1m/Track_and_Predict) · [colour-sign detection](https://github.com/fh1m/Detect-color-signs) · [secure P2P chat](https://github.com/fh1m/secure-terminal-p2p-chat)

On-device vision, compact protocols, prediction, image processing, and systems that keep working when bandwidth and compute are limited.

**Integrated autonomy**<br>
[Mongla](https://github.com/fh1m/mongla_ws) · [portfolio and research log](https://fh1m.github.io/) · [current work](https://fh1m.github.io/now)

ROS 2, MAVLink 2, board-level control, Hailo-8 perception, right-invariant EKF, optical flow, simulation, and evidence-labelled capability states.

## Measured work

| signal | what it says |
| --- | --- |
| **500 Hz** | the reflex loop belongs on the board |
| **53.9 Hz** | edge vision can produce a usable observation |
| **18.0 ms** | photon-to-detection was measured, not guessed |
| **44 bytes** | a movement request can cross the cable without smuggling in actuator logic |
| **4,208 tests** | the stack is larger than its demo |
| **320 × 240 / 25.4 FPS** | Dristy gives a small camera a bounded job |

> An ESC can report a perfectly respectable zero with nothing attached. A message count is not proof that a thruster is alive.

## Research, leadership, and field work

[Underwater domain generalization](https://fh1m.github.io/about) · [RoboSub log](https://fh1m.github.io/log) · [URC work](https://fh1m.github.io/work) · [current direction](https://fh1m.github.io/now)

Rockets and UAVs: TVC control, flight computers, trajectory prediction, VSLAM, and GPS-denied navigation.<br>
Rovers: inverse kinematics, edge alignment, OCR, and competition data pipelines.<br>
Research: underwater object detection and recommendation systems.<br>
Leadership: engineering ownership across vision, autonomy integration, reliability, and field execution.

## Technical surface

`ROS 2` · `Python` · `C/C++` · `ESP32` · `K210` · `Hailo-8` · `MAVLink 2` · `OpenCV` · `EKF` · `Gazebo` · `ArduPilot`

<div align="center">

[![Full record](https://img.shields.io/badge/READ_THE_FULL_RECORD-0b0d12?style=for-the-badge&logo=readthedocs&logoColor=8ecdf0)](https://fh1m.github.io/)

<sub>Dhaka, Bangladesh</sub>

</div>
